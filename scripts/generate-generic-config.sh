#!/bin/bash

# 生成通用配置模板
# 将所有具体的 Bot 名称替换为通用占位符

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$SCRIPT_DIR/../config"
MEMORY_DIR="$SCRIPT_DIR/../memory"

echo "🔄 生成通用配置模板..."
echo ""

# 1. 更新 bot-matrix.json
echo "📝 更新 bot-matrix.json..."
cat > "$CONFIG_DIR/bot-matrix.json" << 'EOF'
{
  "version": "1.0.0",
  "mode": "single-instance-roleplay",
  "entryBot": "zhongguan",
  "entryHandle": "@YourBotName",
  "description": "Multi-Bot collaboration system for OpenClaw",
  "bots": [
    {
      "id": "zhongguan",
      "role": "Coordinator/Manager",
      "handle": "@YourBotName",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "active",
      "memoryFile": "memory/bot-zhongguan.md",
      "l0File": "memory/layers/bot-zhongguan.l0.json",
      "l1File": "memory/layers/bot-zhongguan.l1.json"
    },
    {
      "id": "daima",
      "role": "Code Expert",
      "handle": "@YourCodeBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "active",
      "memoryFile": "memory/bot-daima.md",
      "l0File": "memory/layers/bot-daima.l0.json",
      "l1File": "memory/layers/bot-daima.l1.json"
    },
    {
      "id": "yunyin",
      "role": "Operations Analyst",
      "handle": "@YourOpsBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "active",
      "memoryFile": "memory/bot-yunyin.md",
      "l0File": "memory/layers/bot-yunyin.l0.json",
      "l1File": "memory/layers/bot-yunyin.l1.json"
    },
    {
      "id": "anquan",
      "role": "Security Auditor",
      "handle": "@YourSecurityBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "active",
      "memoryFile": "memory/bot-anquan.md",
      "l0File": "memory/layers/bot-anquan.l0.json",
      "l1File": "memory/layers/bot-anquan.l1.json"
    },
    {
      "id": "tixing",
      "role": "Reminder Assistant",
      "handle": "@YourReminderBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "active",
      "memoryFile": "memory/bot-tixing.md",
      "l0File": "memory/layers/bot-tixing.l0.json",
      "l1File": "memory/layers/bot-tixing.l1.json"
    },
    {
      "id": "zhisguan",
      "role": "Knowledge Manager",
      "handle": "@YourKnowledgeBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "active",
      "memoryFile": "memory/bot-zhisguan.md",
      "l0File": "memory/layers/bot-zhisguan.l0.json",
      "l1File": "memory/layers/bot-zhisguan.l1.json"
    },
    {
      "id": "wenjian",
      "role": "File Specialist",
      "handle": "@YourFileBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "active",
      "memoryFile": "memory/bot-wenjian.md",
      "l0File": "memory/layers/bot-wenjian.l0.json",
      "l1File": "memory/layers/bot-wenjian.l1.json"
    },
    {
      "id": "zidonghua",
      "role": "Automation Expert",
      "handle": "@YourAutomationBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "pending",
      "memoryFile": "memory/bot-zidonghua.md",
      "l0File": "memory/layers/bot-zidonghua.l0.json",
      "l1File": "memory/layers/bot-zidonghua.l1.json"
    },
    {
      "id": "loudongku",
      "role": "Vulnerability Scanner",
      "handle": "@YourSecurityScanBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "pending",
      "memoryFile": "memory/bot-loudongku.md",
      "l0File": "memory/layers/bot-loudongku.l0.json",
      "l1File": "memory/layers/bot-loudongku.l1.json"
    },
    {
      "id": "falvhegui",
      "role": "Legal Compliance",
      "handle": "@YourLegalBot",
      "tokenId": "YOUR_BOT_TOKEN_ID",
      "status": "pending",
      "memoryFile": "memory/bot-falvhegui.md",
      "l0File": "memory/layers/bot-falvhegui.l0.json",
      "l1File": "memory/layers/bot-falvhegui.l1.json"
    }
  ],
  "routing": {
    "strategy": "keyword-matching",
    "fallback": "zhongguan",
    "minScore": 0.3
  },
  "memory": {
    "shared": "MEMORY.md",
    "independent": "memory/bot-*.md",
    "daily": "memory/YYYY-MM-DD.md",
    "layers": "memory/layers/"
  }
}
EOF
echo "✅ bot-matrix.json 已更新为通用模板"

# 2. 更新 routing-rules.json
echo ""
echo "📝 更新 routing-rules.json..."
cat > "$CONFIG_DIR/routing-rules.json" << 'EOF'
{
  "version": "1.0.0",
  "strategy": "keyword-matching-with-scoring",
  "defaultBot": "zhongguan",
  "minScore": 0.3,
  "rules": {
    "zhongguan": {
      "priority": ["manager", "coordinate", "admin", "route", "summary"],
      "exclude": ["code", "security", "ops", "reminder", "knowledge", "file"],
      "allKeywords": ["coordinate", "route", "summary", "manage", "system", "config", "manager", "task", "distribute"],
      "fallback": null,
      "isDefault": true
    },
    "daima": {
      "priority": ["code", "github", "pr", "issue", "script", "programming"],
      "exclude": ["security", "ops", "reminder"],
      "allKeywords": ["code", "github", "pr", "issue", "script", "programming", "development", "review", "mcp", "skill"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "yunyin": {
      "priority": ["operations", "data", "analysis", "report"],
      "exclude": ["code", "security"],
      "allKeywords": ["operations", "data", "analysis", "report", "content", "user", "statistics", "trend", "kpi"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "anquan": {
      "priority": ["security", "audit", "risk", "check"],
      "exclude": ["code", "ops"],
      "allKeywords": ["security", "audit", "risk", "check", "review", "vulnerability", "assessment"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "tixing": {
      "priority": ["reminder", "schedule", "alarm", "notification"],
      "exclude": ["code", "security"],
      "allKeywords": ["reminder", "schedule", "alarm", "notification", "cron", "progress", "alert"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "zhisguan": {
      "priority": ["knowledge", "search", "retrieval"],
      "exclude": ["code", "security", "file"],
      "allKeywords": ["knowledge", "search", "find", "document", "retrieval", "qa", "semantic", "information"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "wenjian": {
      "priority": ["file", "convert", "format"],
      "exclude": ["code", "security", "knowledge"],
      "allKeywords": ["file", "convert", "format", "image", "pdf", "document", "parse", "media", "compress"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "zidonghua": {
      "priority": ["automation", "workflow", "cron"],
      "exclude": ["code", "security"],
      "allKeywords": ["automation", "workflow", "cron", "schedule", "script", "timer", "periodic"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "loudongku": {
      "priority": ["vulnerability", "scan", "cve"],
      "exclude": ["code", "ops"],
      "allKeywords": ["vulnerability", "scan", "cve", "penetration", "detection", "security"],
      "fallback": "zhongguan",
      "isDefault": false
    },
    "falvhegui": {
      "priority": ["legal", "contract", "compliance"],
      "exclude": ["code", "ops", "security"],
      "allKeywords": ["legal", "contract", "compliance", "terms", "agreement", "regulation", "review"],
      "fallback": "zhongguan",
      "isDefault": false
    }
  },
  "scoring": {
    "roleMatch": 0.6,
    "aliasMatch": 0.5,
    "priorityKeywordMatch": 0.8,
    "keywordPartialMatch": 0.2,
    "summaryMatch": 0.3,
    "skillMatch": 0.2,
    "taskMatch": 0.1,
    "excludePenalty": 0
  }
}
EOF
echo "✅ routing-rules.json 已更新为通用模板"

echo ""
echo "✅ 通用配置模板生成完成！"
echo ""
echo "📝 用户需要:"
echo "   1. 编辑 config/bot-matrix.json"
echo "   2. 替换 @YourBotName 等为自己的 Bot 用户名"
echo "   3. 替换 YOUR_BOT_TOKEN_ID 为实际 Token"
echo ""
