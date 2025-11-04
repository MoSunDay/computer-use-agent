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

import { FC } from "react";
import { useSnapshot } from "valtio";
import store, { actions } from "@/store";
import { IconLeft } from "@arco-design/web-react/icon";

const InfoItem: FC<{
  label: string;
  value: string | React.ReactNode;
}> = ({ label, value }) => {
  return (
    <div className="flex items-start gap-[20px]">
      <span className="block text-[13px] w-[80px] text-[#737A87] shrink-0">
        {label}
      </span>
      <span className="flex-1 min-w-0 text-[13px] font-[PingFang SC] font-normal text-[#0C0D0E] break-all">
        {value}
      </span>
    </div>
  );
};

export const LocalDeviceInfo: FC = () => {
  const { sandbox } = useSnapshot(store);

  if (!sandbox) {
    return (
      <div className="h-full w-full flex flex-col bg-white rounded-md shadow-sm p-4">
        <div className="text-center text-gray-500 py-8">
          未检测到本地设备
        </div>
      </div>
    );
  }

  const getOSIcon = (osType: string) => {
    switch (osType) {
      case "Darwin":
        return "🍎";
      case "Windows":
        return "🪟";
      case "Linux":
        return "🐧";
      default:
        return "💻";
    }
  };

  const getOSName = (osType: string) => {
    switch (osType) {
      case "Darwin":
        return "macOS";
      case "Windows":
        return "Windows";
      case "Linux":
        return "Linux";
      default:
        return osType;
    }
  };

  const getStatusBadge = (status: string) => {
    const isRunning = status === "RUNNING";
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          isRunning
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full mr-1 ${
            isRunning ? "bg-green-500" : "bg-gray-500"
          }`}
        />
        {isRunning ? "运行中" : status}
      </span>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-md shadow-sm relative">
      {/* 隐藏按钮 */}
      <button
        onClick={() => actions.setRightPanelVisible(false)}
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-12 bg-white rounded-l-md shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors z-10 border border-r-0 border-gray-200"
        title="隐藏侧边栏"
      >
        <IconLeft className="text-gray-600 text-sm" />
      </button>

      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">{getOSIcon(sandbox.OsType)}</span>
          本地设备
        </h3>
        {getStatusBadge(sandbox.Status)}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-lg">ℹ️</span>
              <div className="flex-1 text-sm text-blue-800">
                <p className="font-medium mb-1">本地模式</p>
                <p className="text-xs text-blue-700">
                  Computer Use Agent 正在直接操作您的本地设备。请确保已授予必要的系统权限。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <InfoItem
              label="设备 ID"
              value={
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {sandbox.SandboxId}
                </code>
              }
            />
            <InfoItem label="操作系统" value={getOSName(sandbox.OsType)} />
            <InfoItem label="IP 地址" value={sandbox.PrimaryIp} />
            <InfoItem label="状态" value={getStatusBadge(sandbox.Status)} />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              系统权限检查
            </h4>
            <div className="space-y-2">
              <PermissionItem
                name="辅助功能"
                description="允许控制鼠标和键盘"
                required
              />
              <PermissionItem
                name="屏幕录制"
                description="允许截取屏幕"
                required
              />
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                ⚠️ 如果权限未正确设置，请运行{" "}
                <code className="bg-yellow-100 px-1 rounded">
                  ./test-macos-permissions.sh
                </code>{" "}
                进行测试
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              服务状态
            </h4>
            <div className="space-y-2">
              <ServiceItem name="Tool Server" port="8102" />
              <ServiceItem name="MCP Server" port="8000" />
              <ServiceItem name="Planner" port="8089" />
              <ServiceItem name="Frontend" port="3000" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PermissionItem: FC<{
  name: string;
  description: string;
  required?: boolean;
}> = ({ name, description, required }) => {
  return (
    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
      <span className="text-lg">🔒</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{name}</span>
          {required && (
            <span className="text-xs text-red-600 font-medium">必需</span>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

const ServiceItem: FC<{
  name: string;
  port: string;
}> = ({ name, port }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <span className="text-sm text-gray-900">{name}</span>
      <code className="text-xs bg-gray-200 px-2 py-1 rounded">
        :{port}
      </code>
    </div>
  );
};

export default LocalDeviceInfo;

