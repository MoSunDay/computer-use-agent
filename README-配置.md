# 配置说明

## 首次使用

1. **复制配置文件**
   ```bash
   cd planner
   cp config.toml.example config.toml
   ```

2. **编辑配置**
   ```bash
   vim config.toml
   ```
   
   修改以下内容：
   - `name = "YOUR_MODEL_ID_HERE"` → 填入你的模型 ID
   - `api_key = "YOUR_API_KEY_HERE"` → 填入你的 API Key

3. **启动服务**
   ```bash
   ./start-all.sh
   ```

## 安全提示

⚠️ `config.toml` 已被添加到 `.gitignore`，不会被提交到 Git

