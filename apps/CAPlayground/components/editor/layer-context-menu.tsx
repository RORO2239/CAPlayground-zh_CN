"use client";

import React, { useMemo, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEditor } from "./editor-context";
import type { AnyLayer } from "@/lib/ca/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type LayerContextMenuProps = {
  layer: AnyLayer;
  children: React.ReactNode;
  siblings: AnyLayer[];
};

export function LayerContextMenu({ layer, children, siblings }: LayerContextMenuProps) {
  const { moveLayer, updateLayer, duplicateLayer, deleteLayer } = useEditor();
  const [renameOpen, setRenameOpen] = useState(false);
  const [nameVal, setNameVal] = useState<string>((layer as any).name || "");

  const siblingsIds = siblings.map((l) => l.id);
  const idx = useMemo(() => {
    return siblingsIds.findIndex((id) => id === layer.id)
  },
    [JSON.stringify(siblingsIds), layer.id]
  );
  const n = siblings.length;

  const canSendBackward = idx > 0;
  const canBringForward = idx >= 0 && idx < n - 1;
  const canSendToBack = canSendBackward;
  const canSendToFront = canBringForward;

  const bringForward = async () => {
    if (!canBringForward) return;
    if (idx < n - 2) {
      const beforeId = siblings[idx + 2].id;
      moveLayer(layer.id, beforeId);
    } else if (idx === n - 2) {
      const next = siblings[n - 1];
      moveLayer(next.id, layer.id);
    }
  };

  const sendBackward = async () => {
    if (!canSendBackward) return;
    const prev = siblings[idx - 1];
    moveLayer(layer.id, prev.id);
  };

  const sendToBack = async () => {
    if (!canSendToBack) return;
    const first = siblings[0];
    moveLayer(layer.id, first.id);
  };

  const sendToFront = async () => {
    if (!canSendToFront) return;
    for (let i = idx + 1; i < n; i++) {
      const sib = siblings[i];
      moveLayer(sib.id, layer.id);
    }
  };

  const openRename = () => {
    setNameVal(((layer as any).name || "") as string);
    setRenameOpen(true);
  };
  const submitRename = () => {
    const next = (nameVal || "").trim();
    const currentName = (layer as any).name || "";
    if (next && next !== currentName) {
      updateLayer(layer.id, { name: next } as any);
    }
    setRenameOpen(false);
  };

  const duplicate = async () => { duplicateLayer(layer.id); };
  const remove = async () => { deleteLayer(layer.id); };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem disabled={!canSendToFront} onSelect={sendToFront}>置于顶层</ContextMenuItem>
          <ContextMenuItem disabled={!canBringForward} onSelect={bringForward}>上移一层</ContextMenuItem>
          <ContextMenuItem disabled={!canSendBackward} onSelect={sendBackward}>下移一层</ContextMenuItem>
          <ContextMenuItem disabled={!canSendToBack} onSelect={sendToBack}>置于底层</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={openRename}>重命名…</ContextMenuItem>
          <ContextMenuItem onSelect={duplicate}>复制</ContextMenuItem>
          <ContextMenuItem variant="destructive" onSelect={remove}>删除</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>重命名图层</DialogTitle>
            <DialogDescription>给这个图层一个新名称。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); }}
              placeholder="图层名称"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>取消</Button>
            <Button onClick={submitRename}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
