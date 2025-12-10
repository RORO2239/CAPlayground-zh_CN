"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InspectorTabProps } from "../types";

export function GradientTab({
  selected,
  updateLayer,
  updateLayerTransient,
  getBuf,
  setBuf,
  clearBuf,
}: Omit<InspectorTabProps, 'round2' | 'fmt2' | 'fmt0' | 'selectedBase'>) {
  if (selected.type !== 'gradient') return null;

  return (
    <div className="space-y-4">
      {/* Gradient Type */}
      <div className="space-y-1">
        <Label>类型</Label>
        <Select value={(selected as any).gradientType || 'axial'}
          onValueChange={(v) => updateLayer(selected.id, { gradientType: v } as any)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="axial">轴向 (线性)</SelectItem>
            <SelectItem value="radial">径向</SelectItem>
            <SelectItem value="conic">圆锥</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Start Point */}
      <div className="space-y-1">
        <Label htmlFor="startPointX">起点 X</Label>
        <div className="flex items-center gap-2 w-full">
          <Slider
            id="startPointX"
            value={[Math.round(((selected as any).startPoint?.x ?? 0) * 100)]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => {
              const val = Math.round(v) / 100;
              updateLayerTransient(selected.id, { startPoint: { ...(selected as any).startPoint, x: val } } as any);
            }}
          />
          <Input
            id="startPointXPct"
            className="w-24 h-8 text-right"
            type="number"
            min={0}
            max={100}
            step={1}
            value={getBuf('startPointXPct', String(Math.round(((selected as any).startPoint?.x ?? 0) * 100)))}
            onChange={(e) => {
              setBuf('startPointXPct', e.target.value);
              const v = e.target.value.trim();
              if (v === "") return;
              const p = Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayerTransient(selected.id, { startPoint: { ...(selected as any).startPoint, x: val } } as any);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); e.preventDefault(); } }}
            onBlur={(e) => {
              const v = e.target.value.trim();
              const p = v === "" ? 0 : Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayer(selected.id, { startPoint: { ...(selected as any).startPoint, x: val } } as any);
              clearBuf('startPointXPct');
            }}
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="startPointY">起点 Y</Label>
        <div className="flex items-center gap-2 w-full">
          <Slider
            id="startPointY"
            value={[Math.round(((selected as any).startPoint?.y ?? 0) * 100)]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => {
              const val = Math.round(v) / 100;
              updateLayerTransient(selected.id, { startPoint: { ...(selected as any).startPoint, y: val } } as any);
            }}
          />
          <Input
            id="startPointYPct"
            className="w-24 h-8 text-right"
            type="number"
            min={0}
            max={100}
            step={1}
            value={getBuf('startPointYPct', String(Math.round(((selected as any).startPoint?.y ?? 0) * 100)))}
            onChange={(e) => {
              setBuf('startPointYPct', e.target.value);
              const v = e.target.value.trim();
              if (v === "") return;
              const p = Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayerTransient(selected.id, { startPoint: { ...(selected as any).startPoint, y: val } } as any);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); e.preventDefault(); } }}
            onBlur={(e) => {
              const v = e.target.value.trim();
              const p = v === "" ? 0 : Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayer(selected.id, { startPoint: { ...(selected as any).startPoint, y: val } } as any);
              clearBuf('startPointYPct');
            }}
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      {/* End Point */}
      <div className="space-y-1">
        <Label htmlFor="endPointX">终点 X</Label>
        <div className="flex items-center gap-2 w-full">
          <Slider
            id="endPointX"
            value={[Math.round(((selected as any).endPoint?.x ?? 1) * 100)]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => {
              const val = Math.round(v) / 100;
              updateLayerTransient(selected.id, { endPoint: { ...(selected as any).endPoint, x: val } } as any);
            }}
          />
          <Input
            id="endPointXPct"
            className="w-24 h-8 text-right"
            type="number"
            min={0}
            max={100}
            step={1}
            value={getBuf('endPointXPct', String(Math.round(((selected as any).endPoint?.x ?? 1) * 100)))}
            onChange={(e) => {
              setBuf('endPointXPct', e.target.value);
              const v = e.target.value.trim();
              if (v === "") return;
              const p = Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayerTransient(selected.id, { endPoint: { ...(selected as any).endPoint, x: val } } as any);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); e.preventDefault(); } }}
            onBlur={(e) => {
              const v = e.target.value.trim();
              const p = v === "" ? 100 : Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayer(selected.id, { endPoint: { ...(selected as any).endPoint, x: val } } as any);
              clearBuf('endPointXPct');
            }}
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="endPointY">终点 Y</Label>
        <div className="flex items-center gap-2 w-full">
          <Slider
            id="endPointY"
            value={[Math.round(((selected as any).endPoint?.y ?? 1) * 100)]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => {
              const val = Math.round(v) / 100;
              updateLayerTransient(selected.id, { endPoint: { ...(selected as any).endPoint, y: val } } as any);
            }}
          />
          <Input
            id="endPointYPct"
            className="w-24 h-8 text-right"
            type="number"
            min={0}
            max={100}
            step={1}
            value={getBuf('endPointYPct', String(Math.round(((selected as any).endPoint?.y ?? 1) * 100)))}
            onChange={(e) => {
              setBuf('endPointYPct', e.target.value);
              const v = e.target.value.trim();
              if (v === "") return;
              const p = Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayerTransient(selected.id, { endPoint: { ...(selected as any).endPoint, y: val } } as any);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); e.preventDefault(); } }}
            onBlur={(e) => {
              const v = e.target.value.trim();
              const p = v === "" ? 100 : Math.max(0, Math.min(100, Math.round(Number(v))));
              const val = p / 100;
              updateLayer(selected.id, { endPoint: { ...(selected as any).endPoint, y: val } } as any);
              clearBuf('endPointYPct');
            }}
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Colors</Label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              const colors = (selected as any).colors || [];
              updateLayer(selected.id, { colors: [...colors, { color: '#ffffff', opacity: 1 }] } as any);
            }}
          >
            + Add color
          </Button>
        </div>
        <div className="space-y-2">
          {((selected as any).colors || []).map((gradColor: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 p-2 border rounded">
              <Input
                type="color"
                className="w-12 h-8"
                value={gradColor.color || '#ffffff'}
                onChange={(e) => {
                  const colors = [...(selected as any).colors];
                  colors[idx] = { ...colors[idx], color: e.target.value };
                  updateLayer(selected.id, { colors } as any);
                }}
              />
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Opacity</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[Math.round((gradColor.opacity ?? 1) * 100)]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([v]) => {
                      const colors = [...(selected as any).colors];
                      colors[idx] = { ...colors[idx], opacity: Math.round(v) / 100 };
                      updateLayerTransient(selected.id, { colors } as any);
                    }}
                  />
                  <span className="text-xs text-muted-foreground w-8">{Math.round((gradColor.opacity ?? 1) * 100)}%</span>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  const colors = (selected as any).colors.filter((_: any, i: number) => i !== idx);
                  updateLayer(selected.id, { colors } as any);
                }}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
