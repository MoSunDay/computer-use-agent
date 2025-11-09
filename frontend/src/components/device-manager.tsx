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

import { FC, useState, useEffect } from "react";
import { Button, Modal, Input, Select, Message, Tag } from "@arco-design/web-react";
import { IconPlus, IconEdit, IconDelete, IconLeft, IconRefresh } from "@arco-design/web-react/icon";
import { actions, Sandbox, SandboxStatus } from "@/store";
import { useSnapshot } from "valtio";
import { store } from "@/store";

interface Device {
  id: string;
  name: string;
  ip: string;
  port: number;
  osType: string;
  status: string;
  description?: string;
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "green";
    case "STOPPED":
      return "red";
    case "CREATING":
      return "blue";
    default:
      return "gray";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "运行中";
    case "STOPPED":
      return "已停止";
    case "CREATING":
      return "创建中";
    default:
      return "未知";
  }
};

export const DeviceManager: FC = () => {
  const { sandboxList, id: currentDeviceId } = useSnapshot(store);
  const [message, messageHolder] = Message.useMessage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState<Device>({
    id: "",
    name: "",
    ip: "",
    port: 8102,
    osType: "Darwin",
    status: "STOPPED",
    description: "",
  });

  const handleAddDevice = async () => {
    try {
      // 生成设备 ID
      const deviceId = `device-${Date.now()}`;
      const deviceToAdd = {
        ...newDevice,
        id: deviceId,
      };

      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceToAdd),
      });

      const result = await response.json();

      if (result.success) {
        message?.success?.("设备添加成功");
        setIsAddModalOpen(false);
        // 重置表单
        setNewDevice({
          id: "",
          name: "",
          ip: "",
          port: 8102,
          osType: "Darwin",
          status: "STOPPED",
          description: "",
        });
        // 刷新设备列表
        handleRefresh();
      } else {
        message?.error?.(result.message || "添加设备失败");
      }
    } catch (error) {
      console.error("添加设备失败:", error);
      message?.error?.("添加设备失败");
    }
  };

  const handleEditDevice = (device: Sandbox) => {
    setEditingDevice({
      id: device.SandboxId,
      name: device.SandboxId,
      ip: device.PrimaryIp,
      port: 8102,
      osType: device.OsType,
      status: device.Status,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteDevice = (deviceId: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个设备吗？",
      onOk: async () => {
        try {
          const response = await fetch(`/api/devices?id=${deviceId}`, {
            method: "DELETE",
          });

          const result = await response.json();

          if (result.success) {
            message?.success?.("设备删除成功");
            // 刷新设备列表
            handleRefresh();
          } else {
            message?.error?.(result.message || "删除设备失败");
          }
        } catch (error) {
          console.error("删除设备失败:", error);
          message?.error?.("删除设备失败");
        }
      },
    });
  };

  const handleSelectDevice = (deviceId: string) => {
    actions.setId(deviceId);
    message?.success?.(`已切换到设备: ${deviceId}`);
  };

  const handleRefresh = async () => {
    try {
      await actions.fetchSandboxList();
      message?.success?.("设备列表已刷新");
    } catch (error) {
      console.error("刷新设备列表失败:", error);
      message?.error?.("刷新设备列表失败");
    }
  };

  return (
    <>
      {messageHolder}
      <div className="h-full w-full flex flex-col bg-white rounded-lg shadow-sm relative">
      {/* 隐藏按钮 */}
      <button
        onClick={() => actions.setRightPanelVisible(false)}
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-12 bg-white rounded-l-md shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors z-10 border border-r-0 border-gray-200"
        title="隐藏设备管理"
      >
        <IconLeft className="text-gray-600 text-sm" />
      </button>

      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🖥️</span>
          设备管理
        </h3>
        <div className="flex gap-2">
          <Button
            size="mini"
            icon={<IconRefresh />}
            onClick={handleRefresh}
            title="刷新设备列表"
          />
          <Button
            type="primary"
            size="mini"
            icon={<IconPlus />}
            onClick={() => setIsAddModalOpen(true)}
          >
            添加
          </Button>
        </div>
      </div>

      {/* 设备列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {sandboxList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-500 text-sm">暂无设备</p>
              <p className="text-gray-400 text-xs mt-1">点击上方"添加"按钮添加设备</p>
            </div>
          ) : (
            sandboxList.map((device) => (
              <div
                key={device.SandboxId}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  currentDeviceId === device.SandboxId
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => handleSelectDevice(device.SandboxId)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getOSIcon(device.OsType)}</span>
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {device.SandboxId}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {device.PrimaryIp}
                      </div>
                    </div>
                  </div>
                  <Tag color={getStatusColor(device.Status)} size="small">
                    {getStatusText(device.Status)}
                  </Tag>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {device.OsType}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="mini"
                      icon={<IconEdit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDevice(device);
                      }}
                    />
                    <Button
                      size="mini"
                      status="danger"
                      icon={<IconDelete />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDevice(device.SandboxId);
                      }}
                    />
                  </div>
                </div>

                {currentDeviceId === device.SandboxId && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      当前选中
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 添加设备弹窗 */}
      <Modal
        title="添加设备"
        visible={isAddModalOpen}
        onOk={handleAddDevice}
        onCancel={() => setIsAddModalOpen(false)}
        autoFocus={false}
        focusLock={true}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              设备名称
            </label>
            <Input
              placeholder="例如: 办公室 Windows PC"
              value={newDevice.name}
              onChange={(value) => setNewDevice({ ...newDevice, name: value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IP 地址
            </label>
            <Input
              placeholder="例如: 192.168.1.100"
              value={newDevice.ip}
              onChange={(value) => setNewDevice({ ...newDevice, ip: value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              端口
            </label>
            <Input
              type="number"
              placeholder="8102"
              value={newDevice.port.toString()}
              onChange={(value) =>
                setNewDevice({ ...newDevice, port: parseInt(value) || 8102 })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              操作系统
            </label>
            <Select
              placeholder="选择操作系统"
              value={newDevice.osType}
              onChange={(value) => setNewDevice({ ...newDevice, osType: value })}
              style={{ width: "100%" }}
            >
              <Select.Option value="Darwin">macOS</Select.Option>
              <Select.Option value="Windows">Windows</Select.Option>
              <Select.Option value="Linux">Linux</Select.Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述（可选）
            </label>
            <Input.TextArea
              placeholder="设备描述信息"
              value={newDevice.description}
              onChange={(value) =>
                setNewDevice({ ...newDevice, description: value })
              }
              rows={3}
            />
          </div>
        </div>
      </Modal>

      {/* 编辑设备弹窗 */}
      <Modal
        title="编辑设备"
        visible={isEditModalOpen}
        onOk={() => {
          message?.success?.("设备编辑功能开发中");
          setIsEditModalOpen(false);
        }}
        onCancel={() => setIsEditModalOpen(false)}
        autoFocus={false}
        focusLock={true}
      >
        {editingDevice && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                设备 ID
              </label>
              <Input value={editingDevice.id} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP 地址
              </label>
              <Input value={editingDevice.ip} disabled />
            </div>
          </div>
        )}
      </Modal>
      </div>
    </>
  );
};

