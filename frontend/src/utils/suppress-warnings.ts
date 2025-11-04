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

/**
 * 抑制来自第三方库的 React 19 ref 警告
 * 这些警告来自 @arco-design/web-react 库，不影响功能
 */
export function suppressThirdPartyWarnings() {
  if (typeof window === 'undefined') return;

  const originalError = console.error;
  const originalWarn = console.warn;

  // 需要抑制的警告模式
  const suppressPatterns = [
    /Accessing element\.ref was removed in React 19/,
    /ref is now a regular prop/,
  ];

  // 检查是否应该抑制此消息
  const shouldSuppress = (message: string) => {
    return suppressPatterns.some(pattern => pattern.test(message));
  };

  // 重写 console.error
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (!shouldSuppress(message)) {
      originalError.apply(console, args);
    }
  };

  // 重写 console.warn
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (!shouldSuppress(message)) {
      originalWarn.apply(console, args);
    }
  };
}

