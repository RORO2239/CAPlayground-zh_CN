import { ImageLayer } from "@/lib/ca/types";

interface ImageRendererProps {
  layer: ImageLayer;
  assets?: Record<string, { dataURL?: string }>;
}

export default function ImageRenderer({
  layer,
  assets,
}: ImageRendererProps) {
  const assetsMap = assets || {};
  // 尝试多种方式查找图片资源
  let imgAsset = assetsMap[layer.id];
  
  // 如果通过layer.id找不到，尝试通过文件名查找
  if (!imgAsset?.dataURL && layer.src) {
    const filename = layer.src.split('/').pop() || '';
    imgAsset = assetsMap[filename] || assetsMap[layer.src];
  }
  
  // 如果还是找不到，尝试通过layer.name查找
  if (!imgAsset?.dataURL && layer.name) {
    imgAsset = assetsMap[layer.name];
  }
  
  const previewSrc = imgAsset?.dataURL || layer.src;
  if (!previewSrc) return null;
  return (
    <img
      src={previewSrc}
      alt={layer.name}
      style={{
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        transform: 'none',
        objectFit: "fill",
        maxWidth: "none",
        maxHeight: "none",
        borderRadius: layer.cornerRadius,
      }}
      draggable={false}
    />
  );
}
