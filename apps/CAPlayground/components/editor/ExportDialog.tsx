"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { ArrowLeft, Star, Youtube } from "lucide-react";
import { useEditor } from "./editor-context";
import { getProject, listFiles } from "@/lib/storage";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ExportDialog() {
  const { doc, flushPersist } = useEditor();
  const { toast } = useToast();

  const [exportOpen, setExportOpen] = useState(false);
  const [exportingTendies, setExportingTendies] = useState(false);
  const [exportView, setExportView] = useState<"select" | "success">("select");
  const [exportFilename, setExportFilename] = useState("");
  const [exportFormat, setExportFormat] = useState<"ca" | "tendies">("ca");

  const starMessage = useMemo(() => {
    const messages = [
      "Star this repo, make my day,\nIt helps the app in every way! 🌟",
      "A single star can light the way,\nSupport the code I've built today! 🚀",
      "Drop a star, don't walk away,\nIt keeps this project here to stay! 💪",
      "Give a star, don't delay,\nYou'll make my coder's day! 💫",
      "Star the repo, join the crew,\nIt means a lot, from me to you! 🤝",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [exportView]);

  useEffect(() => {
    if (exportOpen && doc?.meta.name) {
      setExportFilename(doc.meta.name);
    }
  }, [exportOpen, doc?.meta.name]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      const key = e.key.toLowerCase();
      if (key === "e") {
        e.preventDefault();
        setExportView("select");
        setExportOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


  const exportCA = async (downloadNameOverride?: string): Promise<boolean> => {
    try {
      if (!doc) return false;
      try {
        await flushPersist();
      } catch {}
      const proj = await getProject(doc.meta.id);
      const baseName =
        (downloadNameOverride && downloadNameOverride.trim()) ||
        proj?.name ||
        doc.meta.name ||
        "Project";
      const nameSafe = baseName.replace(/[^a-z0-9\-_]+/gi, "-");
      const folder = `${proj?.name || doc.meta.name || "Project"}.ca`;
      const allFiles = await listFiles(doc.meta.id, `${folder}/`);
      const outputZip = new JSZip();
      const isGyro = doc.meta.gyroEnabled ?? false;

      if (isGyro) {
        const wallpaperPrefix = `${folder}/Wallpaper.ca/`;
        for (const f of allFiles) {
          let rel: string | null = null;
          if (f.path.startsWith(wallpaperPrefix)) {
            rel = `Wallpaper.ca/${f.path.substring(wallpaperPrefix.length)}`;
          } else {
            rel = null;
          }
          if (!rel) continue;
          if (f.type === "text") {
            outputZip.file(rel, String(f.data));
          } else {
            const buf = f.data as ArrayBuffer;
            outputZip.file(rel, buf);
          }
        }
      } else {
        const backgroundPrefix = `${folder}/Background.ca/`;
        const floatingPrefix = `${folder}/Floating.ca/`;
        for (const f of allFiles) {
          let rel: string | null = null;
          if (f.path.startsWith(backgroundPrefix)) {
            rel = `Background.ca/${f.path.substring(backgroundPrefix.length)}`;
          } else if (f.path.startsWith(floatingPrefix)) {
            rel = `Floating.ca/${f.path.substring(floatingPrefix.length)}`;
          } else {
            rel = null;
          }
          if (!rel) continue;
          if (f.type === "text") {
            outputZip.file(rel, String(f.data));
          } else {
            const buf = f.data as ArrayBuffer;
            outputZip.file(rel, buf);
          }
        }
      }

      const finalZipBlob = await outputZip.generateAsync({ type: "blob" });

      const url = URL.createObjectURL(finalZipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nameSafe}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error("Export failed", e);
      toast({
        title: "导出失败",
        description: "导出 .ca 文件失败。请重试。",
        variant: "destructive",
      });
      return false;
    }
  };

  const exportTendies = async (downloadNameOverride?: string): Promise<boolean> => {
    try {
      setExportingTendies(true);
      if (!doc) return false;
      try {
        await flushPersist();
      } catch {}
      const proj = await getProject(doc.meta.id);
      const baseName =
        (downloadNameOverride && downloadNameOverride.trim()) ||
        proj?.name ||
        doc.meta.name ||
        "Project";
      const nameSafe = baseName.replace(/[^a-z0-9\-_]+/gi, "-");
      const isGyro = doc.meta.gyroEnabled ?? false;

      const templateEndpoint = isGyro
        ? "/api/templates/gyro-tendies"
        : "/api/templates/tendies";
      const templateResponse = await fetch(templateEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/zip",
        },
        signal: AbortSignal.timeout(30000),
      });

      if (!templateResponse.ok) {
        throw new Error(
          `Failed to fetch tendies template: ${templateResponse.status} ${templateResponse.statusText}`,
        );
      }

      const templateArrayBuffer = await templateResponse.arrayBuffer();

      if (templateArrayBuffer.byteLength === 0) {
        throw new Error("Error with length of tendies file");
      }

      const templateZip = new JSZip();
      await templateZip.loadAsync(templateArrayBuffer);

      const outputZip = new JSZip();

      for (const [relativePath, file] of Object.entries(templateZip.files)) {
        if (!file.dir) {
          const content = await file.async("uint8array");
          outputZip.file(relativePath, content);
        }
      }
      const folder = `${proj?.name || doc.meta.name || "Project"}.ca`;
      const allFiles = await listFiles(doc.meta.id, `${folder}/`);

      if (isGyro) {
        const wallpaperPrefix = `${folder}/Wallpaper.ca/`;
        const caMap: Array<{ path: string; data: Uint8Array | string }> = [];
        for (const f of allFiles) {
          if (f.path.startsWith(wallpaperPrefix)) {
            caMap.push({
              path: f.path.substring(wallpaperPrefix.length),
              data:
                f.type === "text"
                  ? String(f.data)
                  : new Uint8Array(f.data as ArrayBuffer),
            });
          }
        }
        const caFolderPath =
          "descriptors/99990000-0000-0000-0000-000000000000/versions/0/contents/7400.WWDC_2022-390w-844h@3x~iphone.wallpaper/wallpaper.ca";
        for (const file of caMap) {
          const fullPath = `${caFolderPath}/${file.path}`;
          if (typeof file.data === "string") outputZip.file(fullPath, file.data);
          else outputZip.file(fullPath, file.data);
        }
      } else {
        const backgroundPrefix = `${folder}/Background.ca/`;
        const floatingPrefix = `${folder}/Floating.ca/`;
        const caMap: Record<
          "background" | "floating",
          Array<{ path: string; data: Uint8Array | string }>
        > = { background: [], floating: [] };
        for (const f of allFiles) {
          if (f.path.startsWith(backgroundPrefix)) {
            caMap.background.push({
              path: f.path.substring(backgroundPrefix.length),
              data:
                f.type === "text"
                  ? String(f.data)
                  : new Uint8Array(f.data as ArrayBuffer),
            });
          } else if (f.path.startsWith(floatingPrefix)) {
            caMap.floating.push({
              path: f.path.substring(floatingPrefix.length),
              data:
                f.type === "text"
                  ? String(f.data)
                  : new Uint8Array(f.data as ArrayBuffer),
            });
          }
        }
        const caKeys = ["background", "floating"] as const;
        for (const key of caKeys) {
          const caFolderPath =
            key === "floating"
              ? "descriptors/09E9B685-7456-4856-9C10-47DF26B76C33/versions/1/contents/7400.WWDC_2022-390w-844h@3x~iphone.wallpaper/7400.WWDC_2022_Floating-390w-844h@3x~iphone.ca"
              : "descriptors/09E9B685-7456-4856-9C10-47DF26B76C33/versions/1/contents/7400.WWDC_2022-390w-844h@3x~iphone.wallpaper/7400.WWDC_2022_Background-390w-844h@3x~iphone.ca";
          for (const file of caMap[key]) {
            const fullPath = `${caFolderPath}/${file.path}`;
            if (typeof file.data === "string") outputZip.file(fullPath, file.data);
            else outputZip.file(fullPath, file.data);
          }
        }
      }

      const finalZipBlob = await outputZip.generateAsync({ type: "blob" });

      const url = URL.createObjectURL(finalZipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nameSafe}.tendies`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({
        title: "导出成功",
        description: `Tendies 文件 "${nameSafe}.tendies" 已下载。`,
      });
      return true;
    } catch (e) {
      console.error("Tendies export failed", e);
      toast({
        title: "导出失败",
        description: "导出 tendies 文件失败。请重试。",
        variant: "destructive",
      });
      return false;
    } finally {
      setExportingTendies(false);
    }
  };

  return (
    <div>
      <Button
        variant="secondary"
        disabled={!doc}
        onClick={() => {
          setExportView("select");
          setExportOpen(true);
        }}
        className="px-3 sm:px-4"
      >
        导出
      </Button>
      <Dialog
        open={exportOpen}
        onOpenChange={(v) => {
          setExportOpen(v);
          if (!v) setExportView("select");
        }}
      >
        <DialogContent className="sm:max-w-md p-4">
          <DialogHeader
            className={`${
              exportView === "success"
                ? "flex items-center justify-start py-1"
                : "py-2"
            }`}
          >
            {exportView === "success" ? (
              <Button
                variant="ghost"
                className="h-8 w-auto px-2 gap-1 self-start"
                onClick={() => setExportView("select")}
              >
                <ArrowLeft className="h-4 w-4" /> 返回
              </Button>
            ) : (
              <>
                <DialogTitle>导出</DialogTitle>
                <DialogDescription>
                  选择文件名和格式，然后导出您的项目。
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <div className="relative overflow-hidden">
            <div
              className="flex w-[200%] transition-transform duration-300 ease-out"
              style={{
                transform:
                  exportView === "select" ? "translateX(0%)" : "translateX(-50%)",
              }}
            >
              <div
                className={`w-1/2 px-0 ${
                  exportView === "success" ? "h-0 overflow-hidden" : ""
                }`}
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="export-filename">文件名</Label>
                    <Input
                      id="export-filename"
                      value={exportFilename}
                      onChange={(e) => setExportFilename(e.target.value)}
                      placeholder={doc?.meta.name || "Project"}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="export-format">格式</Label>
                    <ToggleGroup
                      type="single"
                      value={exportFormat}
                      onValueChange={(value) => {
                        if (!value) return;
                        setExportFormat(value as "ca" | "tendies");
                      }}
                      className="w-full"
                      aria-label="选择导出格式"
                    >
                      <ToggleGroupItem
                        value="ca"
                        aria-label="导出 CA 包"
                        className="flex-1 text-xs sm:text-sm"
                      >
                        .ca bundle
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="tendies"
                        aria-label="导出 tendies 文件"
                        className="flex-1 text-xs sm:text-sm"
                      >
                        Tendies
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exportFormat === "ca"
                        ? "下载包含 Background.ca 和 Floating.ca 文件的 .zip 压缩包。"
                        : "创建与 Nugget 和 Pocket Poster 兼容的 .tendies 壁纸文件。"}
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Button
                      className="w-full"
                      disabled={!doc || exportingTendies}
                      onClick={async () => {
                        if (!doc) return;
                        const base =
                          exportFilename.trim() || doc.meta.name || "Project";
                        if (exportFormat === "ca") {
                          const ok = await exportCA(base);
                          if (ok) setExportView("success");
                        } else {
                          const ok = await exportTendies(base);
                          if (ok) setExportView("success");
                        }
                      }}
                    >
                      {exportFormat === "ca"
                        ? "导出 .ca"
                        : exportingTendies
                          ? "正在导出 tendies…"
                          : "导出 tendies"}
                    </Button>
                  </div>
                </div>
              </div>
              <div
                className={`w-1/2 px-0 ${
                  exportView === "select" ? "h-0 overflow-hidden" : ""
                }`}
              >
                <div className="pt-0 pb-4 flex flex-col items-center text-center gap-2.5">
                  <div className="text-2xl font-semibold">
                    感谢使用 CAPlayground！
                  </div>
                  <div className="text-sm text-muted-foreground">
                    接下来我该做什么？
                  </div>
                  <div className="w-full max-w-md text-left space-y-3 text-sm sm:text-base">
                    <div className="flex gap-3 border rounded-md px-4 py-3">
                      <div className="font-medium">1.</div>
                      <div className="space-y-1">
                        <div className="font-medium">观看视频</div>
                        <div>观看如何使用 Pocket Poster 或 Nugget 的视频。</div>
                        <a
                          href="https://www.youtube.com/watch?v=nSBQIwAaAEc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                        >
                          <Youtube className="h-4 w-4" />
                          观看视频
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-3 border rounded-md px-4 py-3">
                      <div className="font-medium">2.</div>
                      <div className="space-y-1">
                        <div className="font-medium">测试您的壁纸</div>
                        <div>将壁纸应用到您的设备并测试。</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <a
                      href="https://github.com/CAPlayground/CAPlayground"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Star className="h-4 w-4" />
                      给仓库加星
                    </a>
                    <Button
                      variant="default"
                      className="text-sm"
                      onClick={() => setExportOpen(false)}
                    >
                      完成
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
