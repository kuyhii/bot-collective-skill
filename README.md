# Bot Collective Skill - 多 Bot 协作系统

一个完整的 OpenClaw 多 Bot 协作系统，支持角色切换、分层记忆检索和协调任务执行。

## 快速开始

### 安装

```bash
# 从 ClawHub 安装（发布后）
npx clawhub install bot-collective

# 或从 GitHub 克隆
git clone https://github.com/kuyhii/bot-collective-skill.git
cp -r bot-collective-skill ~/.openclaw/workspace/skills/bot-collective
```

### 配置

1. **编辑 MEMORY.md** - 更新你的 Bot 矩阵和 Telegram 配对状态
2. **配置 Gateway** - 确保 `dmScope: main` 和 Telegram 配对策略正确
3. **生成记忆层** - 运行 `node memory/generate-layers.js` 创建 L0/L1 层

### 使用

直接在 Telegram 中与 @Zhongguanzhabot 对话，系统会自动识别意图并路由到对应的专业 Bot：

```
"帮我写个 Python 脚本" → @Daimazujbot (代码专家)
"分析运营数据" → @Yunyinhjibot (运营助手)
"审计一下系统安全" → @Anquansjbot (安全审计)
"设置定时提醒" → @Tixingtongzbot (提醒通知)
"搜索知识库" → @Zhisguanlbot (知识管理)
"转换文件格式" → @Wenjianclibot (文件处理)
```

## 10 个专业 Bot

| Bot | 角色 | 职责 |
|-----|------|------|
| @Zhongguanzhabot | 总管 | 任务路由、汇总汇报、系统协调 |
| @Daimazujbot | 代码专家 | GitHub 操作、代码审查、MCP 测试 |
| @Yunyinhjibot | 运营专家 | 数据分析、报告生成、内容管理 |
| @Anquansjbot | 安全审计师 | 安全审查、风险评估、技能审查 |
| @Tixingtongzbot | 提醒助手 | 定时任务、进度督促、告警通知 |
| @Zhisguanlbot | 知识管家 | 知识检索、文档管理、问答支持 |
| @Wenjianclibot | 文件专家 | 文件处理、格式转换、文档解析 |
| @Zidonghuabot | 自动化专家 | 工作流自动化、Cron 任务配置 |
| @Loudongkubot | 漏洞扫描师 | 漏洞检测、安全扫描、CVE 查询 |
| @Falvheguibot | 法律合规官 | 合同审查、合规检查、法律咨询 |

## 核心特性

### 1. 单入口多角色

只需一个 Telegram Bot (@Zhongguanzhabot) 作为入口，根据消息内容自动切换 10 个专业角色。

### 2. 分层记忆检索

- **L0 层**: Bot 摘要 (~3.5KB) - 快速筛选
- **L1 层**: 记忆概览 (~8.1KB) - 深度评估
- **L2 层**: 完整记忆 (~10.5KB) - 按需加载

**收益**: Token 节省 74%，检索速度提升 5x+

### 3. 智能任务路由

基于关键词和语义识别自动路由到最合适的 Bot 角色。

### 4. 独立记忆系统

每个 Bot 有自己的专属记忆文件，记录工作日志和任务进度。

## 文件结构

```
bot-collective/
├── SKILL.md                 # 技能定义
├── README.md                # 本文档
├── scripts/
│   ├── setup-bots.js        # Bot 初始化脚本
│   └── generate-layers.js   # L0/L1层生成脚本
├── memory/
│   ├── role-switcher.js     # 角色切换逻辑
│   ├── bot-workflows.md     # 工作流定义
│   └── bot-*.md             # 10 个 Bot 专属记忆
├── layers/
│   ├── index.json           # 层索引
│   ├── bot-*.l0.json        # 10 个 L0 摘要
│   └── bot-*.l1.json        # 10 个 L1 概览
└── config/
    ├── bot-matrix.json      # Bot 配置
    └── routing-rules.json   # 路由规则
```

## 开发者接口

### 角色切换器

```javascript
const { RoleSwitcher } = require('./memory/role-switcher.js');
const switcher = new RoleSwitcher();

// 识别角色
const role = switcher.identifyRole(userMessage);

// 加载上下文
const botContext = switcher.loadBotContext(role);

// 构建 System Prompt
const prompt = switcher.buildSystemPrompt(botContext);

// 记录工作日志
switcher.logWork(role, { query: userMessage, response: botResponse });
```

### 记忆层访问

```javascript
// L0: Bot 摘要
const l0 = switcher.loadL0('bot-daima.l0.json');

// L1: 详细概览
const l1 = switcher.loadL1('bot-daima.l1.json');

// L2: 完整记忆
const memory = switcher.loadMemory('bot-daima.md');
```

## 工作流

### 工作流 1: 用户请求处理

1. 用户发送消息到 @Zhongguanzhabot
2. RoleSwitcher 识别目标 Bot 角色
3. 加载对应 Bot 上下文 (L0/L1/L2)
4. 以适当角色执行任务
5. 记录工作到 Bot 记忆
6. 汇总并回复用户

### 工作流 2: 技能安装流程

1. 收到安装技能请求
2. 安全 Bot 使用 skill-vetter 审查
3. 风险评估和报告
4. 总管征求用户批准
5. 代码 Bot 执行安装
6. 安全 Bot 验证安装后状态
7. 总管更新配置

### 工作流 3: 定时报告生成

1. Cron 任务触发提醒 Bot
2. 提醒 Bot 请求运营/安全 Bot 提供数据
3. 汇总结果
4. 生成报告
5. 发送通知给用户

## 记忆访问规则

**处理任务前必须按顺序检查**:

1. **用户偏好** (USER-PREFERENCES.md) ← 最高优先级
2. **纠错记录** (evolution-state.json)
3. **专属记忆** (bot-*.md)
4. **共享记忆** (MEMORY.md) ← 最低优先级

## 汇报规则

**Telegram 群组实时汇报**:

- 接收任务时 → 立即确认
- 执行中 → 关键节点汇报
- 完成时 → 完整汇报结果
- 遇到阻塞 → 立即上报

**格式**: 自然语言，不使用代码块，@提及相关人员

## 故障排查

### 角色切换不正确

- 检查 `memory/role-switcher.js` 关键词匹配
- 验证 L0 层文件存在于 `memory/layers/`
- 查看 `memory/bot-workflows.md` 路由规则

### 记忆检索慢

- 确保 L0/L1 层已生成
- 检查 role-switcher 中的层缓存
- 验证 `memory/layers/index.json` 是最新的

### Bot 无响应

- 检查 Gateway 状态：`openclaw gateway status`
- 验证 Telegram 配对：查看 MEMORY.md Bot 矩阵
- 查看每日日志：`memory/YYYY-MM-DD.md`

## 添加新 Bot 角色

1. 创建 `memory/bot-<role>.md` 包含 Bot 定义
2. 添加 L0/L1 层文件
3. 在 role-switcher.js 中更新路由关键词
4. 在 MEMORY.md 中更新 Bot 矩阵
5. 使用测试用例测试角色切换

## 安全注意事项

- 安装前必须审查所有技能 (使用 skill-vetter)
- 高风险操作需要用户批准
- 凭证绝不存储在记忆文件中
- 安全 Bot 对风险操作有一票否决权
- 所有操作记录到每日记忆文件

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 支持

- 文档：`/usr/lib/node_modules/openclaw/docs`
- 社区：https://discord.com/invite/clawd
- GitHub: https://github.com/kuyhii

---

**版本**: 1.0.0  
**最后更新**: 2026-03-18  
**作者**: kuyhii
