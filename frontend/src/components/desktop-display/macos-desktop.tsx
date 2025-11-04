// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Licensed under the 【火山方舟】原型应用软件自用许可协议
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at 
//     https://www.volcengine.com/docs/82379/1433703
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use client";

import { FC, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import store from "@/store";

/**
 * macOS 桌面显示组件
 * 显示本地 macOS 设备的实时截图
 */
export const MacOSDesktop: FC = () => {
  const { messages } = useSnapshot(store);
  const [latestScreenshot, setLatestScreenshot] = useState<string | null>(null);

  // 查找最新的截图消息
  useEffect(() => {
    // 从后往前查找最新的图片类型消息
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === "image") {
        setLatestScreenshot(messages[i].text);
        return;
      }
    }
    setLatestScreenshot(null);
  }, [messages]);

  // 如果有截图，显示截图
  if (latestScreenshot) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <img
          src={latestScreenshot}
          alt="macOS Desktop Screenshot"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  // 如果没有截图，显示欢迎界面
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl p-8">
        {/* macOS 图标 */}
        <div className="text-8xl mb-6">🍎</div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          本地 macOS 设备
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          AI Agent 将直接控制您的 macOS 桌面
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ✅ 准备就绪
          </h3>

          <div className="text-left space-y-3">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✓</span>
              <div>
                <p className="font-medium text-gray-700">所有服务已启动</p>
                <p className="text-sm text-gray-500">Tool Server, MCP Server, Planner 运行中</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✓</span>
              <div>
                <p className="font-medium text-gray-700">本地模式已激活</p>
                <p className="text-sm text-gray-500">无需远程沙箱，直接操作本机</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-blue-500 mr-3 text-xl">ℹ</span>
              <div>
                <p className="font-medium text-gray-700">开始使用</p>
                <p className="text-sm text-gray-500">在左侧输入指令，AI 将控制您的桌面</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <span className="text-yellow-600 mr-3 text-xl">⚠️</span>
            <div className="text-left">
              <p className="font-semibold text-yellow-800 mb-2">
                需要 macOS 权限
              </p>
              <p className="text-sm text-yellow-700 mb-2">
                如果 AI 无法控制鼠标或键盘，请设置权限：
              </p>
              <div className="bg-yellow-100 rounded p-2 font-mono text-xs text-yellow-900">
                ./setup-permissions.sh
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>💡 提示：AI 执行任务时，您可以在此区域看到实时截图</p>
        </div>
      </div>
    </div>
  );
};

