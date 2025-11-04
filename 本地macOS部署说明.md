# Computer Use Agent - 本地 macOS 部署说明

## 🎯 架构说明

### 本地部署架构

本项目已配置为**完全本地运行模式**，AI 代理会直接操作**您本地的 macOS 机器**，无需任何远程沙箱。

```
┌─────────────────────────────────────────────────────────────┐
│                     您的 macOS 机器                          │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Frontend │───▶│ Planner  │───▶│MCP Server│              │
│  │  :3000   │    │  :8089   │    │  :8000   │              │
│  └──────────┘    └──────────┘    └─────┬────┘              │
│                                         │                    │
│                                         ▼                    │
│                                  ┌──────────┐               │
│                                  │Tool Server              │
│                                  │  :8102   │               │
│                                  └─────┬────┘               │
│                                        │                     │
│                                        ▼                     │
│                              ┌──────────────────┐           │
│                              │  PyAutoGUI       │           │
│                              │  (操作您的 macOS) │           │
│                              └──────────────────┘           │
│                                        │                     │
│                                        ▼                     │
│                              您的鼠标、键盘、屏幕             │
└─────────────────────────────────────────────────────────────┘
```

### 工作流程

1. **用户输入** → 在浏览器 (http://localhost:3000) 输入自然语言指令
2. **Frontend** → 将请求发送到 Planner
3. **Planner** → 使用豆包 1.5 UI-TARS 模型分析任务，生成执行计划
4. **MCP Server** → 接收 Planner 的指令，转换为工具调用
5. **Tool Server** → 使用 PyAutoGUI 直接操作您的 macOS
   - 移动鼠标
   - 点击
   - 输入文字
   - 截屏
   - 等等...

## ✅ macOS 支持

### 已支持的功能

- ✅ **鼠标操作**：移动、点击、拖拽、滚动
- ✅ **键盘操作**：按键、文本输入
- ✅ **屏幕操作**：截图、获取屏幕尺寸
- ✅ **系统操作**：获取光标位置、等待

### 技术实现

Tool Server 使用 **PyAutoGUI** 库来操作 macOS：

```python
# tool_server/tools/computer_pyautogui.py
import pyautogui

# 移动鼠标
pyautogui.moveTo(x, y)

# 点击
pyautogui.click(x, y)

# 输入文字
pyautogui.typewrite(text)

# 截图
screenshot = pyautogui.screenshot()
```

## 🔧 配置说明

### 1. Frontend 配置

前端 API 已配置为本地模式，自动检测操作系统类型：

<augment_code_snippet path="computer-use-agent/frontend/src/app/api/sandbox/list/route.ts" mode="EXCERPT">
````typescript
const USE_LOCAL_MODE = true;

// 检测当前操作系统类型
const osType = process.platform === 'darwin' ? 'Darwin' : 
               process.platform === 'win32' ? 'Windows' : 'Linux';
````
</augment_code_snippet>

### 2. Planner 配置

Planner 使用 `LocalSandboxManager`，直接连接本地 Tool Server：

<augment_code_snippet path="computer-use-agent/planner/src/planner/app.py" mode="EXCERPT">
````python
from client.sandbox_manager_client import LocalSandboxManager

# 使用本地沙箱管理器
sandbox_manager = LocalSandboxManager()
````
</augment_code_snippet>

### 3. LocalSandboxManager 实现

<augment_code_snippet path="computer-use-agent/planner/src/planner/client/sandbox_manager_client.py" mode="EXCERPT">
````python
class LocalSandboxManager(SandboxManager):
    """本地沙箱管理器 - 直接使用本地 Tool Server"""
    
    def get_tool_server_endpoint(self, sandbox_id: str=None) -> str | None:
        # 返回本地 Tool Server 地址
        return "http://127.0.0.1:8102"
````
</augment_code_snippet>

## 🚀 使用方法

### 启动服务

```bash
cd computer-use-agent
./start-all.sh
```

### 访问界面

打开浏览器访问: http://localhost:3000

### 测试示例

在界面中输入以下指令测试：

1. **截图测试**
   ```
   截取当前屏幕
   ```

2. **鼠标测试**
   ```
   移动鼠标到屏幕中央
   ```

3. **应用操作**
   ```
   打开访达
   ```

4. **文本输入**
   ```
   打开文本编辑器并输入"Hello macOS"
   ```

## ⚠️ 重要说明

### 权限要求

macOS 需要授予以下权限：

1. **辅助功能权限** (Accessibility)
   - 系统偏好设置 → 安全性与隐私 → 辅助功能
   - 添加 Terminal 或您使用的终端应用

2. **屏幕录制权限** (Screen Recording)
   - 系统偏好设置 → 安全性与隐私 → 屏幕录制
   - 添加 Terminal 或您使用的终端应用

### 安全提示

⚠️ **警告**：Tool Server 可以完全控制您的 macOS 机器！

- AI 代理会**真实地**移动您的鼠标
- AI 代理会**真实地**点击您的屏幕
- AI 代理会**真实地**输入文字
- AI 代理会**真实地**操作您的应用程序

**建议**：
- 在测试时不要进行其他重要工作
- 随时准备按 `Ctrl+C` 停止服务
- 使用虚拟机或测试环境进行实验

## 🔍 验证部署

### 检查系统类型

```bash
curl -s http://localhost:3000/api/sandbox/list | python3 -m json.tool
```

应该返回：
```json
{
    "Result": [
        {
            "SandboxId": "local-sandbox",
            "PrimaryIp": "127.0.0.1",
            "Eip": "127.0.0.1",
            "Status": "RUNNING",
            "OsType": "Darwin"  ← 确认是 Darwin (macOS)
        }
    ]
}
```

### 检查服务状态

```bash
# 检查所有服务是否运行
ps aux | grep -E "(tool_server|mcp_server|planner|next)" | grep -v grep

# 检查端口占用
lsof -i :3000  # Frontend
lsof -i :8089  # Planner
lsof -i :8000  # MCP Server
lsof -i :8102  # Tool Server
```

## 🆚 本地模式 vs 远程模式

### 本地模式 (当前配置)

- ✅ 操作本地 macOS 机器
- ✅ 无需远程沙箱服务
- ✅ 无网络延迟
- ✅ 配置简单
- ⚠️ 会真实操作您的电脑

### 远程模式 (原始设计)

- 操作远程 Linux 沙箱
- 需要 ECS 沙箱管理器
- 有网络延迟
- 配置复杂
- 安全隔离

## 🔄 切换到远程模式

如果您想切换回远程沙箱模式：

1. **修改 Frontend**
   ```typescript
   // frontend/src/app/api/sandbox/list/route.ts
   const USE_LOCAL_MODE = false;  // 改为 false
   ```

2. **修改 Planner**
   ```python
   # planner/src/planner/app.py
   from client.sandbox_manager_client import ECSSandboxManager
   sandbox_manager = ECSSandboxManager()  # 使用远程管理器
   ```

3. **配置沙箱管理器端点**
   ```toml
   # planner/config.toml
   [sandbox]
   manager_endpoint = "https://your-sandbox-manager.com"
   ```

## 📝 常见问题

### Q: 为什么要用 LocalSandboxManager？

A: 因为您想在本地 macOS 上运行，不需要远程 ECS 沙箱。LocalSandboxManager 直接返回本地 Tool Server 的地址。

### Q: Tool Server 会操作我的真实电脑吗？

A: **是的！** Tool Server 使用 PyAutoGUI 直接操作您的 macOS。这就是 Computer Use Agent 的核心功能。

### Q: 如何确保安全？

A: 
- 在测试环境中运行
- 仔细审查 AI 的执行计划
- 随时准备停止服务
- 不要在生产环境中运行

### Q: 支持 Windows 吗？

A: 理论上支持！Tool Server 使用 PyAutoGUI，它是跨平台的。只需在 Windows 上运行即可。

## 🎉 总结

您现在拥有一个**完全本地运行**的 Computer Use Agent：

- ✅ 所有服务运行在您的 macOS 上
- ✅ AI 直接操作您的本地机器
- ✅ 无需远程沙箱或云服务
- ✅ 系统正确识别为 Darwin (macOS)
- ✅ 使用豆包 1.5 UI-TARS 模型

**开始使用**: http://localhost:3000

**祝您使用愉快！** 🚀

