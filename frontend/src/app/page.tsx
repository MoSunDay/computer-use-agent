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

// 抑制第三方库的 React 19 ref 警告
import "./suppress-warnings";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { LeftPanel } from "@/components/left-panel";
import { InstanceSelector } from "@/components/instance/instance-selector";
import { DesktopDisplay } from "@/components/desktop-display";
import { CreateInstanceModal } from "@/components/instance/instance-creation-modal";
import { Spinner } from "@/components/spinner";
import { Tabs, Skeleton, Message } from "@arco-design/web-react";
import { OSType } from "@/services/sandbox";
import store, { actions } from "@/store";
import { useSnapshot } from "valtio";
import dynamic from "next/dynamic";
import { PromptEditor } from "@/components/prompt-editor";
import { getEnv } from "@/services/env";
import { useEmbedded } from "@/hooks/use-embedded";

const DeviceManager = dynamic(
  () => import("@/components/device-manager").then(mod => ({ default: mod.DeviceManager })),
  {
    loading: () => (
      <div className="h-full w-full flex flex-col bg-white rounded-lg shadow-sm p-4">
        <Skeleton />
      </div>
    ),
  }
);

const TabPane = Tabs.TabPane;

function Home() {
  const isEmbedded = useEmbedded();
  const { maximized, rightPanelVisible, leftPanelVisible } = useSnapshot(store);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [message, messageHolder] = Message.useMessage();

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateInstance = async (osType: OSType) => {
    try {
      await actions.createSandbox({
        osType,
        onError: (errorMsg?: string) => {
          message?.error?.(errorMsg || "创建沙箱失败");
        },
        onSuccess: () => {
          message?.success?.("创建沙箱成功");
        },
      });
    } catch (error) {
      console.error("创建沙箱失败", error);
      alert("创建沙箱失败");
    }
  };

  return (
    <div className="page flex flex-col h-[calc(100vh-var(--scrollbar-height))] bg-slate-50 min-w-[1200px] overflow-x-auto">
      {messageHolder}
      {!isEmbedded && <Header />}
      <div className="flex flex-row flex-1 overflow-hidden background bg-[#FFFFFF80] relative">
        {/* 左侧面板 */}
        {maximized ? null : leftPanelVisible ? (
          <div className="w-1/5 p-4 pr-0 pt-6 flex-shrink-0 transition-all duration-300">
            <LeftPanel />
          </div>
        ) : null}

        {/* 显示左侧面板按钮（当面板隐藏时） */}
        {!maximized && !leftPanelVisible && (
          <button
            onClick={() => actions.setLeftPanelVisible(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-20 bg-white rounded-r-lg shadow-lg hover:shadow-xl flex flex-col items-center justify-center transition-all duration-200 z-10 border border-l-0 border-gray-200 group hover:w-10"
            title="显示聊天面板"
          >
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <div className="flex flex-col gap-0.5">
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
            </div>
          </button>
        )}

        {/* 主要内容区域 */}
        <div className={`${maximized ? "w-full" : leftPanelVisible ? "w-4/5" : "w-full"} flex flex-col flex-shrink-0 transition-all duration-300`}>
            <div className="flex flex-col flex-1 px-4 py-4">
              <Tabs
                justify
                type="capsule"
                defaultActiveTab="desktop"
                className={`h-full flex flex-col ${
                  maximized ? "tab-header-hide" : ""
                }`}
                extra={
                  <InstanceSelector
                    onCreateNewInstance={handleOpenCreateModal}
                  />
                }
              >
                {/* 桌面标签内容 */}
                <TabPane
                  key="desktop"
                  title="我的桌面"
                  className="flex-1 h-full"
                >
                  <div className="flex h-full relative">
                    {/* 左侧桌面显示区域 */}
                    <div
                      className={`${
                        maximized || !rightPanelVisible ? "w-full" : "w-[78%]"
                      } h-full ${rightPanelVisible ? "pr-4" : ""} transition-all duration-300`}
                    >
                      <DesktopDisplay onCreateInstance={handleCreateInstance} />
                    </div>

                    {/* 右侧设备管理区域 */}
                    {!maximized && rightPanelVisible && (
                      <div className="w-[22%] h-full min-w-[297px] transition-all duration-300">
                        <DeviceManager />
                      </div>
                    )}

                    {/* 显示右侧面板按钮（当面板隐藏时） */}
                    {!maximized && !rightPanelVisible && (
                      <button
                        onClick={() => actions.setRightPanelVisible(true)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-white rounded-l-md shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors z-10 border border-r-0 border-gray-200"
                        title="显示设备管理"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </TabPane>

                {/* 系统提示词标签内容 */}
                <TabPane key="system" title="系统提示词" className="flex-1">
                  <PromptEditor />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>

      {/* 创建沙箱模态框 */}
      <CreateInstanceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    async function initializeApp() {
      const env = await getEnv();
      actions.setEnv(env);
      // 初始化沙箱列表和模型列表
      await actions.fetchSandboxList();
      await actions.fetchModelList();
    }
    initializeApp();
  }, []);

  const { envLoaded } = useSnapshot(store);
  return envLoaded ? (
    <Home />
  ) : (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
}
