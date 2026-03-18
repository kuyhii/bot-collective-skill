# 🔐 SSH 密钥自动推送设置

## ✅ 已完成

SSH 密钥已生成：
```
~/.ssh/id_ed25519 (私钥)
~/.ssh/id_ed25519.pub (公钥)
```

**公钥内容：**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAQbcsVXokButDCrJkVw03A5d7gfN9/9sZwrlW8c6rSy github-bot-collective
```

## 📝 下一步：添加 SSH 密钥到 GitHub

**1. 复制上面的公钥**（整行，以 ssh-ed25519 开头）

**2. 访问 GitHub SSH 设置：**
```
https://github.com/settings/keys
```

**3. 点击 "New SSH key"**

**4. 填写：**
- **Title**: `bot-collective-skill-push`
- **Key type**: ✅ Authentication Key
- **Key**: 粘贴上面的公钥

**5. 点击 "Add SSH key"**

## 🚀 添加完成后，运行自动推送

```bash
cd /root/.openclaw/workspace/skills/bot-collective && ./ssh-push.sh
```

或者手动命令：
```bash
cd /root/.openclaw/workspace/skills/bot-collective
git remote set-url origin git@github.com:kuyhii/bot-collective-skill.git
git push -u origin main
```

---

**添加完 SSH 密钥后告诉我，我会自动完成推送！**
