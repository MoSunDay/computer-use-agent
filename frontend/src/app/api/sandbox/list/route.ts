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
import { sandboxManagerClient } from "../sansbox-manager-client";
import fs from "fs";
import path from "path";

// 本地模式开关 - 设置为 true 时使用本地沙箱,false 时使用远程沙箱管理器
const USE_LOCAL_MODE = true;

// 读取设备配置文件
function loadDevicesFromConfig() {
  try {
    const configPath = path.join(process.cwd(), "..", "devices.json");
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(configData);
      return config.devices || [];
    }
  } catch (error) {
    console.error("读取设备配置文件失败:", error);
  }
  return [];
}

export async function GET(req: NextRequest) {
  try {
    if (USE_LOCAL_MODE) {
      // 本地模式：从配置文件读取设备列表
      const devices = loadDevicesFromConfig();

      if (devices.length > 0) {
        // 如果配置文件中有设备，使用配置文件中的设备列表
        const sandboxList = devices.map((device: any) => ({
          SandboxId: device.id,
          PrimaryIp: device.ip,
          Eip: device.ip,
          Status: device.status || "RUNNING",
          OsType: device.osType,
        }));

        return NextResponse.json({
          Result: sandboxList,
        });
      } else {
        // 如果配置文件为空或不存在，返回默认的本地设备
        const osType = process.platform === 'darwin' ? 'Darwin' :
                       process.platform === 'win32' ? 'Windows' : 'Linux';

        return NextResponse.json({
          Result: [
            {
              SandboxId: "local-sandbox",
              PrimaryIp: "127.0.0.1",
              Eip: "127.0.0.1",
              Status: "RUNNING",
              OsType: osType,
            },
          ],
        });
      }
    }

    // 远程模式：从沙箱管理器获取沙箱列表
    const resp = await sandboxManagerClient.get("", {
      params: {
        Action: "DescribeSandboxes",
        Version: "2020-04-01",
      },
    });
    return NextResponse.json(resp.data);
  } catch (error) {
    console.error("获取沙箱列表失败", error);
    return NextResponse.json(
      {
        success: false,
        message: "获取沙箱列表失败",
      },
      { status: 500 }
    );
  }
}

// 改为动态路由以确保每次都获取最新数据
export const dynamic = "force-dynamic";
