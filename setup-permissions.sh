#!/bin/bash

# macOS 权限设置助手

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}=========================================="
echo "macOS 权限设置助手"
echo -e "==========================================${NC}"
echo ""

# 检查是否在 macOS 上运行
if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}❌ 此脚本仅适用于 macOS${NC}"
    exit 1
fi

echo -e "${YELLOW}Computer Use Agent 需要以下权限才能工作：${NC}"
echo ""
echo "1. 🔒 辅助功能 (Accessibility)"
echo "   用途: 允许程序控制鼠标和键盘"
echo ""
echo "2. 📸 屏幕录制 (Screen Recording)"
echo "   用途: 允许程序截取屏幕"
echo ""
echo "3. 📋 自动化 (Automation)"
echo "   用途: 允许程序访问剪贴板和自动化操作"
echo ""

# 检测当前使用的终端
TERMINAL_APP=""
if [ -n "$TERM_PROGRAM" ]; then
    case "$TERM_PROGRAM" in
        "Apple_Terminal")
            TERMINAL_APP="Terminal"
            ;;
        "iTerm.app")
            TERMINAL_APP="iTerm"
            ;;
        "vscode")
            TERMINAL_APP="Visual Studio Code"
            ;;
        *)
            TERMINAL_APP="$TERM_PROGRAM"
            ;;
    esac
else
    TERMINAL_APP="Terminal"
fi

echo -e "${BLUE}检测到您正在使用: ${TERMINAL_APP}${NC}"
echo ""

echo -e "${YELLOW}请按照以下步骤设置权限：${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 1: 打开系统设置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "方法 1: 点击屏幕左上角的  图标 > 系统设置"
echo "方法 2: 按下 Cmd+Space，输入 '系统设置'，按回车"
echo ""
read -p "按回车键继续..."

# 尝试自动打开系统设置
echo ""
echo -e "${BLUE}正在为您打开系统设置...${NC}"
open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"
sleep 2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 2: 设置辅助功能权限"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 在左侧菜单中，点击 '隐私与安全性'"
echo "2. 在右侧列表中，找到并点击 '辅助功能'"
echo "3. 点击左下角的 🔒 锁图标（需要输入密码）"
echo "4. 点击 + 按钮"
echo "5. 找到并选择: ${TERMINAL_APP}"
echo "6. 确保 ${TERMINAL_APP} 旁边的开关是 开启 状态"
echo ""
read -p "完成后按回车键继续..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 3: 设置屏幕录制权限"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 在左侧的 '隐私与安全性' 下"
echo "2. 找到并点击 '屏幕录制'"
echo "3. 如果锁是锁定的，点击 🔒 解锁"
echo "4. 点击 + 按钮"
echo "5. 找到并选择: ${TERMINAL_APP}"
echo "6. 确保 ${TERMINAL_APP} 旁边的开关是 开启 状态"
echo ""
read -p "完成后按回车键继续..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 4: 设置自动化权限（用于剪贴板访问）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 在左侧的 '隐私与安全性' 下"
echo "2. 找到并点击 '自动化'"
echo "3. 如果锁是锁定的，点击 🔒 解锁"
echo "4. 找到 ${TERMINAL_APP}"
echo "5. 展开 ${TERMINAL_APP}，确保所有应用的开关都是 开启 状态"
echo ""
echo -e "${YELLOW}注意: 如果没有看到 '自动化' 选项，可能需要先运行一次程序${NC}"
echo -e "${YELLOW}      程序会自动请求权限，然后您可以在这里授权${NC}"
echo ""
read -p "完成后按回车键继续..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 5: 重启终端"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}⚠️  重要: 设置权限后，必须完全退出并重新打开终端！${NC}"
echo ""
echo "请执行以下操作："
echo "1. 完全退出 ${TERMINAL_APP} (Cmd+Q)"
echo "2. 重新打开 ${TERMINAL_APP}"
echo "3. 进入项目目录: cd $(pwd)"
echo "4. 运行测试脚本: ./test-macos-permissions.sh"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}设置完成！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "下一步："
echo "1. 完全退出并重新打开终端"
echo "2. 运行: ./test-macos-permissions.sh"
echo "3. 如果测试通过，运行: ./start-all.sh"
echo "4. 访问: http://localhost:3000"
echo ""

# 询问是否现在就测试
echo -e "${YELLOW}如果您已经重启了终端，可以现在测试权限${NC}"
read -p "是否现在运行权限测试？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    ./test-macos-permissions.sh
fi

