# Release Notes - v0.8.3

## 🎉 新版本亮点 / Highlights

本次更新专注于"连接稳定性 + 消息处理优化"：改进了 WebSocket 连接的稳定性管理，优化了消息处理逻辑，提升了系统的可靠性和响应速度。

This release focuses on connection stability and message processing optimization. It improves WebSocket connection stability management, optimizes message handling logic, and enhances overall system reliability and responsiveness.

## ✨ 功能与体验改进 / Features & Improvements

- **连接稳定性改进 / Connection Stability Improvement**  
  优化 WebSocket 连接管理机制，增强长连接场景下的稳定性，减少异常断连情况。  
  Improved WebSocket connection management mechanism, enhanced stability in long-lived connection scenarios, and reduced abnormal disconnections.

- **消息处理逻辑优化 / Message Processing Logic Optimization**  
  重构消息处理流程，提升消息响应速度和处理可靠性，确保消息按序正确处理。  
  Refactored message processing flow to improve response speed and reliability, ensuring messages are processed correctly in order.

## 📥 安装升级 / Installation & Upgrade

```bash
# 通过 npm 安装最新版本 / Install latest version via npm
openclaw plugins install @dingtalk-real-ai/dingtalk-connector

# 或升级现有版本 / Or upgrade existing version
openclaw plugins update dingtalk-connector

# 通过 Git 安装 / Install via Git
openclaw plugins install https://github.com/DingTalk-Real-AI/dingtalk-openclaw-connector.git
```

## 🔗 相关链接 / Related Links

- [完整变更日志 / Full Changelog](https://github.com/DingTalk-Real-AI/dingtalk-openclaw-connector/blob/main/CHANGELOG.md)
- [使用文档 / Documentation](https://github.com/DingTalk-Real-AI/dingtalk-openclaw-connector/blob/main/README.md)

---

**发布日期 / Release Date**：2026-03-22  
**版本号 / Version**：v0.8.3  
**兼容性 / Compatibility**：OpenClaw Gateway 0.4.0+
