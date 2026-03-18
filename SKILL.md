---
name: bot-collective
version: 1.0.0
description: Multi-Bot collaboration system for OpenClaw. 10 specialized bots (code, ops, security, reminders, knowledge, files, automation, vulnerability, legal) with role-switching, layered memory retrieval, and coordinated task execution.
---

# Bot Collective Skill 🤖

A complete multi-Bot collaboration system for OpenClaw with role-switching, layered memory retrieval, and coordinated task execution.

## Overview

This skill provides a **Single Bot Entry + Multi-Agent Collaboration** architecture where one Telegram bot (@Zhongguanzhabot) serves as the entry point, automatically routing tasks to 10 specialized Bot roles.

## Bot Matrix

| Bot | Role | Telegram Handle | Token ID | Status |
|-----|------|-----------------|----------|--------|
| **zhongguan** | Coordinator/Manager | @Zhongguanzhabot | 8684783881 | ✅ Active |
| **daima** | Code Expert | @Daimazujbot | 8745777039 | ✅ Active |
| **yunyin** | Operations Analyst | @Yunyinhjibot | 8602144010 | ✅ Active |
| **anquan** | Security Auditor | @Anquansjbot | 8734523568 | ✅ Active |
| **tixing** | Reminder Assistant | @Tixingtongzbot | 8224484616 | ✅ Active |
| **zhisguan** | Knowledge Manager | @Zhisguanlbot | 8769173565 | ✅ Active |
| **wenjian** | File Specialist | @Wenjianclibot | 8724865823 | ✅ Active |
| **zidonghua** | Automation Expert | @Zidonghuabot | TBD | ⏳ Pending |
| **loudongku** | Vulnerability Scanner | @Loudongkubot | TBD | ⏳ Pending |
| **falvhegui** | Legal Compliance | @Falvheguibot | TBD | ⏳ Pending |

## Core Features

### 1. Role Switching
Automatic role identification and context loading based on user message intent.

**Keywords Mapping**:
- Code/GitHub/PR/issue → **daima**
- Operations/data/analysis/report → **yunyin**
- Security/audit/risk/check → **anquan**
- Reminder/schedule/alarm/notification → **tixing**
- Search/knowledge/document/find → **zhisguan**
- File/convert/format/image → **wenjian**
- Automation/cron/workflow → **zidonghua**
- Vulnerability/scan/CVE → **loudongku**
- Legal/contract/compliance → **falvhegui**
- Other/uncertain → **zhongguan** (default)

### 2. Layered Memory Retrieval (L0/L1/L2)

| Layer | Content | Size | Purpose |
|-------|---------|------|---------|
| **L0** | Bot summaries | ~3.5KB | Fast filtering |
| **L1** | Memory overview | ~8.1KB | Deep evaluation |
| **L2** | Full memory | ~10.5KB | On-demand loading |

**Benefits**: 74% token savings, 5x+ retrieval speed improvement

### 3. Task Routing & Coordination

- Automatic intent recognition
- Task distribution to specialized bots
- Progress tracking and reporting
- Result aggregation and response

### 4. Memory Architecture

**Shared Memory** (`MEMORY.md`):
- All bots can read
- Only coordinator (zhongguan) can write
- Contains: user info, bot matrix, system config

**Independent Memory** (`memory/bot-*.md`):
- All bots can read
- Only corresponding bot can write
- Contains: work logs, task progress, decisions

**Daily Logs** (`memory/YYYY-MM-DD.md`):
- All bots can read/write
- Raw activity logs

## Installation

```bash
# Install from ClawHub (when published)
npx clawhub install bot-collective

# Or clone from GitHub
git clone https://github.com/kuyhii/bot-collective-skill.git
cp -r bot-collective-skill ~/.openclaw/workspace/skills/bot-collective
```

## Usage

### For Users

Simply message your Telegram bot naturally. The system will automatically route to the appropriate bot role:

```
"帮我写个 Python 脚本" → Routes to @Daimazujbot
"分析运营数据" → Routes to @Yunyinhjibot
"审计一下系统安全" → Routes to @Anquansjbot
"设置定时提醒" → Routes to @Tixingtongzbot
```

### For Developers

**Load role-switcher**:
```javascript
const { RoleSwitcher } = require('./memory/role-switcher.js');
const switcher = new RoleSwitcher();

// Identify role from message
const role = switcher.identifyRole(userMessage);

// Load bot context
const botContext = switcher.loadBotContext(role);

// Build system prompt
const prompt = switcher.buildSystemPrompt(botContext);

// Log work after completion
switcher.logWork(role, { query: userMessage, response: botResponse });
```

**Access memory layers**:
```javascript
// L0: Quick bot summary
const l0 = switcher.loadL0('bot-daima.l0.json');

// L1: Detailed overview
const l1 = switcher.loadL1('bot-daima.l1.json');

// L2: Full memory
const memory = switcher.loadMemory('bot-daima.md');
```

## Files Structure

```
bot-collective/
├── SKILL.md                 # This file
├── README.md                # User documentation
├── scripts/
│   ├── setup-bots.js        # Bot initialization
│   └── generate-layers.js   # L0/L1 layer generation
├── memory/
│   ├── role-switcher.js     # Role switching logic
│   ├── bot-workflows.md     # Workflow definitions
│   ├── bot-zhongguan.md     # Coordinator memory
│   ├── bot-daima.md         # Code bot memory
│   ├── bot-yunyin.md        # Operations bot memory
│   ├── bot-anquan.md        # Security bot memory
│   ├── bot-tixing.md        # Reminder bot memory
│   ├── bot-zhisguan.md      # Knowledge bot memory
│   ├── bot-wenjian.md       # File bot memory
│   ├── bot-zidonghua.md     # Automation bot memory
│   ├── bot-loudongku.md     # Vulnerability bot memory
│   └── bot-falvhegui.md     # Legal bot memory
├── layers/
│   ├── index.json           # Layer index
│   ├── bot-*.l0.json        # L0 summaries (10 files)
│   └── bot-*.l1.json        # L1 overviews (10 files)
└── config/
    ├── bot-matrix.json      # Bot configuration
    └── routing-rules.json   # Routing configuration
```

## Configuration

### Gateway Settings

```json
{
  "dmScope": "main",
  "telegram": {
    "dmStrategy": "pairing",
    "groupStrategy": "allowlist",
    "allowedUsers": ["1257663247"]
  },
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1",
    "authMode": "token"
  }
}
```

### Model Settings

```json
{
  "defaultModel": "bailian/qwen3.5-plus",
  "provider": "Bailian"
}
```

## Workflows

### Workflow 1: User Request Processing
1. User sends message to @Zhongguanzhabot
2. RoleSwitcher identifies target bot role
3. Load corresponding bot context (L0/L1/L2)
4. Execute task with appropriate role
5. Log work to bot memory
6. Aggregate and respond to user

### Workflow 2: Skill Installation
1. Request received to install skill
2. Security bot (@Anquansjbot) reviews with skill-vetter
3. Risk assessment and report
4. Coordinator asks user for approval
5. Code bot executes installation
6. Security bot validates post-install
7. Coordinator updates configuration

### Workflow 3: Scheduled Reports
1. Cron job triggers reminder bot
2. Reminder bot requests data from operations/security bots
3. Aggregate results
4. Generate report
5. Send notification to user

### Workflow 4: Security Incident Response
1. Security event detected/reported
2. Security bot analyzes impact
3. Coordinator immediately notifies user
4. Isolate risk and develop fix
5. Security bot validates fix
6. Coordinator records incident to memory

## RACI Matrix

| Responsibility | zhongguan | daima | yunyin | anquan | tixing | zhisguan | wenjian |
|---------------|:---------:|:-----:|:------:|:------:|:------:|:--------:|:-------:|
| Session Routing | A | I | I | I | I | I | I |
| Task Distribution | A | C | C | C | C | C | C |
| GitHub Operations | I | R | I | C | I | I | C |
| Code Review | I | R | I | C | I | I | I |
| Data Analysis | I | C | R | I | I | C | C |
| Content Management | I | C | R | I | C | C | C |
| Security Audit | I | C | I | R | I | C | I |
| Skill Vetting | C | C | I | R | I | I | I |
| Scheduled Tasks | C | I | I | I | R | I | I |
| Knowledge Retrieval | I | C | C | C | I | R | C |
| File Operations | I | C | I | I | I | C | R |

**Legend**: R=Responsible, A=Accountable, C=Consulted, I=Informed

## Memory Priority Rules

**Before processing any task, check in order**:

1. **User Preferences** (USER-PREFERENCES.md) ← Highest priority
2. **Error Records** (evolution-state.json)
3. **Independent Memory** (bot-*.md)
4. **Shared Memory** (MEMORY.md) ← Lowest priority

## Reporting Rules

**Progress reporting to Telegram group**:

- **When receiving task**: Immediate confirmation
- **During execution**: Key milestone updates
- **On completion**: Full result report
- **On blocker**: Immediate escalation

**Format**: Natural language, no code blocks, @mention relevant parties

## Security Considerations

- All skills must be vetted before installation (use skill-vetter)
- High-risk operations require user approval
- Credentials never stored in memory files
- Security bot has veto power on risky operations
- All operations logged to daily memory files

## Troubleshooting

### Role not switching correctly
- Check `memory/role-switcher.js` keyword matching
- Verify L0 layer files exist in `memory/layers/`
- Review `memory/bot-workflows.md` routing rules

### Memory retrieval slow
- Ensure L0/L1 layers are generated
- Check layer cache in role-switcher
- Verify `memory/layers/index.json` is up to date

### Bot not responding
- Check Gateway status: `openclaw gateway status`
- Verify Telegram pairing: check MEMORY.md bot matrix
- Review daily logs: `memory/YYYY-MM-DD.md`

## Contributing

To add new bot roles:

1. Create `memory/bot-<role>.md` with bot definition
2. Add L0/L1 layer files
3. Update routing keywords in role-switcher.js
4. Update bot matrix in MEMORY.md
5. Test role switching with test cases

## License

MIT License - See LICENSE file for details

## Support

- Documentation: `/usr/lib/node_modules/openclaw/docs`
- Community: https://discord.com/invite/clawd
- GitHub: https://github.com/kuyhii

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-18  
**Author**: kuyhii
