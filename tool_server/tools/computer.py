# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# Licensed under the 【火山方舟】原型应用软件自用许可协议
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at 
#     https://www.volcengine.com/docs/82379/1433703
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import pyautogui
import pyperclip
import platform

from abc import ABC, abstractmethod
from typing import Literal, Tuple
from .base import BaseResult, BaseError, snake_to_camel, camel_to_snake
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

DRAG_STEP = 30
class MBaseModel(BaseModel):
    class Config:
        populate_by_name = True

class MoveMouseRequest(MBaseModel):
    x: int = Field(0, description="x position", alias="PositionX")
    y: int = Field(0, description="y position", alias="PositionY")

class ClickMouseRequest(MBaseModel):
    x: int = Field(0, description="x position", alias="PositionX")
    y: int = Field(0, description="y position", alias="PositionY")
    button: Literal["left", "right", "middle", "double_click", "double_left"] = Field(
        "left", alias="Button"
    )
    press: bool = Field(False, description="press mouse", alias="Press")
    release: bool = Field(False, description="release mouse", alias="Release")

class PressMouseRequest(MBaseModel):
    x: int = Field(0, description="x position", alias="PositionX")
    y: int = Field(0, description="y position", alias="PositionY")
    button: Literal["left", "right", "middle"] = Field(
        "left", alias="Button"
    )

class ReleaseMouseRequest(MBaseModel):
    x: int = Field(0, description="x position", alias="PositionX")
    y: int = Field(0, description="y position", alias="PositionY")
    button: Literal["left", "right", "middle"] = Field(
        "left", alias="Button"
    )

class DragMouseRequest(MBaseModel):
    source_x: int = Field(0, description="source x position", alias="SourceX")
    source_y: int = Field(0, description="source y position", alias="SourceY")
    target_x: int = Field(0, description="target x position", alias="TargetX")
    target_y: int = Field(0, description="target y position", alias="TargetY")

class ScrollRequest(MBaseModel):
    scroll_direction: Literal["up", "down", "left", "right"] = Field(
        "up", alias="Direction"
    )
    scroll_amount: int = Field(0, description="scroll amount", alias="Amount")
    x: int = Field(0, description="x position", alias="PositionX")
    y: int = Field(0, description="y position", alias="PositionY")


class PressKeyRequest(MBaseModel):
    key: str = Field("", description="key", alias="Key")


class TypeTextRequest(MBaseModel):
    text: str = Field("", description="text", alias="Text")


class WaitRequest(MBaseModel):
    duration: int = Field(0, description="duration", alias="Duration")


class TakeScreenshotRequest(MBaseModel):
    pass


class GetCursorPositionRequest(MBaseModel):
    pass


class GetScreenSizeRequest(MBaseModel):
    pass


class ChangePasswordRequest(MBaseModel):
    username: str = Field("", description="username", alias="Username")
    new_password: str = Field("", description="new password", alias="NewPassword")


class IComputerTool(ABC):
    @abstractmethod
    def move_mouse(self, request: MoveMouseRequest):
        pass

    @abstractmethod
    def click_mouse(self, request: ClickMouseRequest):
        pass

    @abstractmethod
    def press_mouse(self, request: PressMouseRequest):
        pass

    @abstractmethod
    def release_mouse(self, request: ReleaseMouseRequest):
        pass

    @abstractmethod
    async def drag_mouse(self, request: DragMouseRequest):
        pass

    @abstractmethod
    def scroll(self, request: ScrollRequest):
        pass

    @abstractmethod
    def press_key(self, request: PressKeyRequest):
        pass

    @abstractmethod
    def type_text(self, request: TypeTextRequest):
        pass

    @abstractmethod
    def wait(self, request: WaitRequest):
        pass

    @abstractmethod
    def take_screenshot(self, request: TakeScreenshotRequest) -> BaseResult:
        pass

    @abstractmethod
    def get_cursor_position(self, request: GetCursorPositionRequest) -> Tuple[int, int]:
        pass

    @abstractmethod
    def get_screen_size(self, request: GetScreenSizeRequest) -> Tuple[int, int]:
        pass

    @abstractmethod
    def change_password(self, req: ChangePasswordRequest):
        pass


def chunks(s: str, chunk_size: int) -> list[str]:
    return [s[i: i + chunk_size] for i in range(0, len(s), chunk_size)]


def paste(foo):
    import time
    logger.info(f"========== PASTE FUNCTION CALLED ==========")
    logger.info(f"Input text: '{foo}'")
    logger.info(f"Text length: {len(foo)}")
    logger.info(f"Text type: {type(foo)}")
    logger.info(f"OS: {platform.system()}")

    # 获取当前鼠标位置，确认焦点
    current_pos = pyautogui.position()
    logger.info(f"Current mouse position: {current_pos}")

    # 方法1: 直接使用 pyautogui.write() 输入文本
    # 这个方法更可靠，不依赖剪贴板
    try:
        logger.info("Attempting method 1: pyautogui.write()")
        logger.info(f"Writing character by character with 0.05s interval...")

        # 对于英文和数字，直接使用 write
        for i, char in enumerate(foo):
            logger.info(f"  Writing char {i+1}/{len(foo)}: '{char}'")
            pyautogui.write(char, interval=0.05)
            time.sleep(0.05)

        logger.info(f"✅ Successfully typed all {len(foo)} characters using write()")
        logger.info(f"========== PASTE FUNCTION COMPLETED ==========")
        return

    except Exception as e:
        logger.error(f"❌ write() failed with error: {type(e).__name__}: {e}")
        logger.error(f"Error details: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")

        # 如果 write() 失败（比如包含中文），使用剪贴板方法
        logger.info("Attempting method 2: clipboard paste")
        try:
            # 先保存当前剪贴板内容
            try:
                old_clipboard = pyperclip.paste()
                logger.info(f"Old clipboard content: '{old_clipboard}'")
            except:
                old_clipboard = None
                logger.info("Could not read old clipboard content")

            # 复制新内容
            pyperclip.copy(foo)
            logger.info(f"Copied to clipboard: '{foo}'")
            time.sleep(0.2)

            # 验证剪贴板内容
            clipboard_check = pyperclip.paste()
            logger.info(f"Clipboard verification: '{clipboard_check}'")
            if clipboard_check != foo:
                logger.error(f"❌ Clipboard content mismatch! Expected: '{foo}', Got: '{clipboard_check}'")

            # 执行粘贴
            if platform.system() == 'Darwin':  # macOS
                logger.info("Executing Command+V on macOS")
                pyautogui.hotkey('command', 'v')
            else:  # Windows/Linux
                logger.info("Executing Ctrl+V")
                pyautogui.hotkey('ctrl', 'v')

            time.sleep(0.2)
            logger.info("✅ Successfully pasted from clipboard")
            logger.info(f"========== PASTE FUNCTION COMPLETED ==========")

        except Exception as e2:
            logger.error(f"❌ Clipboard method also failed: {type(e2).__name__}: {e2}")
            logger.error(f"Error details: {str(e2)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            logger.info(f"========== PASTE FUNCTION FAILED ==========")
            raise


def gen_path(source_x, source_y, target_x, target_y):
    drag_path = [[source_x, source_y]]
    dx = target_x - source_x
    dy = target_y - source_y
    steps = max(abs(int(dx / DRAG_STEP)), abs(int(dy / DRAG_STEP)))
    for i in range(steps):
        x = source_x + int(dx * i / steps)
        y = source_y + int(dy * i / steps)
        drag_path.append([x, y])
    drag_path.append([target_x, target_y])
    return drag_path


def generate_request(action: str, all_params: dict):
    model_cls = globals().get(f"{snake_to_camel(action)}Request")
    params = {k: camel_to_snake(v) for k, v in all_params.items()}
    if model_cls:
        return model_cls(**params)
    raise BaseError(f"request {snake_to_camel(action)}Request not found")
