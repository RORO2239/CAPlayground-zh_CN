"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ReplicatorLayer } from "@/lib/ca/types";

type TabProps = {
  selected: any;
  selectedBase: any;
  updateLayer: (id: string, patch: Partial<any>) => void;
  updateLayerTransient: (id: string, patch: Partial<any>) => void;
  getBuf: (key: string, fallback: string) => string;
  setBuf: (key: string, val: string) => void;
  clearBuf: (key: string) => void;
  round2: (n: number) => number;
  fmt2: (n: number) => string;
  fmt0: (n: number) => string;
};

export function ReplicatorTab({
  selected,
  selectedBase,
  updateLayer,
  updateLayerTransient,
  getBuf,
  setBuf,
  clearBuf,
  round2,
  fmt2,
  fmt0,
}: TabProps) {
  const instanceCount = selected.instanceCount ?? 1;
  const instanceDelay = selected.instanceDelay ?? 0;
  const instanceTranslation = selected.instanceTranslation ?? { x: 0, y: 0, z: 0 };
  const instanceRotation = selected.instanceRotation ?? 0;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label>实例数量</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={getBuf('instanceCount', String(instanceCount))}
            onChange={(e) => {
              setBuf('instanceCount', e.target.value);
              const val = Number(e.target.value);
              if (Number.isFinite(val) && val >= 1) {
                updateLayerTransient(selected.id, { instanceCount: Math.floor(val) } as any);
              }
            }}
            onBlur={() => {
              clearBuf('instanceCount');
              const val = Number(getBuf('instanceCount', String(instanceCount)));
              if (Number.isFinite(val) && val >= 1) {
                updateLayer(selected.id, { instanceCount: Math.floor(val) } as any);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                clearBuf('instanceCount');
                const val = Number(getBuf('instanceCount', String(instanceCount)));
                if (Number.isFinite(val) && val >= 1) {
                  updateLayer(selected.id, { instanceCount: Math.floor(val) } as any);
                }
                e.currentTarget.blur();
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            复制实例的数量（包括原始图层）
          </p>
        </div>
        <div className="space-y-2">
          <Label>实例偏移</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">X (px)</Label>
              <Input
                type="number"
                value={getBuf('translationX', String(instanceTranslation.x))}
                onChange={(e) => {
                  setBuf('translationX', e.target.value);
                  const val = Number(e.target.value);
                  if (Number.isFinite(val)) {
                    updateLayerTransient(selected.id, {
                      instanceTranslation: { ...instanceTranslation, x: val },
                    } as any);
                  }
                }}
                onBlur={() => {
                  clearBuf('translationX');
                  const val = Number(getBuf('translationX', String(instanceTranslation.x)));
                  if (Number.isFinite(val)) {
                    updateLayer(selected.id, {
                      instanceTranslation: { ...instanceTranslation, x: val },
                    } as any);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    clearBuf('translationX');
                    const val = Number(getBuf('translationX', String(instanceTranslation.x)));
                    if (Number.isFinite(val)) {
                      updateLayer(selected.id, {
                        instanceTranslation: { ...instanceTranslation, x: val },
                      } as any);
                    }
                    e.currentTarget.blur();
                  }
                }}
              />
            </div>
            <div> 
              <Label className="text-xs text-muted-foreground">Y (px)</Label>
              <Input
                type="number"
                value={getBuf('translationY', String(instanceTranslation.y))}
                onChange={(e) => {
                  setBuf('translationY', e.target.value);
                  const val = Number(e.target.value);
                  if (Number.isFinite(val)) {
                    updateLayerTransient(selected.id, {
                      instanceTranslation: { ...instanceTranslation, y: val },
                    } as any);
                  }
                }}
                onBlur={() => {
                  clearBuf('translationY');
                  const val = Number(getBuf('translationY', String(instanceTranslation.y)));
                  if (Number.isFinite(val)) {
                    updateLayer(selected.id, {
                      instanceTranslation: { ...instanceTranslation, y: val },
                    } as any);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    clearBuf('translationY');
                    const val = Number(getBuf('translationY', String(instanceTranslation.y)));
                    if (Number.isFinite(val)) {
                      updateLayer(selected.id, {
                        instanceTranslation: { ...instanceTranslation, y: val },
                      } as any);
                    }
                    e.currentTarget.blur();
                  }
                }}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Z (px)</Label>
              <Input
                type="number"
                value={getBuf('translationZ', String(instanceTranslation.z))}
                onChange={(e) => {
                  setBuf('translationZ', e.target.value);
                  const val = Number(e.target.value);
                  if (Number.isFinite(val)) {
                    updateLayerTransient(selected.id, {
                      instanceTranslation: { ...instanceTranslation, z: val },
                    } as any);
                  }
                }}
                onBlur={() => {
                  clearBuf('translationZ'); 
                  const val = Number(getBuf('translationZ', String(instanceTranslation.z)));
                  if (Number.isFinite(val)) {
                    updateLayer(selected.id, {
                      instanceTranslation: { ...instanceTranslation, z: val },
                    } as any);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    clearBuf('translationZ');
                    const val = Number(getBuf('translationZ', String(instanceTranslation.z)));
                    if (Number.isFinite(val)) {
                      updateLayer(selected.id, {
                        instanceTranslation: { ...instanceTranslation, z: val },
                      } as any);
                    }
                    e.currentTarget.blur();
                  }
                }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            每个复制实例的偏移量
          </p>
        </div>

        <div>
          <Label>实例旋转 (Z轴，度)</Label>
          <Input
            type="number"
            value={getBuf('instanceRotation', String(instanceRotation))}
            onChange={(e) => {
              setBuf('instanceRotation', e.target.value);
              const val = Number(e.target.value);
              if (Number.isFinite(val)) {
                updateLayerTransient(selected.id, { instanceRotation: val } as any);
              }
            }}
            onBlur={() => {
              clearBuf('instanceRotation');
              const val = Number(getBuf('instanceRotation', String(instanceRotation)));
              if (Number.isFinite(val)) {
                updateLayer(selected.id, { instanceRotation: val } as any);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                clearBuf('instanceRotation');
                const val = Number(getBuf('instanceRotation', String(instanceRotation)));
                if (Number.isFinite(val)) {
                  updateLayer(selected.id, { instanceRotation: val } as any);
                }
                e.currentTarget.blur();
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            每个复制实例的旋转角度
          </p>
        </div>

        <div>
          <Label>实例延迟 (秒)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={getBuf('instanceDelay', String(instanceDelay))}
            onChange={(e) => {
              setBuf('instanceDelay', e.target.value);
              const val = Number(e.target.value);
              if (Number.isFinite(val) && val >= 0) {
                updateLayerTransient(selected.id, { instanceDelay: val } as any);
              }
            }}
            onBlur={() => {
              clearBuf('instanceDelay');
              const val = Number(getBuf('instanceDelay', String(instanceDelay)));
              if (Number.isFinite(val) && val >= 0) {
                updateLayer(selected.id, { instanceDelay: val } as any);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                clearBuf('instanceDelay');
                const val = Number(getBuf('instanceDelay', String(instanceDelay)));
                if (Number.isFinite(val) && val >= 0) {
                  updateLayer(selected.id, { instanceDelay: val } as any);
                }
                e.currentTarget.blur();
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            每个实例出现的延迟（用于动画）
          </p>
        </div>
      </div>
    </div>
  );
}
