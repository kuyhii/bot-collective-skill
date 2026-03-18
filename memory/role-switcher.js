/**
 * 角色切换器 - 单 Bot 入口 + 多 Agent 协作
 * 
 * 功能：根据用户消息识别目标 Bot 角色，加载对应上下文
 * 架构：Single Bot Entry + Multi-Agent Collaboration
 * 时间：2026-03-15 08:26 UTC
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = __dirname;
const LAYERS_DIR = path.join(MEMORY_DIR, 'layers');

class RoleSwitcher {
  constructor() {
    this.l0Cache = new Map();
    this.l1Cache = new Map();
    this.memoryCache = new Map();
  }

  /**
   * 识别消息对应的 Bot 角色
   * @param {string} message - 用户消息
   * @returns {string} - Bot 角色名
   */
  identifyRole(message) {
    const query = message.toLowerCase();
    const l0Files = this.getL0Files();
    
    let bestMatch = null;
    let bestScore = 0;

    for (const file of l0Files) {
      const bot = this.loadL0(file);
      const score = this.calculateMatchScore(query, bot);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = bot.bot;
      }
    }

    // 如果分数太低，默认返回 zhongguan (兜底 Bot)
    if (bestScore > 0.3) {
      return bestMatch;
    }
    
    // 检查是否有 Bot 标记为默认 Bot
    const allFiles = this.getL0Files();
    for (const file of allFiles) {
      const bot = this.loadL0(file);
      if (bot.isDefault) {
        return bot.bot;
      }
    }
    
    return 'zhongguan';
  }

  /**
   * 加载 Bot 完整上下文
   * @param {string} role - Bot 角色名
   * @returns {object} - Bot 上下文
   */
  loadBotContext(role) {
    const l0 = this.loadL0(`bot-${role}.l0.json`);
    const l1 = this.loadL1(`bot-${role}.l1.json`);
    const memory = this.loadMemory(`bot-${role}.md`);

    return {
      role,
      l0,
      l1,
      memory,
      identity: `${l0.role} - ${l0.summary}`
    };
  }

  /**
   * 构建 System Prompt
   * @param {object} bot - Bot 上下文
   * @returns {string} - System Prompt
   */
  buildSystemPrompt(bot) {
    const tasks = bot.l0.currentTasks || [];
    const skills = bot.l0.keySkills || [];
    
    const prompt = `你是${bot.l0.role}，职责：${bot.l0.summary}

## 当前任务
${tasks.map(t => `- [${t.status}] ${t.desc}`).join('\n') || '暂无特定任务'}

## 核心技能
${skills.join('、')}

## 工作记忆
${bot.memory ? bot.memory.substring(0, 1500) + '...' : '暂无历史记录'}

---

请以${bot.role}的专业身份回复用户，保持语气符合角色定位。`;

    return prompt;
  }

  /**
   * 记录工作日志
   * @param {string} role - Bot 角色名
   * @param {object} work - 工作内容
   */
  logWork(role, work) {
    const memoryFile = path.join(MEMORY_DIR, `bot-${role}.md`);
    const timestamp = new Date().toISOString();
    
    const entry = `
## ${timestamp}

**用户查询**: ${work.query?.substring(0, 100) || 'N/A'}

**工作内容**: 
${work.summary || work.response?.substring(0, 300) || 'N/A'}

${work.details ? `\n**详情**:\n${work.details}\n` : ''}
---
`;

    fs.appendFileSync(memoryFile, entry, 'utf8');
  }

  // ========== 内部方法 ==========

  getL0Files() {
    const index = JSON.parse(fs.readFileSync(path.join(LAYERS_DIR, 'index.json'), 'utf8'));
    return index.layers.L0.files;
  }

  loadL0(filename) {
    if (this.l0Cache.has(filename)) {
      return this.l0Cache.get(filename);
    }

    const filepath = path.join(LAYERS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return null;
    }

    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    this.l0Cache.set(filename, data);
    return data;
  }

  loadL1(filename) {
    if (this.l1Cache.has(filename)) {
      return this.l1Cache.get(filename);
    }

    const filepath = path.join(LAYERS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return null;
    }

    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    this.l1Cache.set(filename, data);
    return data;
  }

  loadMemory(filename) {
    if (this.memoryCache.has(filename)) {
      return this.memoryCache.get(filename);
    }

    const filepath = path.join(MEMORY_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return '';
    }

    const data = fs.readFileSync(filepath, 'utf8');
    this.memoryCache.set(filename, data);
    return data;
  }

  calculateMatchScore(query, bot) {
    let score = 0;

    // 1. 排除词检查 (如果有排除词匹配，直接返回 0)
    if (bot.excludeKeywords && bot.excludeKeywords.length > 0) {
      const hasExclude = bot.excludeKeywords.some(kw => 
        query.includes(kw.toLowerCase())
      );
      if (hasExclude) {
        return 0; // 排除此 Bot
      }
    }

    // 2. 角色匹配 (高权重)
    if (bot.role?.toLowerCase().includes(query)) score += 0.6;

    // 3. 别名匹配
    if (bot.aliases) {
      const aliasMatch = bot.aliases.some(alias => 
        alias.toLowerCase().includes(query) || query.includes(alias.toLowerCase())
      );
      if (aliasMatch) score += 0.5;

      const keywords = query.split(/[\s,]+/).filter(k => k.length > 0);
      keywords.forEach(kw => {
        if (bot.aliases.some(alias => alias.toLowerCase().includes(kw))) {
          score += 0.2;
        }
      });
    }

    // 4. 优先关键词匹配
    if (bot.priorityKeywords) {
      const priorityMatch = bot.priorityKeywords.some(kw => 
        query.includes(kw.toLowerCase()) || kw.toLowerCase().includes(query)
      );
      if (priorityMatch) score += 0.8;
    }

    // 5. 关键词拆分匹配
    const keywords = query.split(/[\s,]+/).filter(k => k.length > 0);
    keywords.forEach(kw => {
      if (bot.role?.toLowerCase().includes(kw)) score += 0.2;
      if (bot.summary?.toLowerCase().includes(kw)) score += 0.3;
      if (bot.keySkills?.some(s => s.toLowerCase().includes(kw))) score += 0.2;
      if (bot.currentTasks?.some(t => t.desc.toLowerCase().includes(kw))) score += 0.1;
    });

    // 6. 完全匹配
    if (bot.summary?.toLowerCase().includes(query)) score += 0.3;
    if (bot.keySkills?.some(s => s.toLowerCase().includes(query))) score += 0.2;

    return Math.min(score, 10.0); // 限制最高分
  }

  /**
   * 清除缓存（用于热更新）
   */
  clearCache() {
    this.l0Cache.clear();
    this.l1Cache.clear();
    this.memoryCache.clear();
  }
}

// ========== 测试函数 ==========

function runTests() {
  const switcher = new RoleSwitcher();
  
  const testCases = [
    { query: '帮我写代码', expected: 'daima' },
    { query: '审计安全', expected: 'anquan' },
    { query: '数据分析', expected: 'yunyin' },
    { query: '设置提醒', expected: 'tixing' },
    { query: '搜索知识', expected: 'zhisguan' },
    { query: '文件转换', expected: 'wenjian' },
    { query: '协调任务', expected: 'zhongguan' }
  ];

  console.log('🧪 角色识别测试\n');
  console.log('='.repeat(50));

  let passed = 0;
  for (const test of testCases) {
    const role = switcher.identifyRole(test.query);
    const status = role === test.expected ? '✅' : '⚠️';
    
    if (role === test.expected) passed++;
    
    console.log(`${status} "${test.query}" → ${role} (期望：${test.expected})`);
  }

  console.log('='.repeat(50));
  console.log(`结果：${passed}/${testCases.length} 通过\n`);

  return passed === testCases.length;
}

// ========== 导出 ==========

module.exports = { RoleSwitcher, runTests };

// 如果直接运行，执行测试
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}
