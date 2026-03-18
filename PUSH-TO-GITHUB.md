# 推送到 GitHub 指南

技能已创建完成，需要手动推送到 GitHub。

## 方法 1: 使用 HTTPS (推荐)

```bash
cd /root/.openclaw/workspace/skills/bot-collective

# 设置 Git 用户信息 (如果尚未设置)
git config --global user.email "your-email@example.com"
git config --global user.name "kuyhii"

# 推送到 GitHub
git remote add origin https://github.com/kuyhii/bot-collective-skill.git
git push -u origin main
```

如果提示输入密码，请使用 GitHub Personal Access Token：
1. 访问 https://github.com/settings/tokens
2. 创建新 token (勾选 `repo` 权限)
3. 使用 token 作为密码

## 方法 2: 使用 SSH

```bash
# 生成 SSH 密钥 (如果没有)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 添加公钥到 GitHub
# 访问 https://github.com/settings/keys
# 复制 ~/.ssh/id_ed25519.pub 内容并添加

# 切换远程 URL 为 SSH
cd /root/.openclaw/workspace/skills/bot-collective
git remote set-url origin git@github.com:kuyhii/bot-collective-skill.git

# 推送
git push -u origin main
```

## 方法 3: 使用 GitHub CLI

```bash
# 安装 gh (如果尚未安装)
# https://github.com/cli/cli#installation

# 认证
gh auth login

# 创建并推送仓库
cd /root/.openclaw/workspace/skills/bot-collective
gh repo create kuyhii/bot-collective-skill --public --source=. --remote=origin --push
```

## 创建 GitHub Release

推送后，创建 Release 以便通过 ClawHub 安装：

```bash
# 使用 gh CLI
gh release create v1.0.0 --title "Bot Collective Skill v1.0.0" --notes "Initial release"

# 或手动创建
# 访问 https://github.com/kuyhii/bot-collective-skill/releases
# 点击 "Create a new release"
# Tag: v1.0.0
# Title: Bot Collective Skill v1.0.0
```

## 发布到 ClawHub

```bash
# 安装 clawhub CLI
npm install -g clawhub

# 发布技能
cd /root/.openclaw/workspace/skills/bot-collective
npx clawhub publish
```

## 验证安装

发布后，测试安装：

```bash
# 在新环境中测试
npx clawhub install bot-collective
```

---

**当前状态**: ✅ Git 仓库已初始化，已提交初始版本
**下一步**: 选择上述方法之一推送到 GitHub
