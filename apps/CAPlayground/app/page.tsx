"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FolderOpen, Upload } from "lucide-react";
import { createProject, listProjects, ensureUniqueProjectName, putTextFile } from "@/lib/storage";
import { getDevicesByCategory } from "@/lib/devices";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Array<{ id: string; name: string; createdAt: string }>>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [rootWidth, setRootWidth] = useState(390);
  const [rootHeight, setRootHeight] = useState(844);
  const [useDeviceSelector, setUseDeviceSelector] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("iPhone 14");
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "CAPlayground - 壁纸编辑器";
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const list = await listProjects();
      setProjects(list.map(p => ({ id: p.id, name: p.name, createdAt: p.createdAt })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    const name = newProjectName.trim() || "新壁纸";
    let w = rootWidth, h = rootHeight;
    
    if (useDeviceSelector) {
      const devices = getDevicesByCategory("iPhone")
        .concat(getDevicesByCategory("iPad"))
        .concat(getDevicesByCategory("iPod touch"));
      const device = devices.find(d => d.name === selectedDevice);
      if (device) { w = device.width; h = device.height; }
    }

    const id = Date.now().toString();
    const uniqueName = await ensureUniqueProjectName(name);
    await createProject({ id, name: uniqueName, createdAt: new Date().toISOString(), width: w, height: h, gyroEnabled });
    
    // 创建基础文件结构
    const folder = `${uniqueName}.ca`;
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>rootDocument</key>
  <string>main.caml</string>
</dict>
</plist>`;
    const assetManifest = `<?xml version="1.0" encoding="UTF-8"?>
<caml xmlns="http://www.apple.com/CoreAnimation/1.0">
  <MicaAssetManifest>
    <modules type="NSArray"/>
  </MicaAssetManifest>
</caml>`;
    const emptyCaml = `<?xml version="1.0" encoding="UTF-8"?><caml xmlns="http://www.apple.com/CoreAnimation/1.0"/>`;
    
    if (gyroEnabled) {
      await putTextFile(id, `${folder}/Wallpaper.ca/main.caml`, emptyCaml);
      await putTextFile(id, `${folder}/Wallpaper.ca/index.xml`, indexXml);
      await putTextFile(id, `${folder}/Wallpaper.ca/assetManifest.caml`, assetManifest);
    } else {
      await putTextFile(id, `${folder}/Floating.ca/main.caml`, emptyCaml);
      await putTextFile(id, `${folder}/Floating.ca/index.xml`, indexXml);
      await putTextFile(id, `${folder}/Floating.ca/assetManifest.caml`, assetManifest);
      await putTextFile(id, `${folder}/Background.ca/main.caml`, emptyCaml);
      await putTextFile(id, `${folder}/Background.ca/index.xml`, indexXml);
      await putTextFile(id, `${folder}/Background.ca/assetManifest.caml`, assetManifest);
    }
    
    setIsCreateOpen(false);
    router.push(`/editor/${id}`);
  };

  const openRecentProject = (id: string) => {
    router.push(`/editor/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  const recentProjects = projects.slice(0, 6);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo / Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">CAPlayground</h1>
          <p className="text-muted-foreground">iOS 动态壁纸编辑器</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setIsCreateOpen(true)}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">新建项目</h3>
                <p className="text-sm text-muted-foreground">创建新的壁纸项目</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => router.push("/projects")}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">打开项目</h3>
                <p className="text-sm text-muted-foreground">浏览所有项目</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">最近项目</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recentProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => openRecentProject(project.id)}
                >
                  <CardContent className="p-4">
                    <p className="font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新项目</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">项目名称</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="新壁纸"
                onKeyDown={(e) => e.key === "Enter" && createNewProject()}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="device-selector" 
                checked={useDeviceSelector} 
                onCheckedChange={(checked) => setUseDeviceSelector(!!checked)}
              />
              <Label htmlFor="device-selector" className="cursor-pointer">
                按设备设置尺寸
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gyro-enabled" 
                checked={gyroEnabled} 
                onCheckedChange={(checked) => setGyroEnabled(!!checked)}
              />
              <Label htmlFor="gyro-enabled" className="cursor-pointer">
                启用陀螺仪（视差效果）
              </Label>
            </div>
            
            {useDeviceSelector ? (
              <div className="space-y-2">
                <Label>设备</Label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择设备" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">iPhone</div>
                    {getDevicesByCategory("iPhone").map((device) => (
                      <SelectItem key={device.name} value={device.name}>
                        {device.name} ({device.width} × {device.height})
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">iPad</div>
                    {getDevicesByCategory("iPad").map((device) => (
                      <SelectItem key={device.name} value={device.name}>
                        {device.name} ({device.width} × {device.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">390 × 844 是 iPhone 最兼容的默认尺寸。</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="width">宽度 (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    min={1}
                    value={rootWidth}
                    onChange={(e) => setRootWidth(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">高度 (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    min={1}
                    value={rootHeight}
                    onChange={(e) => setRootHeight(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>取消</Button>
            <Button onClick={createNewProject}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
