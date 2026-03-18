#!/bin/bash

# 清理个人信息脚本 - 将技能变为通用版本
# 会移除：Telegram Bot Tokens、用户 ID、个人聊天记录等

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEMORY_DIR="$SCRIPT_DIR/memory"
CONFIG_DIR="$SCRIPT_DIR/config"

echo "🧹 清理个人信息 - 通用版本处理"
echo "================================"
echo ""

cd "$SCRIPT_DIR"

# 1. 清理 config/bot-matrix.json
echo "📝 清理 bot-matrix.json..."
cat "$CONFIG_DIR/bot-matrix.json" | \
  sed 's/"tokenId": "[0-9]*"/"tokenId": "YOUR_BOT_TOKEN_ID"/g' \
  > "$CONFIG_DIR/bot-matrix.json.tmp"
mv "$CONFIG_DIR/bot-matrix.json.tmp" "$CONFIG_DIR/bot-matrix.json"
echo "✅ 已替换所有 Token ID 为占位符"

# 2. 清理所有 bot-*.md 记忆文件
echo ""
echo "📝 清理 Bot 记忆文件..."
for file in "$MEMORY_DIR"/bot-*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "  处理：$filename"
    
    # 替换 Bot Token IDs
    sed -i 's/\*\*Bot ID\*\*: [0-9]*/\*\*Bot ID\*\*: YOUR_BOT_TOKEN_ID/g' "$file"
    
    # 替换具体日期为占位符
    sed -i 's/2026-03-[0-9][0-9]T[0-9:]*Z/创建时的日期/g' "$file"
    
    # 替换用户查询记录
    sed -i 's/\*\*用户查询\*\*: .*/\*\*用户查询\*\*: [用户消息]/g' "$file"
    sed -i 's/用户消息：.*/用户消息：[示例]/g' "$file"
    
    # 替换决策日志中的具体日期
    sed -i 's/2026-03-[0-9][0-9]: /日期：/g' "$file"
  fi
done
echo "✅ Bot 记忆文件已清理"

# 3. 清理 layers/*.json
echo ""
echo "📝 清理 L0/L1 层文件..."
for file in "$MEMORY_DIR/layers"/*.json; do
  if [ -f "$file" ]; then
    sed -i 's/"tokenId": "[0-9]*"/"tokenId": "YOUR_BOT_TOKEN_ID"/g' "$file"
    sed -i 's/"lastActive": "[^"]*"/"lastActive": "安装后自动生成"/g' "$file"
    sed -i 's/"generatedAt": "[^"]*"/"generatedAt": "安装后自动生成"/g' "$file"
  fi
done
echo "✅ 层文件已清理"

# 4. 更新 README 说明
echo ""
echo "📝 更新文档说明..."

# 在 README.md 中添加配置说明
if ! grep -q "## 🔧 安装后配置" "$SCRIPT_DIR/README.md"; then
  cat >> "$SCRIPT_DIR/README.md" << 'EOF'

## 🔧 安装后配置

### 第 1 步：配置 Bot Tokens

编辑 `config/bot-matrix.json`，将 `YOUR_BOT_TOKEN_ID` 替换为你的 Bot Token：

```json
{
  "tokenId": "你的 Bot Token ID"
}
```

### 第 2 步：创建 Telegram Bots

通过 @BotFather 创建 10 个 Bot：
1. `/newbot` 创建新 Bot
2. 设置 Bot 名称和用户名
3. 复制 Bot Token ID
4. 填入 `config/bot-matrix.json`

### 第 3 步：生成记忆层

```bash
node scripts/setup-bots.js
```

### 第 4 步：配置 OpenClaw

编辑 `MEMORY.md`，更新 Bot 矩阵信息。
EOF
  echo "✅ README.md 已更新配置说明"
fi

echo ""
echo "✅ 清理完成！"
echo ""
echo "📦 已清理的内容："
echo "   - Bot Token IDs → YOUR_BOT_TOKEN_ID"
echo "   - 具体日期 → 占位符"
echo "   - 用户聊天记录 → 示例文本"
echo ""
echo "📝 下一步："
echo "   1. 审查清理结果：git diff"
echo "   2. 提交更改：git commit -am 'Remove personal info for public release'"
echo "   3. 推送到 GitHub: git push"
echo ""
