# 快速推送指南 🚀

## 步骤 1: 创建 GitHub 仓库

访问以下链接创建仓库：
**https://github.com/new**

填写：
- **Repository name**: `bot-collective-skill`
- **Description**: `Multi-Bot collaboration system for OpenClaw - 10 specialized bots with role-switching and layered memory`
- **Visibility**: ✅ Public
- **Initialize**: ❌ 不要勾选任何初始化选项

点击 **Create repository**

## 步骤 2: 推送代码

仓库创建后，运行以下命令：

```bash
cd /root/.openclaw/workspace/skills/bot-collective

# 推送
git push -u origin main
```

## 或者使用完整命令

```bash
cd /root/.openclaw/workspace/skills/bot-collective
git remote add origin https://github.com/kuyhii/bot-collective-skill.git
git push -u origin main
```

## 创建 Release

推送成功后，创建 Release：

```bash
gh release create v1.0.0 --title "Bot Collective Skill v1.0.0" --notes "Initial release - 10 Bot 协作系统"
```

或者手动创建：
1. 访问 https://github.com/kuyhii/bot-collective-skill/releases
2. 点击 **Create a new release**
3. Tag version: `v1.0.0`
4. Release title: `Bot Collective Skill v1.0.0`
5. 描述：
   ```
   ## 功能特性
   
   - 10 个专业 Bot (代码/运营/安全/提醒/知识/文件/自动化/漏洞/法律)
   - 智能角色切换系统
   - 分层记忆检索 (L0/L1/L2) - Token 节省 74%
   - RACI 任务协调矩阵
   - 自动化设置脚本
   
   ## 安装
   
   ```bash
   npx clawhub install bot-collective
   ```
   ```

6. 点击 **Publish release**

---

**当前状态**: 
- ✅ Git 仓库已初始化
- ✅ 代码已提交 (2 commits)
- ⏳ 等待创建 GitHub 仓库
- ⏳ 等待推送

**仓库地址**: https://github.com/kuyhii/bot-collective-skill
