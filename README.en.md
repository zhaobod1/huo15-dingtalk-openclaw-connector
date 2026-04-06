<div align="center">
  <img src="https://tools.huo15.com/uploads/images/system/logo-colours.png" alt="huo15" width="120" />
</div>

<div align="center">

**Breaking Information Silos. Driving Enterprise Growth with One System.**
**Accelerating Enterprise Users' Transition to Full-Scenario AI Robots.**

</div>

<div align="center">

| 🏫 Institution | 👨‍🏫 Instructor | 📧 Contact | 💬 QQ Group | 📺 Video |
|:-----------:|:--------:|:------------------:|:-----------:|:-----------------------------------:|
| Yixunzhiku | Job | support@huo15.com | 1093992108 | [📺 Bilibili](https://space.bilibili.com/400418085) |

</div>

---

<div align="center">

# 🔔 @huo15/dingtalk-openclaw-connector

**的火一五定制版钉钉 OpenClaw 连接器 | Huo15 Customized DingTalk Connector for OpenClaw**

> **Author**: 青岛火一五信息科技有限公司 (Huo15 Information Technology)
> **Version**: v1.0.0
> **Based on**: [dingtalk-openclaw-connector](https://github.com/DingTalk-Real-AI/dingtalk-openclaw-connector) v0.8.12
> **npm**: [@huo15/dingtalk-openclaw-connector](https://www.npmjs.com/package/@huo15/dingtalk-openclaw-connector)
> **Trigger**: 钉钉、钉钉连接器、dingtalk

---

</div>

## 一、Introduction | 简介

火一五定制版钉钉 OpenClaw 连接器，基于官方 dingtalk-openclaw-connector v0.8.12 定制，支持 huo15-memory-evolution 记忆系统集成和 Claude Code 能力增强。

Huo15 customized DingTalk connector for OpenClaw, based on official dingtalk-openclaw-connector v0.8.12, with huo15-memory-evolution integration and Claude Code capability enhancements.

---

## 二、Core Features | 核心特性

| Feature | Description |
|---------|-------------|
| 🤖 **Memory System** | huo15-memory-evolution integration |
| 💬 **AI Card Streaming** | Typewriter effect with real-time streaming |
| 🔒 **Session Persistence** | Multi-turn context preservation |
| 🎯 **Session Isolation** | Separate sessions for DMs / groups |
| ⏰ **Auto Session Reset** | 30 min inactivity timeout |
| 📁 **Rich Media** | JPEG/PNG image + file attachments |
| 🎵 **Audio Messages** | mp3, wav, amr, ogg support |
| 📄 **DingTalk Docs API** | Create, append, search, list docs |
| 🔗 **Multi-Agent Routing** | Multiple bots → multiple agents |

---

## 三、Quick Start | 快速开始

### 3.1 Prerequisites

- OpenClaw Gateway installed and running
- DingTalk enterprise account

### 3.2 Install

```bash
# Clone the fork
git clone https://github.com/zhaobod1/huo15-dingtalk-openclaw-connector.git
cd huo15-dingtalk-openclaw-connector

# Install dependencies
npm install

# Link mode (dev-friendly, changes take effect immediately)
openclaw plugins install -l .
```

### 3.3 Configure

1. Get DingTalk credentials at [DingTalk Open Platform](https://open-dev.dingtalk.com/)
   - Create an internal app → get **AppKey** and **AppSecret**

2. Edit `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "dingtalk-connector": {
      "enabled": true,
      "clientId": "yourAppKey",
      "clientSecret": "yourAppSecret"
    }
  }
}
```

### 3.4 Restart & Verify

```bash
openclaw gateway restart
openclaw plugins list
openclaw logs --follow
```

---

## 四、Features | 功能列表

### 4.1 Basic Features

- **AI Card Streaming** — Real-time typewriter replies
- **Session Management** — Multi-turn context
- **Session Isolation** — DMs / groups / group_sender per user
- **Auto Session Reset** — `/new` or 30 min inactivity
- **Image Auto-Upload** — Local images → DingTalk CDN
- **Rich Media Reception** — JPEG/PNG → vision models
- **File Attachments** — .docx, .pdf, text, binary
- **Audio Messages** — mp3, wav, amr, ogg
- **DingTalk Docs API** — Create, append, search, list
- **Multi-Agent Routing** — Multiple bots → multiple agents
- **Markdown Tables** — Auto-convert to DingTalk format

---

## 五、Development Roadmap | 开发计划

### 5.1 Huo15 Memory Evolution Integration

- [ ] Integrate huo15-memory-evolution
- [ ] Session memory persistence
- [ ] user / feedback / project / reference memory types
- [ ] Auto Capture for highlights
- [ ] Dream Agent daily log summarization

### 5.2 Claude Code Capability Integration

- [ ] findRelevantMemories smart retrieval
- [ ] CLAUDE.md project-level injection
- [ ] Manifest pre-inject
- [ ] Forked extraction
- [ ] Before recommending rules

---

## 六、Comparison with Official | 与官方版对比

| Feature | Official | Huo15 Custom |
|---------|----------|-------------|
| Basic features | ✅ | ✅ |
| Memory system integration | ❌ | ✅ huo15-memory-evolution |
| Claude Code capability | ❌ | ✅ WIP |
| AI Card streaming | ✅ | ✅ |
| Multi-agent routing | ✅ | ✅ |

---

## 七、Project Structure | 项目结构

```
huo15-dingtalk-openclaw-connector/
├── src/
│   ├── core/           # Core connector logic
│   ├── services/       # DingTalk API services
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
├── docs/
│   └── images/         # Documentation images
├── openclaw.plugin.json # Plugin manifest
├── package.json         # npm dependencies
└── LICENSE
```

---

## 八、Related Links | 相关链接

- **Official**: https://github.com/DingTalk-Real-AI/dingtalk-openclaw-connector
- **Fork**: https://github.com/zhaobod1/huo15-dingtalk-openclaw-connector
- **OpenClaw**: https://openclaw.ai
- **Huo15 Memory**: https://clawhub.ai/jobzhao15/huo15-memory-evolution
- **DingTalk Platform**: https://open-dev.dingtalk.com/

---

<div align="center">

**Company**: 青岛火一五信息科技有限公司 (Huo15 Information Technology)
**Email**: postmaster@huo15.com | **QQ**: 1093992108

---

**Follow Yixunzhiku for more updates**

<img src="https://tools.huo15.com/uploads/images/system/qrcode_yxzk.jpg" alt="Yixunzhiku QRCode" width="200" />

</div>
