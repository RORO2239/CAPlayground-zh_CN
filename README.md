# CAPlayground

**在任何桌面电脑上为 iOS 和 iPadOS 创建精美的动态壁纸**

> ⚠️ **提示**：这是 [CAPlayground/CAPlayground](https://github.com/caplayground/caplayground) 的复刻项目，进行了中文本地化并移除了云端同步功能，所有数据仅保存在本地。原项目由 CAPlayground 团队开发维护。

## 📱 项目简介

CAPlayground 是一个基于 Web 的 Core Animation 编辑器，专为制作 iPhone 和 iPad 精美壁纸而设计。

### ✨ 主要特性

- 🎨 **可视化编辑器** - 直观的图层管理、实时预览
- 🖼️ **多种图层类型** - 支持图片、文本、渐变、粒子发射器、复制器等
- 🎬 **动画系统** - 关键帧动画、自动反转、多种缓动函数
- 📱 **设备预览** - 模拟 iPhone 锁屏界面，预览真实效果
- 🌓 **状态过渡** - 支持锁定、解锁、睡眠状态的不同样式
- 💾 **本地存储** - 项目保存在本地，无需注册账号
- 📤 **导出格式** - 支持导出 .ca 和 .tendies 格式

### 🇨🇳 更适合中国宝宝

- 🌐 **全中文界面** - 完整汉化，无需翻译
- 🚀 **本地化部署** - 无需科学上网，本地运行即可使用
- 📦 **离线使用** - 所有功能均在本地运行，无云端依赖
- 🔧 **简单安装** - 几行命令即可运行

## 下载

点击下载适用于 Windows 的安装包：

[**下载 CAPlayground-Setup-1.0.0.exe**](./CAPlayground-Setup-1.0.0.exe)

下载后直接运行即可安装使用。如果你是开发者，或希望通过源码运行，请参考下方的“快速开始”指南。

## 🚀 快速开始 (开发者)

### 环境要求

- Node.js 20+
- npm 或 Bun

### 安装依赖

使用 npm:
```bash
npm install
```

或使用 Bun:
```bash
bun install
```

### 启动开发服务器

```bash
npm run dev
# 或
bun run dev
```

在浏览器中打开 http://localhost:3000

### 构建生产版本

```bash
npm run build && npm run start
# 或
bun run build && bun run start
```

## 📖 使用指南

### 创建新项目

1. 访问 http://localhost:3000/projects
2. 点击「新建项目」
3. 输入项目名称，选择设备尺寸
4. 开始编辑！

### 添加图层

在编辑器左侧面板点击「添加图层」，可选择：
- **文本图层** - 添加文字内容
- **基础图层** - 纯色矩形
- **渐变图层** - 线性/径向/圆锥渐变
- **图片图层** - 导入 PNG/JPG/WebP 图片
- **视频图层** - 导入视频或 GIF
- **粒子发射器** - 创建粒子效果
- **复制器图层** - 复制并排列子图层

### 导出壁纸

1. 点击右上角「导出」按钮
2. 选择导出格式：
   - **.ca** - 标准 Core Animation 格式
   - **.tendies** - 兼容 Nugget/Pocket Poster 的格式
3. 下载并安装到设备

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: React + TailwindCSS + shadcn/ui
- **存储**: IndexedDB (OPFS)
- **语言**: TypeScript

## 📄 开源协议

[MIT License](LICENSE)

---

**Made with ❤️ for iOS 壁纸爱好者**
