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

// 本地模式开关 - 设置为 true 时使用本地沙箱,false 时使用远程沙箱管理器
const USE_LOCAL_MODE = true;

export async function GET(req: NextRequest) {
  try {
    if (USE_LOCAL_MODE) {
      // 本地模式：返回一个虚拟的本地沙箱实例
      // 检测当前操作系统类型
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
