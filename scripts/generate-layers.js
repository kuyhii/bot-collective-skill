#!/usr/bin/env node

/**
 * Layer Generator Script
 * 
 * Regenerates L0/L1 layers from existing bot memory files.
 * Run this after updating bot memory files to keep layers in sync.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.HOME + '/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const LAYERS_DIR = path.join(MEMORY_DIR, 'layers');

// Bot ID mapping
const BOT_IDS = [
  'zhongguan', 'daima', 'yunyin', 'anquan', 
  'tixing', 'zhisguan', 'wenjian', 'zidonghua', 
  'loudongku', 'falvhegui'
];

// Bot metadata (should match SKILL.md)
const BOT_METADATA = {
  zhongguan: {
    role: '总管/协调者',
    handle: '@Zhongguanzhabot',
    tokenId: '8684783881',
    status: 'active',
    summary: '任务路由、汇总汇报、系统协调',
    skills: ['会话管理', '任务分发', '记忆维护', '系统监控'],
    priorityKeywords: ['总管', '协调', '管理', '路由'],
    excludeKeywords: ['代码', '安全', '运营', '提醒', '知识', '文件']
  },
  daima: {
    role: '代码专家',
    handle: '@Daimazujbot',
    tokenId: '8745777039',
    status: 'active',
    summary: 'GitHub 操作、代码审查、MCP 测试',
    skills: ['GitHub', 'Code Review', 'MCP', '技能审查'],
    priorityKeywords: ['代码', 'GitHub', 'PR', 'issue'],
    excludeKeywords: ['安全', '运营', '提醒', '法律']
  },
  yunyin: {
    role: '运营专家',
    handle: '@Yunyinhjibot',
    tokenId: '8602144010',
    status: 'active',
    summary: '数据分析、报告生成、内容管理',
    skills: ['数据分析', '内容管理', '用户运营', '报告生成'],
    priorityKeywords: ['运营', '数据', '分析'],
    excludeKeywords: ['代码', '安全', '法律']
  },
  anquan: {
    role: '安全审计师',
    handle: '@Anquansjbot',
    tokenId: '8734523568',
    status: 'active',
    summary: '安全审查、风险评估、技能审查',
    skills: ['安全审计', '技能审查', '漏洞扫描', '风险评估'],
    priorityKeywords: ['安全', '审计', '风险'],
    excludeKeywords: ['代码', '运营', '提醒']
  },
  tixing: {
    role: '提醒助手',
    handle: '@Tixingtongzbot',
    tokenId: '8224484616',
    status: 'active',
    summary: '定时任务、进度督促、告警通知',
    skills: ['定时任务', '提醒通知', '进度督促', '心跳检查'],
    priorityKeywords: ['提醒', '定时', '闹钟'],
    excludeKeywords: ['代码', '安全', '法律']
  },
  zhisguan: {
    role: '知识管家',
    handle: '@Zhisguanlbot',
    tokenId: '8769173565',
    status: 'active',
    summary: '知识检索、文档管理、问答支持',
    skills: ['知识检索', '文档管理', '语义搜索', '问答'],
    priorityKeywords: ['知识', '搜索', '检索'],
    excludeKeywords: ['代码', '安全', '文件']
  },
  wenjian: {
    role: '文件专家',
    handle: '@Wenjianclibot',
    tokenId: '8724865823',
    status: 'active',
    summary: '文件处理、格式转换、文档解析',
    skills: ['文件管理', '格式转换', '文档解析', '媒体处理'],
    priorityKeywords: ['文件', '转换', '格式'],
    excludeKeywords: ['代码', '安全', '知识']
  },
  zidonghua: {
    role: '自动化专家',
    handle: '@Zidonghuabot',
    tokenId: 'TBD',
    status: 'pending',
    summary: '工作流自动化、Cron 任务配置、脚本执行',
    skills: ['自动化', 'Cron', '工作流', '脚本'],
    priorityKeywords: ['自动化', '工作流', 'Cron'],
    excludeKeywords: ['代码', '安全']
  },
  loudongku: {
    role: '漏洞扫描师',
    handle: '@Loudongkubot',
    tokenId: 'TBD',
    status: 'pending',
    summary: '漏洞检测、安全扫描、CVE 查询',
    skills: ['漏洞扫描', '渗透测试', 'CVE 查询', '安全报告'],
    priorityKeywords: ['漏洞', '扫描', 'CVE'],
    excludeKeywords: ['代码', '运营']
  },
  falvhegui: {
    role: '法律合规官',
    handle: '@Falvheguibot',
    tokenId: 'TBD',
    status: 'pending',
    summary: '合同审查、合规检查、法律咨询',
    skills: ['合同审查', '合规检查', '法律查询', '风险提示'],
    priorityKeywords: ['法律', '合同', '合规'],
    excludeKeywords: ['代码', '运营', '安全']
  }
};

/**
 * Parse memory file to extract current tasks
 */
function extractTasks(memoryContent) {
  const tasks = [];
  
  // Try to find task sections
  const taskRegex = /### (T\d+: [^\n]+)\n\n\*\*状态\*\*: ([^\n]+)/g;
  let match;
  
  while ((match = taskRegex.exec(memoryContent)) !== null) {
    tasks.push({
      id: match[1],
      status: match[2].trim(),
      desc: match[1]
    });
  }
  
  return tasks.slice(0, 5); // Limit to 5 tasks
}

/**
 * Extract collaboration partners from memory
 */
function extractCollaborators(memoryContent, currentBot) {
  const collaborators = new Set();
  
  // Look for @mentions of other bots
  const mentionRegex = /@(Zhongguanzhabot|Daimazujbot|Yunyinhjibot|Anquansjbot|Tixingtongzbot|Zhisguanlbot|Wenjianclibot|Zidonghuabot|Loudongkubot|Falvheguibot)/g;
  let match;
  
  while ((match = mentionRegex.exec(memoryContent)) !== null) {
    const handle = match[1];
    const botId = handle.toLowerCase().replace('bot', '').replace('zhongguan', 'zhongguan').replace('daima', 'daima').replace('yunyin', 'yunyin').replace('anquan', 'anquan').replace('tixing', 'tixing').replace('zhisguan', 'zhisguan').replace('wenjian', 'wenjian').replace('zidonghua', 'zidonghua').replace('loudongku', 'loudongku').replace('falvhegui', 'falvhegui');
    
    if (botId !== currentBot) {
      collaborators.add(botId);
    }
  }
  
  return Array.from(collaborators).slice(0, 5);
}

/**
 * Generate L0 layer for a bot
 */
function generateL0(botId) {
  const meta = BOT_METADATA[botId];
  
  return {
    bot: botId,
    role: meta.role,
    handle: meta.handle,
    tokenId: meta.tokenId,
    status: meta.status,
    summary: meta.summary,
    keySkills: meta.skills,
    priorityKeywords: meta.priorityKeywords,
    excludeKeywords: meta.excludeKeywords,
    aliases: meta.priorityKeywords.concat(meta.skills),
    isDefault: botId === 'zhongguan',
    currentTasks: [],
    lastActive: new Date().toISOString()
  };
}

/**
 * Generate L1 layer for a bot
 */
function generateL1(botId) {
  const meta = BOT_METADATA[botId];
  const memoryFile = path.join(MEMORY_DIR, `bot-${botId}.md`);
  
  let memoryContent = '';
  if (fs.existsSync(memoryFile)) {
    memoryContent = fs.readFileSync(memoryFile, 'utf8');
  }
  
  const tasks = extractTasks(memoryContent);
  const collaborators = extractCollaborators(memoryContent, botId);
  
  return {
    bot: botId,
    role: meta.role,
    summary: meta.summary,
    detailedSkills: meta.skills,
    currentTasks: tasks,
    collaborationPartners: collaborators.length > 0 ? collaborators : 
      BOT_IDS.filter(id => id !== botId).slice(0, 3),
    memoryStats: {
      fileExists: fs.existsSync(memoryFile),
      fileSize: fs.existsSync(memoryFile) ? fs.statSync(memoryFile).size : 0,
      lastModified: fs.existsSync(memoryFile) ? fs.statSync(memoryFile).mtime.toISOString() : null,
      lastActive: new Date().toISOString()
    },
    routingRules: {
      priority: meta.priorityKeywords,
      exclude: meta.excludeKeywords,
      fallback: 'zhongguan'
    },
    generatedAt: new Date().toISOString()
  };
}

/**
 * Regenerate all layers
 */
function regenerateLayers() {
  console.log('🔄 Regenerating L0/L1 Layers\n');
  console.log('='.repeat(50));
  
  // Ensure layers directory exists
  if (!fs.existsSync(LAYERS_DIR)) {
    fs.mkdirSync(LAYERS_DIR, { recursive: true });
    console.log('✅ Created layers directory\n');
  }
  
  let l0Total = 0;
  let l1Total = 0;
  
  // Generate L0 and L1 for each bot
  BOT_IDS.forEach(botId => {
    const meta = BOT_METADATA[botId];
    
    // L0
    const l0Data = generateL0(botId);
    const l0File = path.join(LAYERS_DIR, `bot-${botId}.l0.json`);
    fs.writeFileSync(l0File, JSON.stringify(l0Data, null, 2), 'utf8');
    l0Total += JSON.stringify(l0Data).length;
    
    // L1
    const l1Data = generateL1(botId);
    const l1File = path.join(LAYERS_DIR, `bot-${botId}.l1.json`);
    fs.writeFileSync(l1File, JSON.stringify(l1Data, null, 2), 'utf8');
    l1Total += JSON.stringify(l1Data).length;
    
    const status = meta.status === 'active' ? '🟢' : '⏳';
    console.log(`${status} ${botId.padEnd(12)} - ${meta.role}`);
  });
  
  // Generate index
  const index = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalBots: BOT_IDS.length,
    activeBots: BOT_IDS.filter(id => BOT_METADATA[id].status === 'active').length,
    layers: {
      L0: {
        description: 'Bot summaries for fast filtering',
        totalSize: `${(l0Total / 1024).toFixed(1)}KB`,
        files: BOT_IDS.map(id => `bot-${id}.l0.json`)
      },
      L1: {
        description: 'Memory overview for deep evaluation',
        totalSize: `${(l1Total / 1024).toFixed(1)}KB`,
        files: BOT_IDS.map(id => `bot-${id}.l1.json`)
      },
      L2: {
        description: 'Full memory files on-demand loading',
        files: BOT_IDS.map(id => `bot-${id}.md`)
      }
    }
  };
  
  const indexFile = path.join(LAYERS_DIR, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), 'utf8');
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Layer Regeneration Complete!\n');
  console.log(`Generated: ${BOT_IDS.length * 2} layer files`);
  console.log(`L0 Total: ${(l0Total / 1024).toFixed(1)}KB`);
  console.log(`L1 Total: ${(l1Total / 1024).toFixed(1)}KB`);
  console.log(`Index: index.json`);
  console.log('\nLayers are now synchronized with bot memory files.');
}

// Run regeneration
regenerateLayers().catch(err => {
  console.error('❌ Regeneration failed:', err.message);
  process.exit(1);
});
