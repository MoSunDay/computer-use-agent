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

import { NextResponse } from "next/server";
import { sandboxManagerClient } from "../sansbox-manager-client";
import { AxiosError } from "axios";

// 本地模式开关 - 设置为 true 时使用本地沙箱,false 时使用远程沙箱管理器
const USE_LOCAL_MODE = true;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (USE_LOCAL_MODE) {
      // 本地模式：返回虚拟的本地沙箱实例（本地模式下不需要创建新沙箱）
      // 检测当前操作系统类型
      const osType = process.platform === 'darwin' ? 'Darwin' :
                     process.platform === 'win32' ? 'Windows' : 'Linux';

      return NextResponse.json({
        Result: {
          SandboxId: "local-sandbox",
          PrimaryIp: "127.0.0.1",
          Eip: "127.0.0.1",
          Status: "RUNNING",
          OsType: osType,
        },
      });
    }

    // 远程模式：从沙箱管理器创建沙箱
    const resp = await sandboxManagerClient({
      method: "GET",
      url: "",
      params: {
        Action: "CreateSandbox",
        Version: "2020-04-01",
        OsType: body.OsType,
      },
    });
    return NextResponse.json(resp.data);
  } catch (error) {
    let message = "创建沙箱失败";
    if (error instanceof AxiosError) {
      message = error.response?.data.ResponseMetadata.Error?.Message;
      if (
        error.response?.data.ResponseMetadata.Error?.Code ===
        "QuotaExceeded.MaximumInstances"
      ) {
        message = "沙箱数量配额不足，请提工单申请提高配额。";
      }
    }
    console.error("创建沙箱失败", error, message);
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

// 改为动态路由以确保每次都获取最新数据
export const dynamic = "force-dynamic";
