#!/bin/bash

# Bot Collective Skill - Push to GitHub
# 使用指南：先在 GitHub 创建仓库，然后运行此脚本

set -e

REPO_URL="https://github.com/kuyhii/bot-collective-skill.git"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Bot Collective Skill - GitHub Push Script"
echo "=============================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "$SCRIPT_DIR/SKILL.md" ]; then
    echo "❌ Error: SKILL.md not found. Please run this script from the bot-collective directory."
    exit 1
fi

# 检查 git 是否配置
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed."
    exit 1
fi

echo "📦 Current commits:"
git log --oneline
echo ""

# 检查远程仓库
if git remote | grep -q "^origin$"; then
    echo "✅ Remote 'origin' exists"
    git remote -v
else
    echo "⚠️  Remote 'origin' not found. Adding..."
    git remote add origin "$REPO_URL"
fi

echo ""
echo "📝 Ready to push to: $REPO_URL"
echo ""
echo "⚠️  IMPORTANT: Before pushing, make sure you've created the repository on GitHub:"
echo "   1. Visit: https://github.com/new"
echo "   2. Repository name: bot-collective-skill"
echo "   3. Visibility: Public"
echo "   4. DO NOT initialize with README/.gitignore"
echo "   5. Click 'Create repository'"
echo ""

read -p "Have you created the repository? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "❌ Push cancelled. Please create the repository first."
    exit 1
fi

echo ""
echo "🔄 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push successful!"
    echo ""
    echo "📦 Next steps:"
    echo "   1. Visit: https://github.com/kuyhii/bot-collective-skill"
    echo "   2. Create a release:"
    echo "      gh release create v1.0.0 --title 'Bot Collective Skill v1.0.0' --notes 'Initial release'"
    echo "   3. Or manually create release at:"
    echo "      https://github.com/kuyhii/bot-collective-skill/releases/new"
    echo ""
    echo "🎉 Done!"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   - Repository exists on GitHub"
    echo "   - You have write permissions"
    echo "   - Your GitHub token has repo scope"
    exit 1
fi
