#!/bin/bash

# Computer Use Agent 服务状态检查脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Computer Use Agent 服务状态检查${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Tool Server
echo -n "1. Tool Server (8102): "
if curl -s "http://127.0.0.1:8102/?Version=2020-04-01&Action=GetScreenSize" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 运行中${NC}"
else
    echo -e "${RED}❌ 未运行${NC}"
fi

# 检查 MCP Server
echo -n "2. MCP Server (8000): "
if ps aux | grep "mcp-server" | grep -v grep > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 运行中${NC}"
else
    echo -e "${RED}❌ 未运行${NC}"
fi

# 检查 Planner
echo -n "3. Planner (8089): "
if curl -s "http://127.0.0.1:8089/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 运行中${NC}"
    
    # 测试模型列表 API
    echo -n "   - 模型列表 API: "
    if curl -s "http://127.0.0.1:8089/models" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 正常${NC}"
        MODEL_INFO=$(curl -s "http://127.0.0.1:8089/models" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['models'][0]['display_name'] if data.get('models') else 'Unknown')" 2>/dev/null)
        if [ ! -z "$MODEL_INFO" ]; then
            echo "      当前模型: $MODEL_INFO"
        fi
    else
        echo -e "${RED}❌ 异常${NC}"
    fi
else
    echo -e "${RED}❌ 未运行${NC}"
fi

# 检查 Frontend
echo -n "4. Frontend: "
FRONTEND_PORT=""
if curl -s "http://localhost:3000/api/get-env" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 运行中 (端口 3000)${NC}"
    FRONTEND_PORT=3000
elif curl -s "http://localhost:3001/api/get-env" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 运行中 (端口 3001)${NC}"
    FRONTEND_PORT=3001
else
    echo -e "${RED}❌ 未运行${NC}"
fi

# 如果 Frontend 运行，测试 API 代理
if [ ! -z "$FRONTEND_PORT" ]; then
    echo -n "   - API 代理: "
    if curl -s "http://localhost:$FRONTEND_PORT/api/planner/model/list" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 正常${NC}"
    else
        echo -e "${RED}❌ 异常${NC}"
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"

# 显示访问地址
if [ ! -z "$FRONTEND_PORT" ]; then
    echo -e "${GREEN}前端访问地址:${NC}"
    echo -e "  ${YELLOW}http://localhost:$FRONTEND_PORT${NC}"
    echo ""
fi

# 显示日志文件
echo -e "${YELLOW}日志文件:${NC}"
echo -e "  Tool Server:  /tmp/tool_server.log"
echo -e "  MCP Server:   /tmp/mcp_server.log"
echo -e "  Planner:      /tmp/planner.log"
echo -e "  Frontend:     /tmp/frontend.log"
echo ""

# 显示 PID 文件
echo -e "${YELLOW}进程 PID:${NC}"
if [ -f /tmp/tool_server.pid ]; then
    echo -e "  Tool Server:  $(cat /tmp/tool_server.pid)"
fi
if [ -f /tmp/mcp_server.pid ]; then
    echo -e "  MCP Server:   $(cat /tmp/mcp_server.pid)"
fi
if [ -f /tmp/planner.pid ]; then
    echo -e "  Planner:      $(cat /tmp/planner.pid)"
fi
if [ -f /tmp/frontend.pid ]; then
    echo -e "  Frontend:     $(cat /tmp/frontend.pid)"
fi
echo ""

