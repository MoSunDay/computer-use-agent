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

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DEVICES_CONFIG_PATH = path.join(process.cwd(), "..", "devices.json");

interface Device {
  id: string;
  name: string;
  ip: string;
  port: number;
  osType: string;
  status: string;
  description?: string;
}

interface DevicesConfig {
  devices: Device[];
}

// 读取设备配置
function loadDevices(): DevicesConfig {
  try {
    if (fs.existsSync(DEVICES_CONFIG_PATH)) {
      const data = fs.readFileSync(DEVICES_CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("读取设备配置失败:", error);
  }
  return { devices: [] };
}

// 保存设备配置
function saveDevices(config: DevicesConfig): boolean {
  try {
    fs.writeFileSync(
      DEVICES_CONFIG_PATH,
      JSON.stringify(config, null, 2),
      "utf-8"
    );
    return true;
  } catch (error) {
    console.error("保存设备配置失败:", error);
    return false;
  }
}

// GET - 获取所有设备
export async function GET(req: NextRequest) {
  try {
    const config = loadDevices();
    return NextResponse.json({
      success: true,
      devices: config.devices,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "获取设备列表失败",
      },
      { status: 500 }
    );
  }
}

// POST - 添加新设备
export async function POST(req: NextRequest) {
  try {
    const device: Device = await req.json();
    
    // 验证必填字段
    if (!device.id || !device.name || !device.ip || !device.port || !device.osType) {
      return NextResponse.json(
        {
          success: false,
          message: "缺少必填字段",
        },
        { status: 400 }
      );
    }

    const config = loadDevices();
    
    // 检查设备 ID 是否已存在
    if (config.devices.some((d) => d.id === device.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "设备 ID 已存在",
        },
        { status: 400 }
      );
    }

    // 添加设备
    config.devices.push({
      ...device,
      status: device.status || "STOPPED",
    });

    if (saveDevices(config)) {
      return NextResponse.json({
        success: true,
        message: "设备添加成功",
        device,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "保存设备配置失败",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("添加设备失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: "添加设备失败",
      },
      { status: 500 }
    );
  }
}

// PUT - 更新设备
export async function PUT(req: NextRequest) {
  try {
    const device: Device = await req.json();
    
    if (!device.id) {
      return NextResponse.json(
        {
          success: false,
          message: "缺少设备 ID",
        },
        { status: 400 }
      );
    }

    const config = loadDevices();
    const index = config.devices.findIndex((d) => d.id === device.id);
    
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "设备不存在",
        },
        { status: 404 }
      );
    }

    // 更新设备
    config.devices[index] = {
      ...config.devices[index],
      ...device,
    };

    if (saveDevices(config)) {
      return NextResponse.json({
        success: true,
        message: "设备更新成功",
        device: config.devices[index],
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "保存设备配置失败",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("更新设备失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: "更新设备失败",
      },
      { status: 500 }
    );
  }
}

// DELETE - 删除设备
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("id");
    
    if (!deviceId) {
      return NextResponse.json(
        {
          success: false,
          message: "缺少设备 ID",
        },
        { status: 400 }
      );
    }

    const config = loadDevices();
    const index = config.devices.findIndex((d) => d.id === deviceId);
    
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "设备不存在",
        },
        { status: 404 }
      );
    }

    // 删除设备
    config.devices.splice(index, 1);

    if (saveDevices(config)) {
      return NextResponse.json({
        success: true,
        message: "设备删除成功",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "保存设备配置失败",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("删除设备失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: "删除设备失败",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

