# 🤖 Bot Collective Skill - 公开通用版本

> 一个完整的 OpenClaw 多 Bot 协作系统，支持 10 个专业角色、智能切换和分层记忆检索

## ✨ 特性

- **10 个专业 Bot**: 代码/运营/安全/提醒/知识/文件/自动化/漏洞/法律
- **智能角色切换**: 自动识别意图，路由到最合适的 Bot
- **分层记忆系统**: L0/L1/L2 三层检索，Token 节省 74%
- **RACI 协作矩阵**: 清晰的任务分工和协作机制
- **完全可配置**: 适用于任何 OpenClaw 用户

## 📦 安装

### 方法 1: 从 ClawHub 安装（推荐）

```bash
npx clawhub install bot-collective
```

### 方法 2: 从 GitHub 克隆

```bash
git clone https://github.com/kuyhii/bot-collective-skill.git
cp -r bot-collective-skill ~/.openclaw/workspace/skills/bot-collective
```

## 🔧 配置步骤

### 第 1 步：创建 Telegram Bots

通过 @BotFather 创建你需要的 Bot（最多 10 个）：

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot` 创建新 Bot
3. 按提示设置 Bot 名称和用户名
4. 复制 Bot Token ID（类似 `8684783881:AAHdqTcv...`）
5. 重复创建其他 Bot

**建议创建的 Bot**:
- @YourNameZongguanBot - 总管
- @YourNameDaimaBot - 代码专家
- @YourNameYunyinBot - 运营专家
- @YourNameAnquanBot - 安全审计师
- @YourNameTixingBot - 提醒助手
- @YourNameZhiguanBot - 知识管家
- @YourNameWenjianBot - 文件专家

### 第 2 步：配置 Bot Tokens

编辑 `config/bot-matrix.json`：

```bash
nano config/bot-matrix.json
```

将 `YOUR_BOT_TOKEN_ID` 替换为你的 Bot Token：

```json
{
  "bots": [
    {
      "id": "zhongguan",
      "handle": "@YourNameZongguanBot",
      "tokenId": "你的 Bot Token ID"
    },
    ...
  ]
}
```

### 第 3 步：生成记忆层

```bash
cd ~/.openclaw/workspace/skills/bot-collective
node scripts/setup-bots.js
```

这会生成 L0/L1 层文件和配置。

### 第 4 步：配置 OpenClaw Gateway

编辑 `~/.openclaw/workspace/MEMORY.md`，更新 Bot 矩阵部分。

### 第 5 步：重启 OpenClaw

```bash
openclaw gateway restart
```

## 📖 使用指南

### 基本使用

安装配置完成后，直接与你的总管 Bot 对话即可。系统会自动识别意图并路由：

```
"帮我写个 Python 脚本" → 自动路由到代码 Bot
"分析运营数据" → 自动路由到运营 Bot
"审计系统安全" → 自动路由到安全 Bot
"设置定时提醒" → 自动路由到提醒 Bot
```

### 自定义 Bot 数量

你不需要使用全部 10 个 Bot。可以只配置需要的：

**最小配置（3 个 Bot）**:
- 总管 Bot（必需）
- 代码 Bot（可选）
- 提醒 Bot（可选）

编辑 `config/bot-matrix.json`，将不需要的 Bot 状态改为 `"status": "inactive"`。

### 添加自定义 Bot

1. 在 `config/bot-matrix.json` 中添加新 Bot 配置
2. 创建 `memory/bot-yourbot.md` 记忆文件
3. 在 `memory/role-switcher.js` 中添加路由关键词
4. 运行 `node scripts/setup-bots.js` 生成层文件

## 🏗️ 架构说明

### 单入口多角色模式

```
用户 → 总管 Bot → 角色识别 → 专业 Bot → 结果汇总 → 用户
```

### 记忆分层

| 层级 | 内容 | 大小 | 用途 |
|------|------|------|------|
| L0 | Bot 摘要 | ~350B/Bot | 快速筛选 |
| L1 | 记忆概览 | ~800B/Bot | 深度评估 |
| L2 | 完整记忆 | ~1KB/Bot | 按需加载 |

### 路由规则

基于关键词匹配和评分系统：
- 优先关键词匹配：0.8 分
- 角色名匹配：0.6 分
- 别名匹配：0.5 分
- 部分匹配：0.2-0.3 分
- 排除词：直接过滤

分数 > 0.3 时路由到对应 Bot，否则使用总管 Bot。

## 🛠️ 开发工具

### 清理个人信息

如果要分享你的配置：

```bash
./cleanup-personal-info.sh
```

会移除：
- Bot Token IDs
- 具体日期
- 用户聊天记录

### 重新生成层文件

```bash
node scripts/generate-layers.js
```

### 测试角色切换

```bash
node memory/role-switcher.js
```

## 📋 故障排查

### Bot 无响应

1. 检查 Gateway 状态：`openclaw gateway status`
2. 验证 Bot Token 是否正确
3. 查看日志：`tail -f ~/.openclaw/logs/*.log`

### 角色切换不正确

1. 检查 `config/routing-rules.json`
2. 查看 L0 层文件是否存在
3. 运行测试：`node memory/role-switcher.js`

### 记忆检索慢

1. 确保 L0/L1 层已生成
2. 运行：`node scripts/generate-layers.js`
3. 检查层缓存

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

**贡献指南**:
1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🔗 链接

- **GitHub**: https://github.com/kuyhii/bot-collective-skill
- **ClawHub**: https://clawhub.com
- **OpenClaw 文档**: https://docs.openclaw.ai
- **Discord 社区**: https://discord.com/invite/clawd

## 📞 支持

遇到问题？

1. 查看 [FAQ](FAQ.md)
2. 提交 [Issue](https://github.com/kuyhii/bot-collective-skill/issues)
3. 在 Discord 社区提问

---

**版本**: 1.0.0  
**作者**: [Your Name]  
**最后更新**: 2026-03-18  
**状态**: ✅ 公开可用
