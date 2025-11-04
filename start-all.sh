#!/bin/bash

# Computer Use Agent 启动脚本
# 此脚本将按顺序启动所有必要的服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Computer Use Agent 启动脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查必要的工具
echo -e "${YELLOW}检查必要的工具...${NC}"
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}错误: 需要 python3${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}错误: 需要 node${NC}" >&2; exit 1; }
command -v yarn >/dev/null 2>&1 || { echo -e "${RED}错误: 需要 yarn${NC}" >&2; exit 1; }
command -v uv >/dev/null 2>&1 || { echo -e "${RED}错误: 需要 uv (Python 包管理器)${NC}" >&2; exit 1; }

echo -e "${GREEN}✓ 所有必要工具已安装${NC}"
echo ""

# 1. 启动 Tool Server
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}1. 启动 Tool Server (端口 8102)${NC}"
echo -e "${YELLOW}========================================${NC}"
cd "$SCRIPT_DIR/tool_server"

if [ ! -d ".venv" ]; then
    echo "创建虚拟环境..."
    uv venv --python 3.12 || uv venv
fi

echo "安装依赖..."
source .venv/bin/activate
uv sync

echo "启动 Tool Server..."
nohup uvicorn main:app --host 0.0.0.0 --port 8102 > /tmp/tool_server.log 2>&1 &
TOOL_SERVER_PID=$!
echo $TOOL_SERVER_PID > /tmp/tool_server.pid
echo -e "${GREEN}✓ Tool Server 已启动 (PID: $TOOL_SERVER_PID)${NC}"
echo -e "${GREEN}  日志文件: /tmp/tool_server.log${NC}"
sleep 3

# 2. 启动 MCP Server
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}2. 启动 MCP Server (端口 8000)${NC}"
echo -e "${YELLOW}========================================${NC}"
cd "$SCRIPT_DIR/mcp_server"

if [ ! -d ".venv" ]; then
    echo "创建虚拟环境..."
    uv venv --python 3.12 || uv venv
fi

echo "安装依赖..."
source .venv/bin/activate
uv sync

echo "启动 MCP Server..."
export FASTMCP_PORT=8000
export TOOL_SERVER_ENDPOINT="127.0.0.1:8102"
nohup uv run mcp-server > /tmp/mcp_server.log 2>&1 &
MCP_SERVER_PID=$!
echo $MCP_SERVER_PID > /tmp/mcp_server.pid
echo -e "${GREEN}✓ MCP Server 已启动 (PID: $MCP_SERVER_PID)${NC}"
echo -e "${GREEN}  日志文件: /tmp/mcp_server.log${NC}"
sleep 3

# 3. 启动 Planner
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}3. 启动 Planner (端口 8089)${NC}"
echo -e "${YELLOW}========================================${NC}"
cd "$SCRIPT_DIR/planner"

if [ ! -d ".venv" ]; then
    echo "创建虚拟环境..."
    uv venv --python 3.12 || uv venv
fi

echo "安装依赖..."
source .venv/bin/activate
uv sync

echo "启动 Planner..."
nohup uv run src/planner/main.py > /tmp/planner.log 2>&1 &
PLANNER_PID=$!
echo $PLANNER_PID > /tmp/planner.pid
echo -e "${GREEN}✓ Planner 已启动 (PID: $PLANNER_PID)${NC}"
echo -e "${GREEN}  日志文件: /tmp/planner.log${NC}"
sleep 3

# 4. 启动 Frontend
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}4. 启动 Frontend (端口 3000)${NC}"
echo -e "${YELLOW}========================================${NC}"
cd "$SCRIPT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    yarn install
fi

echo "启动 Frontend..."
nohup yarn dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/frontend.pid
echo -e "${GREEN}✓ Frontend 已启动 (PID: $FRONTEND_PID)${NC}"
echo -e "${GREEN}  日志文件: /tmp/frontend.log${NC}"

# 等待服务启动
echo ""
echo -e "${YELLOW}等待所有服务启动...${NC}"
sleep 5

# 显示服务状态
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}所有服务已启动!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}服务列表:${NC}"
echo -e "  1. Tool Server:   http://127.0.0.1:8102 (PID: $TOOL_SERVER_PID)"
echo -e "  2. MCP Server:    http://127.0.0.1:8000 (PID: $MCP_SERVER_PID)"
echo -e "  3. Planner:       http://127.0.0.1:8089 (PID: $PLANNER_PID)"
echo -e "  4. Frontend:      http://127.0.0.1:3000 (PID: $FRONTEND_PID)"
echo ""
echo -e "${GREEN}访问前端界面:${NC}"
echo -e "  ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}查看日志:${NC}"
echo -e "  tail -f /tmp/tool_server.log"
echo -e "  tail -f /tmp/mcp_server.log"
echo -e "  tail -f /tmp/planner.log"
echo -e "  tail -f /tmp/frontend.log"
echo ""
echo -e "${YELLOW}停止所有服务:${NC}"
echo -e "  ./stop-all.sh"
echo ""

