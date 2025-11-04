# Computer Use Agent - 本地部署版本

> 🚀 **本项目已配置为完全本地运行模式，AI 代理将直接操作您的本地 macOS 机器**
>
> ⚠️ **重要**: Tool Server 会真实地控制您的鼠标、键盘和屏幕！

## 场景介绍

Computer Use Agent 实现了通过简单的指令即可让计算机为用户执行任务，例如视频剪辑、演示文稿（PPT）制作以及自媒体账号运维等均能轻松完成。该方案基于火山引擎的 Doubao 1.5 UI-TARS 模型，即"通过强化学习融合视觉能力与高级推理的模型"，能够直接与图形用户界面（GUI）进行交互，而无需依赖特定的应用程序编程接口（API）。

Computer Use Agent 具备卓越的桌面应用操作能力，能够精准识别用户的任务需求，进行智能感知、自主推理并准确执行，体现了从"对话式人工智能（AI）"向"行动式人工智能（AI）"的转型趋势。

- **感知**：CUA 截取计算机屏幕图像，旨在对数字环境中的内容进行情境化处理。这些视觉输入成为决策的依据。
- **推理**：CUA 借助思维链推理对其观察结果进行评估，并跟踪中间步骤的进展。通过分析过往和当前的屏幕截图，该系统能够动态适应新的挑战和不可预见的变化。
- **行动**：CUA 利用虚拟鼠标和键盘执行键入、点击和滚动等操作

## 🚀 快速开始

### ⚠️ 第一步：设置 macOS 权限（必需！）

Computer Use Agent 需要 macOS 的**辅助功能**和**屏幕录制**权限才能工作。

**方法 1: 使用自动化助手（推荐）**:
\`\`\`bash
./setup-permissions.sh
\`\`\`

**方法 2: 手动测试**:
\`\`\`bash
./test-macos-permissions.sh
\`\`\`

如果测试失败，请查看：
- 📖 **[macOS权限设置指南.md](./macOS权限设置指南.md)** - 详细设置步骤
- 🔧 **[权限问题排查.md](./权限问题排查.md)** - 常见问题解决

### 第二步：启动服务
\`\`\`bash
./start-all.sh
\`\`\`

### 第三步：访问应用
打开浏览器访问: **http://localhost:3000**

### 停止服务
\`\`\`bash
./stop-all.sh
\`\`\`

## 📚 详细文档

### 权限设置（必读）
- 🚀 **[setup-permissions.sh](./setup-permissions.sh)** - 自动化权限设置助手（推荐）
- 📖 **[macOS权限设置指南.md](./macOS权限设置指南.md)** - macOS 权限设置完整指南
- 🔧 **[权限问题排查.md](./权限问题排查.md)** - 权限问题常见解决方案

### 部署文档
- **[本地macOS部署说明.md](./本地macOS部署说明.md)** - macOS 本地部署完整指南
- [部署完成总结.md](./部署完成总结.md) - 所有已完成的配置和修复
- [快速开始.md](./快速开始.md) - 快速上手指南
- [本地部署说明.md](./本地部署说明.md) - 详细的配置和使用指南

## 📦 项目结构

\`\`\`
computer-use-agent/
├── frontend/          # Next.js 前端界面 (端口 3000)
├── planner/          # Agent 规划器 (端口 8089)
├── mcp_server/       # MCP 协议服务器 (端口 8000)
├── tool_server/      # 工具执行服务器 (端口 8102)
├── start-all.sh      # 一键启动脚本
├── stop-all.sh       # 一键停止脚本
└── README.md         # 本文件
\`\`\`

## 🔧 环境要求

- **操作系统**: macOS (Darwin) / Linux / Windows
- **Python**: 3.12+
- **Node.js**: 18.0+
- **包管理器**: Yarn, UV (Python)
- **macOS 权限**: 辅助功能、屏幕录制权限

## 🌟 本地部署特性

- ✅ **完全本地运行** - 无需远程沙箱服务
- ✅ **直接操作本地机器** - AI 代理控制您的 macOS/Linux/Windows
- ✅ **一键启动** - 自动安装依赖和启动所有服务
- ✅ **实时反馈** - 查看 AI 代理的执行过程
- ✅ **自然语言** - 使用中文指令控制计算机
- ✅ **豆包 1.5 UI-TARS** - 火山引擎最新 AI 模型
- ✅ **跨平台支持** - macOS (PyAutoGUI) / Linux (XDoTool) / Windows (PyAutoGUI)

## 📊 服务列表

| 服务 | 地址 | 说明 |
|------|------|------|
| Frontend | http://localhost:3000 | Web 用户界面 |
| Planner | http://localhost:8089 | Agent 任务规划器 |
| MCP Server | http://localhost:8000 | MCP 协议服务 |
| Tool Server | http://localhost:8102 | 工具执行服务 |

## 🎯 使用示例

1. 启动服务后访问 http://localhost:3000
2. 在界面中输入自然语言指令，例如：
   - "打开浏览器并访问百度"
   - "截取当前屏幕"
   - "创建一个新的文本文件"
3. AI 代理会自动分析并执行任务

## 🔄 原始项目

本项目基于火山引擎 AI App Lab 的 Computer Use 示例:
- 原始仓库: https://github.com/volcengine/ai-app-lab
- 原始路径: \`demohouse/computer_use\`

---

**祝使用愉快！** 🎉
