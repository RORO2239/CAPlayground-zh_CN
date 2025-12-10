"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import type { InspectorTabProps } from "../types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TextTabProps extends Omit<InspectorTabProps, 'getBuf' | 'setBuf' | 'clearBuf' | 'round2' | 'fmt2' | 'fmt0' | 'updateLayerTransient' | 'selectedBase'> {
  activeState?: string;
}

export function TextTab({
  selected,
  updateLayer,
  activeState,
}: TextTabProps) {
  if (selected.type !== 'text') return null;
  const inState = !!activeState && activeState !== 'Base State';
  const align = (((selected as any).align) || 'center') as 'left' | 'center' | 'right' | 'justified';

  return (
    <div className="grid grid-cols-2 gap-x-1.5 gap-y-3">
      <div className="space-y-1 col-span-2">
        <Label htmlFor="text">文本</Label>
        <Input id="text" value={selected.text}
          onChange={(e) => updateLayer(selected.id, { text: e.target.value } as any)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="fontSize">字体大小</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
        <Input id="fontSize" type="number" value={selected.fontSize}
          disabled={inState}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return;
            updateLayer(selected.id, { fontSize: Number(v) } as any)
          }} />
            </div>
          </TooltipTrigger>
          {inState && <TooltipContent sideOffset={6}>不支持状态过渡</TooltipContent>}
        </Tooltip>
      </div>
      <div className="space-y-1">
        <Label htmlFor="color">颜色</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
        <Input id="color" type="color" value={selected.color}
          disabled={inState}
          onChange={(e) => updateLayer(selected.id, { color: e.target.value } as any)} />
            </div>
          </TooltipTrigger>
          {inState && <TooltipContent sideOffset={6}>不支持状态过渡</TooltipContent>}
        </Tooltip>
      </div>
      <div className="space-y-1 col-span-2">
        <Label htmlFor="fontFamily">字体</Label>
        <Select value={(selected as any).fontFamily || 'SFProText-Regular'}
          onValueChange={(v) => updateLayer(selected.id, { fontFamily: v } as any)}>
          <SelectTrigger className="h-8 text-xs w-full" id="fontFamily">
            <SelectValue placeholder="选择字体" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SFProText-Regular">SFProText-Regular</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 col-span-2">
        <Label>对齐</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={inState ? 'opacity-50 pointer-events-none' : ''}>
        <div className="grid grid-cols-4 gap-1">
          <Button
            variant={align === 'left' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'left'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'left' } as any)}
            title="左对齐"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={align === 'center' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'center'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'center' } as any)}
            title="居中对齐"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={align === 'right' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'right'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'right' } as any)}
            title="右对齐"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={align === 'justified' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'justified'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'justified' } as any)}
            title="两端对齐"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
            </div>
          </TooltipTrigger>
          {inState && <TooltipContent sideOffset={6}>不支持状态过渡</TooltipContent>}
        </Tooltip>
      </div>
      <div className="space-y-1 col-span-2">
        <Label>换行</Label>
        <div className="flex items-center gap-2 h-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
          <Switch checked={(((selected as any).wrapped ?? 1) as number) === 1}
            disabled={inState}
            onCheckedChange={(checked) => updateLayer(selected.id, { wrapped: (checked ? 1 : 0) as any } as any)} />
              </div>
            </TooltipTrigger>
            {inState && <TooltipContent sideOffset={6}>不支持状态过渡</TooltipContent>}
          </Tooltip>
          <span className="text-xs text-muted-foreground">开启时，拖动水平边界可以换行文本。</span>
        </div>
      </div>
    </div>
  );
}
