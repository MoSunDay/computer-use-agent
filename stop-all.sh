#!/bin/bash

# Computer Use Agent 停止脚本
# 此脚本将停止所有运行的服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}停止 Computer Use Agent 所有服务${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 停止服务的函数
stop_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${YELLOW}停止 $service_name (PID: $pid)...${NC}"
            kill $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${RED}强制停止 $service_name...${NC}"
                kill -9 $pid
            fi
            echo -e "${GREEN}✓ $service_name 已停止${NC}"
        else
            echo -e "${YELLOW}$service_name 未运行${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}$service_name PID 文件不存在${NC}"
    fi
}

# 停止所有服务
stop_service "Frontend" "/tmp/frontend.pid"
stop_service "Planner" "/tmp/planner.pid"
stop_service "MCP Server" "/tmp/mcp_server.pid"
stop_service "Tool Server" "/tmp/tool_server.pid"

echo ""
echo -e "${GREEN}所有服务已停止!${NC}"
echo ""

