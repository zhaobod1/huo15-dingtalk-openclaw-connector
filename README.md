# 🔔 huo15-dingtalk-connector-pro

> **作者**: 火一五信息科技有限公司
> **版本**: v1.0.0
> **参考**: [dingtalk-openclaw-connector](https://github.com/DingTalk-Real-AI/dingtalk-openclaw-connector) v0.8.12
> **触发词**: 钉钉、钉钉连接器、dingtalk

---

## 一、简介

火一五定制版钉钉 OpenClaw 连接器，基于官方 dingtalk-openclaw-connector v0.8.12 定制，支持 huo15-memory-evolution 记忆系统集成。

### 核心特性

| 特性 | 说明 |
|------|------|
| 🤖 **记忆系统集成** | 支持 huo15-memory-evolution 记忆系统 |
| 💬 **AI Card 流式响应** | 打字机效果，实时流式显示回复 |
| 🔒 **会话持久化** | 同一用户的多轮对话共享上下文 |
| 🎯 **会话隔离** | 按单聊/群聊/群区分 session |
| ⏰ **超时自动新会话** | 默认 30 分钟无活动自动开启新对话 |
| 📁 **富媒体接收** | 支持 JPEG/PNG 图片、文件附件 |
| 🎵 **音频消息** | 支持发送多种格式音频 |
| 📄 **钉钉文档 API** | 支持创建、追加、搜索钉钉文档 |
| 🔗 **多 Agent 路由** | 支持一个连接器实例连接多个 Agent |

---

## 二、快速开始

### 2.1 前置要求

- OpenClaw 已安装并运行
- 钉钉企业账号

### 2.2 安装

```bash
# 克隆仓库
git clone https://github.com/huo15/huo15-dingtalk-connector-pro.git
cd huo15-dingtalk-connector-pro

# 安装依赖
npm install

# 以链接模式安装
openclaw plugins install -l .
```

### 2.3 配置

1. 获取钉钉凭证
   - 访问 [钉钉开放平台](https://open-dev.dingtalk.com/)
   - 创建企业内部应用
   - 获取 AppKey 和 AppSecret

2. 配置连接器

```bash
# 方式一：使用配置向导
openclaw channels add

# 方式二：直接编辑配置文件
# macOS: ~/.openclaw/openclaw.json
# Windows: C:\Users\<用户名>\.openclaw\openclaw.json
```

```json
{
  "channels": {
    "huo15-dingtalk-connector-pro": {
      "enabled": true,
      "clientId": "你的AppKey",
      "clientSecret": "你的AppSecret"
    }
  }
}
```

### 2.4 重启验证

```bash
# 重启 Gateway
openclaw gateway restart

# 检查插件状态
openclaw plugins list

# 查看日志
openclaw logs --follow
```

---

## 三、与官方版区别

| 功能 | 官方版 | 定制版 |
|------|--------|--------|
| 基础功能 | ✅ | ✅ |
| 记忆系统集成 | ❌ | ✅ huo15-memory-evolution |
| AI Card 流式响应 | ✅ | ✅ |
| 多 Agent 路由 | ✅ | ✅ |

---

## 四、配置说明

### 4.1 基础配置

```json
{
  "channels": {
    "huo15-dingtalk-connector-pro": {
      "enabled": true,
      "clientId": "dingxxxxxxxxx",
      "clientSecret": "your_app_secret"
    }
  }
}
```

### 4.2 高级配置

| 参数 | 说明 | 默认值 |
|------|------|---------|
| `enabled` | 是否启用 | `true` |
| `clientId` | AppKey | - |
| `clientSecret` | AppSecret | - |
| `sessionTimeout` | 会话超时时间（分钟） | `30` |

---

## 五、版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| **v1.0.0** | 2026-04-05 | 初始定制版本，基于官方 v0.8.12 |

---

## 六、相关链接

- **官方版**: https://github.com/DingTalk-Real-AI/dingtalk-openclaw-connector
- **OpenClaw**: https://openclaw.ai
- **火一五记忆系统**: https://clawhub.ai/jobzhao15/huo15-memory-evolution
- **钉钉开放平台**: https://open-dev.dingtalk.com/

---

*火一五信息科技有限公司出品*
