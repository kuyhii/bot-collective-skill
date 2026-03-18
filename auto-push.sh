#!/bin/bash

# Bot Collective Skill - 全自动 GitHub 推送脚本
# 使用方法：./auto-push.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_NAME="bot-collective-skill"
REPO_URL="https://github.com/kuyhii/${REPO_NAME}.git"
GITHUB_API="https://api.github.com"

echo "🚀 Bot Collective Skill - 全自动 GitHub 推送"
echo "=============================================="
echo ""

# 检查 gh 是否已登录
if ! gh auth status &>/dev/null; then
    echo "❌ 未登录 GitHub，请先运行：gh auth login"
    exit 1
fi

echo "✅ GitHub 已登录"
echo ""

# 检查仓库是否存在
echo "🔍 检查仓库是否存在..."
if gh repo view kuyhii/${REPO_NAME} &>/dev/null; then
    echo "✅ 仓库已存在"
else
    echo "⚠️  仓库不存在，尝试创建..."
    
    # 尝试创建仓库
    if gh repo create kuyhii/${REPO_NAME} --public --description "Multi-Bot collaboration system for OpenClaw - 10 specialized bots with role-switching and layered memory retrieval" 2>&1; then
        echo "✅ 仓库创建成功"
    else
        echo ""
        echo "❌ 自动创建失败（token 权限不足）"
        echo ""
        echo "📝 请手动创建仓库："
        echo "   1. 访问：https://github.com/new"
        echo "   2. Repository name: ${REPO_NAME}"
        echo "   3. Description: Multi-Bot collaboration system for OpenClaw"
        echo "   4. Visibility: Public"
        echo "   5. ❌ 不要勾选任何初始化选项"
        echo "   6. 点击 'Create repository'"
        echo ""
        read -p "创建完成后按回车继续..."
    fi
fi

echo ""
echo "📦 准备推送..."
cd "$SCRIPT_DIR"

# 检查远程仓库
if git remote | grep -q "^origin$"; then
    echo "✅ 远程仓库已配置"
    git remote set-url origin "$REPO_URL"
else
    echo "⚠️  添加远程仓库..."
    git remote add origin "$REPO_URL"
fi

echo ""
echo "📊 当前提交:"
git log --oneline
echo ""

# 推送
echo "🔄 推送到 GitHub..."
if git push -u origin main 2>&1; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "📦 仓库地址：https://github.com/kuyhii/${REPO_NAME}"
    echo ""
    
    # 询问是否创建 release
    read -p "是否现在创建 Release v1.0.0? (y/n): " create_release
    
    if [ "$create_release" = "y" ]; then
        echo ""
        echo "📦 创建 Release v1.0.0..."
        gh release create v1.0.0 \
            --title "Bot Collective Skill v1.0.0" \
            --notes "## 功能特性

- 10 个专业 Bot (代码/运营/安全/提醒/知识/文件/自动化/漏洞/法律)
- 智能角色切换系统
- 分层记忆检索 (L0/L1/L2) - Token 节省 74%
- RACI 任务协调矩阵
- 自动化设置脚本

## 安装

\`\`\`bash
npx clawhub install bot-collective
\`\`\`" \
            --generate-notes
        
        if [ $? -eq 0 ]; then
            echo "✅ Release 创建成功！"
            echo "📦 Release 地址：https://github.com/kuyhii/${REPO_NAME}/releases/tag/v1.0.0"
        else
            echo "⚠️  Release 创建失败，可以手动创建"
        fi
    fi
    
    echo ""
    echo "🎉 完成！"
    echo ""
    echo "📝 下一步:"
    echo "   1. 访问仓库：https://github.com/kuyhii/${REPO_NAME}"
    echo "   2. 发布到 ClawHub: npx clawhub publish"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能原因:"
    echo "   - 仓库不存在，请先手动创建"
    echo "   - 权限不足，请检查 token 权限"
    echo "   - 网络问题"
    echo ""
    echo "手动推送命令:"
    echo "   git remote add origin ${REPO_URL}"
    echo "   git push -u origin main"
    exit 1
fi
