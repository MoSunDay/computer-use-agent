#!/bin/bash

# macOS 权限测试脚本

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "macOS 权限测试"
echo "=========================================="
echo ""

# 检查是否在 macOS 上运行
if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}❌ 此脚本仅适用于 macOS${NC}"
    exit 1
fi

echo -e "${YELLOW}测试 1: 检查 PyAutoGUI 是否已安装${NC}"
cd tool_server
if [ ! -d ".venv" ]; then
    echo -e "${RED}❌ 虚拟环境不存在，请先运行 ./start-all.sh${NC}"
    exit 1
fi

source .venv/bin/activate

python3 << 'EOF'
import sys
try:
    import pyautogui
    print(f"✅ PyAutoGUI 已安装 (版本 {pyautogui.__version__})")
except ImportError:
    print("❌ PyAutoGUI 未安装")
    sys.exit(1)
EOF

if [ $? -ne 0 ]; then
    exit 1
fi

echo ""
echo -e "${YELLOW}测试 2: 测试鼠标控制权限${NC}"

python3 << 'EOF'
import pyautogui
import time
import sys

# 获取当前鼠标位置
original_pos = pyautogui.position()
print(f"当前鼠标位置: {original_pos}")

# 尝试移动鼠标到一个新位置
test_x, test_y = 400, 400
print(f"尝试移动鼠标到 ({test_x}, {test_y})...")

try:
    pyautogui.moveTo(test_x, test_y, duration=0.5)
    time.sleep(0.5)
    
    # 检查鼠标是否真的移动了
    new_pos = pyautogui.position()
    print(f"移动后鼠标位置: {new_pos}")
    
    # 允许 10 像素的误差
    if abs(new_pos[0] - test_x) < 10 and abs(new_pos[1] - test_y) < 10:
        print("✅ PyAutoGUI 可以正常移动鼠标")
        print("✅ 辅助功能权限已正确设置")
        
        # 移回原位置
        pyautogui.moveTo(original_pos[0], original_pos[1], duration=0.3)
        sys.exit(0)
    else:
        print("❌ PyAutoGUI 无法正确移动鼠标")
        print("⚠️  鼠标位置没有改变，说明缺少辅助功能权限")
        print("")
        print("请按照以下步骤设置权限：")
        print("1. 打开 系统设置 > 隐私与安全性 > 辅助功能")
        print("2. 点击 + 添加你的终端应用 (Terminal/iTerm/VS Code)")
        print("3. 确保开关是开启状态")
        print("4. 完全退出并重新打开终端")
        print("5. 重新运行此测试脚本")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ 错误: {e}")
    sys.exit(1)
EOF

MOUSE_TEST_RESULT=$?

echo ""
echo -e "${YELLOW}测试 3: 测试屏幕截图权限${NC}"

python3 << 'EOF'
import pyautogui
import sys

try:
    # 尝试截图
    screenshot = pyautogui.screenshot()
    
    if screenshot:
        width, height = screenshot.size
        print(f"✅ 成功截图 (尺寸: {width}x{height})")
        print("✅ 屏幕录制权限已正确设置")
        sys.exit(0)
    else:
        print("❌ 截图失败")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ 截图错误: {e}")
    print("⚠️  可能缺少屏幕录制权限")
    print("")
    print("请按照以下步骤设置权限：")
    print("1. 打开 系统设置 > 隐私与安全性 > 屏幕录制")
    print("2. 点击 + 添加你的终端应用 (Terminal/iTerm/VS Code)")
    print("3. 确保开关是开启状态")
    print("4. 完全退出并重新打开终端")
    print("5. 重新运行此测试脚本")
    sys.exit(1)
EOF

SCREENSHOT_TEST_RESULT=$?

echo ""
echo -e "${YELLOW}测试 4: 测试剪贴板访问权限${NC}"

python3 << 'EOF'
import sys

try:
    import pyperclip

    # 测试写入剪贴板
    test_text = "Computer Use Agent Test"
    pyperclip.copy(test_text)

    # 测试读取剪贴板
    clipboard_content = pyperclip.paste()

    if clipboard_content == test_text:
        print(f"✅ 成功读写剪贴板")
        print("✅ 剪贴板权限已正确设置")
        sys.exit(0)
    else:
        print(f"⚠️  剪贴板内容不匹配")
        print(f"   写入: {test_text}")
        print(f"   读取: {clipboard_content}")
        sys.exit(1)

except Exception as e:
    print(f"❌ 剪贴板错误: {e}")
    print("⚠️  可能缺少自动化权限")
    print("")
    print("请按照以下步骤设置权限：")
    print("1. 打开 系统设置 > 隐私与安全性 > 自动化")
    print("2. 找到你的终端应用 (Terminal/iTerm/VS Code)")
    print("3. 展开并确保所有应用的开关都是开启状态")
    print("4. 如果没有看到自动化选项，先运行一次程序让系统请求权限")
    print("5. 完全退出并重新打开终端")
    print("6. 重新运行此测试脚本")
    sys.exit(1)
EOF

CLIPBOARD_TEST_RESULT=$?

echo ""
echo "=========================================="
echo "测试结果总结"
echo "=========================================="

if [ $MOUSE_TEST_RESULT -eq 0 ] && [ $SCREENSHOT_TEST_RESULT -eq 0 ] && [ $CLIPBOARD_TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ 所有权限测试通过！${NC}"
    echo -e "${GREEN}✅ Computer Use Agent 可以正常操作 macOS${NC}"
    echo ""
    echo "下一步："
    echo "1. 运行 ./start-all.sh 启动所有服务"
    echo "2. 访问 http://localhost:3000"
    echo "3. 开始使用 Computer Use Agent"
    exit 0
else
    echo -e "${RED}❌ 权限测试失败${NC}"
    echo ""
    echo "请按照上面的提示设置 macOS 权限，然后重新运行此脚本。"
    echo ""
    echo "详细指南请查看: macOS权限设置指南.md"
    exit 1
fi

