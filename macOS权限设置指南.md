# macOS 权限设置指南

## ⚠️ 重要提示

Computer Use Agent 需要 macOS 的**辅助功能**和**屏幕录制**权限才能正常工作。

**当前状态**: PyAutoGUI 无法移动鼠标，说明权限未正确授予。

---

## 🔧 必需权限

### 1. 辅助功能 (Accessibility)

**用途**: 允许程序控制鼠标和键盘

**设置步骤**:

1. 打开 **系统设置** (System Settings)
2. 点击 **隐私与安全性** (Privacy & Security)
3. 点击 **辅助功能** (Accessibility)
4. 点击左下角的 **🔒** 解锁（需要输入密码）
5. 点击 **+** 按钮添加应用
6. 找到并添加以下应用之一：
   - **Terminal** (如果你使用系统自带终端)
   - **iTerm** (如果你使用 iTerm2)
   - **VS Code** (如果你在 VS Code 终端中运行)
   - **Python** (位于 `/usr/local/bin/python3` 或 `/opt/homebrew/bin/python3`)
7. 确保添加的应用旁边的开关是 **开启** 状态

### 2. 屏幕录制 (Screen Recording)

**用途**: 允许程序截取屏幕

**设置步骤**:

1. 打开 **系统设置** (System Settings)
2. 点击 **隐私与安全性** (Privacy & Security)
3. 点击 **屏幕录制** (Screen Recording)
4. 点击左下角的 **🔒** 解锁（需要输入密码）
5. 点击 **+** 按钮添加应用
6. 找到并添加与上面相同的应用
7. 确保添加的应用旁边的开关是 **开启** 状态

---

## 🧪 测试权限

运行以下测试脚本验证权限是否正确设置：

```bash
./test-macos-permissions.sh
```

**预期输出**:
```
✅ PyAutoGUI 可以正常操作鼠标
✅ PyAutoGUI 可以正常截图
✅ 所有权限设置正确！
```

**如果看到错误**:
```
❌ PyAutoGUI 无法正确移动鼠标
⚠️  可能需要授予辅助功能权限
```

说明权限未正确设置，请按照上面的步骤重新设置。

---

## 🔄 重启服务

**重要**: 设置权限后，必须重启所有服务才能生效！

```bash
./stop-all.sh
./start-all.sh
```

---

## 📝 常见问题

### Q1: 我已经添加了 Terminal，但还是不工作？

**A**: 尝试以下方法：

1. **重启 Terminal**: 完全退出 Terminal 应用，然后重新打开
2. **重启服务**: 运行 `./stop-all.sh && ./start-all.sh`
3. **重启电脑**: 有时 macOS 需要重启才能应用权限更改

### Q2: 我应该添加哪个应用？

**A**: 取决于你如何运行服务：

- 如果在 **Terminal** 中运行 `./start-all.sh`，添加 **Terminal**
- 如果在 **iTerm2** 中运行，添加 **iTerm**
- 如果在 **VS Code 终端** 中运行，添加 **Visual Studio Code**

### Q3: 找不到 Python 应用？

**A**: Python 不是一个应用，而是一个命令行工具。你应该添加运行 Python 的终端应用（Terminal/iTerm/VS Code）。

### Q4: 权限设置后还是不工作？

**A**: 检查以下几点：

1. 确认添加的应用旁边的开关是**开启**状态
2. 完全退出并重新打开终端应用
3. 重启所有服务
4. 如果还不行，尝试重启电脑

### Q5: 我不想给这些权限怎么办？

**A**: Computer Use Agent **必须**有这些权限才能工作。如果不授予权限：
- ❌ 无法移动鼠标
- ❌ 无法点击
- ❌ 无法输入文字
- ❌ 无法截图

这些权限是 AI 控制桌面的核心功能。

---

## 🔒 安全提醒

### ⚠️ 授予这些权限意味着：

- ✅ Tool Server 可以**完全控制**你的鼠标和键盘
- ✅ Tool Server 可以**看到**你的整个屏幕
- ✅ AI 可以**执行任何**鼠标和键盘操作

### 🛡️ 安全建议：

1. **仅在测试环境使用**: 不要在生产环境或重要工作时运行
2. **随时准备接管**: 保持警惕，随时可以手动接管控制
3. **关闭敏感应用**: 运行前关闭银行、邮件等敏感应用
4. **使用测试账户**: 建议在单独的 macOS 用户账户中运行
5. **定期检查**: 定期检查系统设置中的权限列表，移除不需要的应用

---

## 📊 权限验证清单

在运行 Computer Use Agent 之前，请确认：

- [ ] 已在**辅助功能**中添加终端应用
- [ ] 已在**屏幕录制**中添加终端应用
- [ ] 两个权限的开关都是**开启**状态
- [ ] 已重启终端应用
- [ ] 已重启所有服务 (`./stop-all.sh && ./start-all.sh`)
- [ ] 运行 `./test-macos-permissions.sh` 测试通过

---

## 🚀 下一步

权限设置完成后：

1. 运行测试脚本验证: `./test-macos-permissions.sh`
2. 启动所有服务: `./start-all.sh`
3. 打开浏览器: http://localhost:3000
4. 开始使用 Computer Use Agent！

---

## 📞 需要帮助？

如果按照本指南操作后仍然无法工作，请检查：

1. `/tmp/tool_server.log` - Tool Server 日志
2. `/tmp/mcp_server.log` - MCP Server 日志
3. `/tmp/planner.log` - Planner 日志
4. `/tmp/frontend.log` - Frontend 日志

查找错误信息并根据提示解决。

