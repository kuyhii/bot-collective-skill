#!/usr/bin/env node

/**
 * Bot Collective Setup Script
 * 
 * Initializes bot configuration, generates L0/L1 layers,
 * and validates the multi-bot system setup.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.HOME + '/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const LAYERS_DIR = path.join(MEMORY_DIR, 'layers');
const SKILL_DIR = path.join(WORKSPACE, 'skills/bot-collective');

// Bot definitions
const BOTS = [
  {
    id: 'zhongguan',
    role: '总管/协调者',
    handle: '@Zhongguanzhabot',
    tokenId: '8684783881',
    status: 'active',
    summary: '任务路由、汇总汇报、系统协调',
    skills: ['会话管理', '任务分发', '记忆维护', '系统监控'],
    keywords: ['协调', '路由', '汇总', '管理', '系统', '配置'],
    priorityKeywords: ['总管', '协调', '管理'],
    excludeKeywords: ['代码', '安全', '运营', '提醒', '知识', '文件']
  },
  {
    id: 'daima',
    role: '代码专家',
    handle: '@Daimazujbot',
    tokenId: '8745777039',
    status: 'active',
    summary: 'GitHub 操作、代码审查、MCP 测试',
    skills: ['GitHub', 'Code Review', 'MCP', '技能审查'],
    keywords: ['代码', 'GitHub', 'PR', 'issue', '脚本', '编程', '开发'],
    priorityKeywords: ['代码', 'GitHub', 'PR', 'issue'],
    excludeKeywords: ['安全', '运营', '提醒', '法律']
  },
  {
    id: 'yunyin',
    role: '运营专家',
    handle: '@Yunyinhjibot',
    tokenId: '8602144010',
    status: 'active',
    summary: '数据分析、报告生成、内容管理',
    skills: ['数据分析', '内容管理', '用户运营', '报告生成'],
    keywords: ['运营', '数据', '分析', '报告', '内容', '用户'],
    priorityKeywords: ['运营', '数据', '分析'],
    excludeKeywords: ['代码', '安全', '法律']
  },
  {
    id: 'anquan',
    role: '安全审计师',
    handle: '@Anquansjbot',
    tokenId: '8734523568',
    status: 'active',
    summary: '安全审查、风险评估、技能审查',
    skills: ['安全审计', '技能审查', '漏洞扫描', '风险评估'],
    keywords: ['安全', '审计', '风险', '检查', '审查', '漏洞'],
    priorityKeywords: ['安全', '审计', '风险'],
    excludeKeywords: ['代码', '运营', '提醒']
  },
  {
    id: 'tixing',
    role: '提醒助手',
    handle: '@Tixingtongzbot',
    tokenId: '8224484616',
    status: 'active',
    summary: '定时任务、进度督促、告警通知',
    skills: ['定时任务', '提醒通知', '进度督促', '心跳检查'],
    keywords: ['提醒', '定时', '闹钟', '通知', '督促', 'Cron'],
    priorityKeywords: ['提醒', '定时', '闹钟'],
    excludeKeywords: ['代码', '安全', '法律']
  },
  {
    id: 'zhisguan',
    role: '知识管家',
    handle: '@Zhisguanlbot',
    tokenId: '8769173565',
    status: 'active',
    summary: '知识检索、文档管理、问答支持',
    skills: ['知识检索', '文档管理', '语义搜索', '问答'],
    keywords: ['知识', '搜索', '查找', '文档', '检索', '问答'],
    priorityKeywords: ['知识', '搜索', '检索'],
    excludeKeywords: ['代码', '安全', '文件']
  },
  {
    id: 'wenjian',
    role: '文件专家',
    handle: '@Wenjianclibot',
    tokenId: '8724865823',
    status: 'active',
    summary: '文件处理、格式转换、文档解析',
    skills: ['文件管理', '格式转换', '文档解析', '媒体处理'],
    keywords: ['文件', '转换', '格式', '图片', 'PDF', '文档'],
    priorityKeywords: ['文件', '转换', '格式'],
    excludeKeywords: ['代码', '安全', '知识']
  },
  {
    id: 'zidonghua',
    role: '自动化专家',
    handle: '@Zidonghuabot',
    tokenId: 'TBD',
    status: 'pending',
    summary: '工作流自动化、Cron 任务配置、脚本执行',
    skills: ['自动化', 'Cron', '工作流', '脚本'],
    keywords: ['自动化', '工作流', 'Cron', '调度', '脚本'],
    priorityKeywords: ['自动化', '工作流', 'Cron'],
    excludeKeywords: ['代码', '安全']
  },
  {
    id: 'loudongku',
    role: '漏洞扫描师',
    handle: '@Loudongkubot',
    tokenId: 'TBD',
    status: 'pending',
    summary: '漏洞检测、安全扫描、CVE 查询',
    skills: ['漏洞扫描', '渗透测试', 'CVE 查询', '安全报告'],
    keywords: ['漏洞', '扫描', 'CVE', '渗透', '检测'],
    priorityKeywords: ['漏洞', '扫描', 'CVE'],
    excludeKeywords: ['代码', '运营']
  },
  {
    id: 'falvhegui',
    role: '法律合规官',
    handle: '@Falvheguibot',
    tokenId: 'TBD',
    status: 'pending',
    summary: '合同审查、合规检查、法律咨询',
    skills: ['合同审查', '合规检查', '法律查询', '风险提示'],
    keywords: ['法律', '合同', '合规', '条款', '协议', '法规'],
    priorityKeywords: ['法律', '合同', '合规'],
    excludeKeywords: ['代码', '运营', '安全']
  }
];

/**
 * Generate L0 layer file for a bot
 */
function generateL0(bot) {
  return {
    bot: bot.id,
    role: bot.role,
    handle: bot.handle,
    tokenId: bot.tokenId,
    status: bot.status,
    summary: bot.summary,
    keySkills: bot.skills,
    priorityKeywords: bot.priorityKeywords,
    excludeKeywords: bot.excludeKeywords,
    aliases: bot.keywords,
    isDefault: bot.id === 'zhongguan',
    currentTasks: [],
    lastActive: new Date().toISOString()
  };
}

/**
 * Generate L1 layer file for a bot
 */
function generateL1(bot, l0Data) {
  const memoryFile = path.join(MEMORY_DIR, `bot-${bot.id}.md`);
  let memoryContent = '';
  
  if (fs.existsSync(memoryFile)) {
    memoryContent = fs.readFileSync(memoryFile, 'utf8');
  }

  // Extract recent tasks from memory
  const taskMatches = memoryContent.match(/### T\d+:.*?(?=\n### T|\n_最后更新)/gs) || [];
  const currentTasks = taskMatches.slice(0, 3).map(task => {
    const statusMatch = task.match(/\*\*状态\*\*: (.+)/);
    const descMatch = task.match(/### (T\d+: .+)/);
    return {
      id: descMatch ? descMatch[1] : 'Unknown',
      status: statusMatch ? statusMatch[1].trim() : 'unknown',
      desc: descMatch ? descMatch[1] : 'Unknown task'
    };
  });

  return {
    bot: bot.id,
    role: bot.role,
    summary: bot.summary,
    detailedSkills: bot.skills,
    currentTasks: currentTasks,
    collaborationPartners: BOTS.filter(b => b.id !== bot.id).slice(0, 3).map(b => b.id),
    memoryStats: {
      fileExists: fs.existsSync(memoryFile),
      fileSize: fs.existsSync(memoryFile) ? fs.statSync(memoryFile).size : 0,
      lastModified: fs.existsSync(memoryFile) ? fs.statSync(memoryFile).mtime.toISOString() : null
    },
    routingRules: {
      priority: bot.priorityKeywords,
      exclude: bot.excludeKeywords,
      fallback: 'zhongguan'
    },
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate layer index
 */
function generateIndex() {
  const index = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalBots: BOTS.length,
    activeBots: BOTS.filter(b => b.status === 'active').length,
    layers: {
      L0: {
        description: 'Bot summaries for fast filtering',
        avgSize: '~350 bytes per bot',
        totalSize: '~3.5KB',
        files: BOTS.map(b => `bot-${b.id}.l0.json`)
      },
      L1: {
        description: 'Memory overview for deep evaluation',
        avgSize: '~800 bytes per bot',
        totalSize: '~8.1KB',
        files: BOTS.map(b => `bot-${b.id}.l1.json`)
      },
      L2: {
        description: 'Full memory files on-demand loading',
        avgSize: '~1KB per bot',
        totalSize: '~10.5KB',
        files: BOTS.map(b => `bot-${b.id}.md`)
      }
    }
  };

  return index;
}

/**
 * Generate bot matrix JSON config
 */
function generateBotMatrix() {
  return {
    version: '1.0.0',
    mode: 'single-instance-roleplay',
    entryBot: 'zhongguan',
    entryHandle: '@Zhongguanzhabot',
    bots: BOTS.map(bot => ({
      id: bot.id,
      role: bot.role,
      handle: bot.handle,
      tokenId: bot.tokenId,
      status: bot.status,
      memoryFile: `memory/bot-${bot.id}.md`,
      l0File: `memory/layers/bot-${bot.id}.l0.json`,
      l1File: `memory/layers/bot-${bot.id}.l1.json`
    })),
    routing: {
      strategy: 'keyword-matching',
      fallback: 'zhongguan',
      minScore: 0.3
    },
    memory: {
      shared: 'MEMORY.md',
      independent: 'memory/bot-*.md',
      daily: 'memory/YYYY-MM-DD.md',
      layers: 'memory/layers/'
    }
  };
}

/**
 * Generate routing rules config
 */
function generateRoutingRules() {
  const rules = {};
  BOTS.forEach(bot => {
    rules[bot.id] = {
      priority: bot.priorityKeywords,
      exclude: bot.excludeKeywords,
      allKeywords: bot.keywords,
      fallback: bot.id === 'zhongguan' ? null : 'zhongguan'
    };
  });

  return {
    version: '1.0.0',
    strategy: 'keyword-matching-with-scoring',
    rules: rules,
    defaultBot: 'zhongguan'
  };
}

/**
 * Main setup function
 */
async function setup() {
  console.log('🤖 Bot Collective Setup\n');
  console.log('='.repeat(50));

  // Ensure directories exist
  if (!fs.existsSync(LAYERS_DIR)) {
    fs.mkdirSync(LAYERS_DIR, { recursive: true });
    console.log('✅ Created layers directory');
  }

  // Generate L0 layers
  console.log('\n📝 Generating L0 layers...');
  BOTS.forEach(bot => {
    const l0Data = generateL0(bot);
    const l0File = path.join(LAYERS_DIR, `bot-${bot.id}.l0.json`);
    fs.writeFileSync(l0File, JSON.stringify(l0Data, null, 2), 'utf8');
    console.log(`  ✅ bot-${bot.id}.l0.json`);
  });

  // Generate L1 layers
  console.log('\n📝 Generating L1 layers...');
  BOTS.forEach(bot => {
    const l0Data = generateL0(bot);
    const l1Data = generateL1(bot, l0Data);
    const l1File = path.join(LAYERS_DIR, `bot-${bot.id}.l1.json`);
    fs.writeFileSync(l1File, JSON.stringify(l1Data, null, 2), 'utf8');
    console.log(`  ✅ bot-${bot.id}.l1.json`);
  });

  // Generate index
  console.log('\n📝 Generating layer index...');
  const index = generateIndex();
  const indexFile = path.join(LAYERS_DIR, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), 'utf8');
  console.log('  ✅ index.json');

  // Generate configs
  console.log('\n⚙️  Generating configurations...');
  
  const botMatrix = generateBotMatrix();
  const botMatrixFile = path.join(SKILL_DIR, 'config/bot-matrix.json');
  fs.writeFileSync(botMatrixFile, JSON.stringify(botMatrix, null, 2), 'utf8');
  console.log('  ✅ config/bot-matrix.json');

  const routingRules = generateRoutingRules();
  const routingRulesFile = path.join(SKILL_DIR, 'config/routing-rules.json');
  fs.writeFileSync(routingRulesFile, JSON.stringify(routingRules, null, 2), 'utf8');
  console.log('  ✅ config/routing-rules.json');

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Setup Complete!\n');
  console.log(`Total Bots: ${BOTS.length}`);
  console.log(`Active Bots: ${BOTS.filter(b => b.status === 'active').length}`);
  console.log(`Pending Bots: ${BOTS.filter(b => b.status === 'pending').length}`);
  console.log('\nGenerated Files:');
  console.log(`  - ${BOTS.length} L0 layer files`);
  console.log(`  - ${BOTS.length} L1 layer files`);
  console.log(`  - 1 index file`);
  console.log(`  - 2 config files`);
  console.log('\nNext Steps:');
  console.log('  1. Review generated configs in config/');
  console.log('  2. Update MEMORY.md with your Telegram bot tokens');
  console.log('  3. Pair your Telegram bots via /start command');
  console.log('  4. Test role switching with sample queries');
  console.log('');
}

// Run setup
setup().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
