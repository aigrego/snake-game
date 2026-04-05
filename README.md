# 🐍 贪吃蛇游戏

一个基于 React + TypeScript + Vite 构建的经典贪吃蛇游戏。

![技术栈](https://img.shields.io/badge/React-18-blue?logo=react)
![技术栈](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![技术栈](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## 🎮 游戏特性

- ✅ 流畅的游戏体验，支持键盘和触屏操作
- ✅ 随分数增加而加速的难度系统
- ✅ 本地最高分记录
- ✅ 支持暂停/继续功能
- ✅ 响应式设计，支持移动端

## 🚀 快速开始

### 环境要求

- Node.js 16+
- pnpm / npm / yarn

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

然后在浏览器中打开 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

构建后的文件将位于 `dist` 目录。

### 预览生产版本

```bash
pnpm preview
```

## 🎯 游戏操作

### 键盘控制

| 按键 | 功能 |
|------|------|
| `↑` / `W` | 向上移动 |
| `↓` / `S` | 向下移动 |
| `←` / `A` | 向左移动 |
| `→` / `D` | 向右移动 |
| `空格键` | 暂停/继续 |
| `空格键` / `回车键` | 开始游戏 / 重新开始 |

### 触屏控制（移动端）

点击屏幕上的方向按钮控制蛇的移动，中间按钮控制暂停/继续。

## 📁 项目结构

```
snake-game/
├── src/
│   ├── App.tsx      # 游戏主逻辑组件
│   ├── App.css      # 游戏样式
│   ├── main.tsx     # 应用入口
│   └── index.css    # 全局样式
├── index.html       # HTML 模板
├── package.json     # 项目配置
├── tsconfig.json    # TypeScript 配置
└── vite.config.ts   # Vite 配置
```

## 🛠 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: CSS

## 📝 游戏规则

1. 控制蛇吃到食物（红色方块）获得 10 分
2. 每获得 50 分，蛇的移动速度会增加
3. 撞到墙壁或自己的身体，游戏结束
4. 游戏结束后按空格键或回车键重新开始

## 📄 许可证

MIT
