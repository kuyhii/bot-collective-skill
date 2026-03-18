#!/bin/bash

# Bot Collective Skill - SSH 自动推送脚本
# 使用前提：已将 SSH 公钥添加到 GitHub

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_SSH="git@github.com:kuyhii/bot-collective-skill.git"

echo "🚀 Bot Collective Skill - SSH 自动推送"
echo "========================================"
echo ""

cd "$SCRIPT_DIR"

# 检查 SSH 密钥
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ SSH 密钥不存在"
    exit 1
fi

echo "✅ SSH 密钥存在"

# 检查 GitHub 是否可连接
echo "🔍 测试 GitHub SSH 连接..."
if ssh -o StrictHostKeyChecking=no -o BatchMode=yes git@github.com exit 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ GitHub SSH 连接成功"
else
    echo "⚠️  GitHub SSH 连接失败"
    echo ""
    echo "📝 请先将 SSH 公钥添加到 GitHub："
    echo ""
    echo "1. 复制公钥："
    cat ~/.ssh/id_ed25519.pub
    echo ""
    echo "2. 访问：https://github.com/settings/keys"
    echo "3. 点击 'New SSH key'"
    echo "4. 粘贴公钥并保存"
    echo ""
    read -p "添加完成后按回车继续..."
fi

# 切换远程仓库为 SSH
echo ""
echo "🔄 切换远程仓库为 SSH..."
if git remote | grep -q "^origin$"; then
    git remote set-url origin "$REPO_SSH"
else
    git remote add origin "$REPO_SSH"
fi

echo "✅ 远程仓库：$(git remote get-url origin)"

# 显示提交
echo ""
echo "📊 当前提交:"
git log --oneline

# 推送
echo ""
echo "🔄 推送到 GitHub..."
if git push -u origin main 2>&1; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "📦 仓库地址：https://github.com/kuyhii/bot-collective-skill"
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
\`\`\`"
        
        if [ $? -eq 0 ]; then
            echo "✅ Release 创建成功！"
            echo "📦 Release 地址：https://github.com/kuyhii/bot-collective-skill/releases/tag/v1.0.0"
        else
            echo "⚠️  Release 创建失败，可以手动创建"
        fi
    fi
    
    echo ""
    echo "🎉 全部完成！"
    echo ""
    echo "📝 下一步:"
    echo "   1. 访问仓库：https://github.com/kuyhii/bot-collective-skill"
    echo "   2. 发布到 ClawHub: npx clawhub publish"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    exit 1
fi
