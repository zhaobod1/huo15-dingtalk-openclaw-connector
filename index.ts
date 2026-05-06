/**
 * DingTalk Connector Plugin for OpenClaw
 *
 * 钉钉企业内部机器人插件，使用 Stream 模式连接，支持 AI Card 流式响应。
 * 已迁移到 OpenClaw SDK，支持多账号、安全策略等完整功能。
 * 
 * Last updated: 2026-03-24
 */

/**
 * DingTalk Connector Plugin for OpenClaw
 * 
 * 注意：本插件使用专用的 HTTP 客户端（见 src/utils/http-client.ts）
 * 不会影响 OpenClaw Gateway 和其他插件的网络请求
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { dingtalkPlugin } from "./src/channel.js";
import { setDingtalkRuntime } from "./src/runtime.js";
import { registerGatewayMethods } from "./src/gateway-methods.js";
import { sendMediaToDingTalk } from "./src/services/messaging/index.js";
import { resolveDingtalkAccount } from "./src/config/accounts.js";
import { createLogger } from "./src/utils/logger.js";
import fs from "fs";
import path from "path";

export default function register(api: OpenClawPluginApi) {
  setDingtalkRuntime(api.runtime);
  api.registerChannel({ plugin: dingtalkPlugin });
  
  // 注册 Gateway Methods
  registerGatewayMethods(api);

  // 注册发送文件工具（绕过 MEDIA: 标记限制）
  api.registerTool({
    id: "send_dingtalk_file",
    name: "send_dingtalk_file",
    description: "通过钉钉发送本地文件给当前会话用户。当 agent 生成文件后，使用此工具发送给用户。文件路径需为绝对路径。",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "文件的本地绝对路径，如 /Users/cuibiao/.openclaw/workspace/skills-all.docx"
        }
      },
      required: ["filePath"]
    },
    handler: async (params: any, ctx: any) => {
      const logger = createLogger(false, "DingTalk:SendFile");
      const filePath = params.filePath;
      
      if (!fs.existsSync(filePath)) {
        return { ok: false, error: `文件不存在: ${filePath}` };
      }

      const config = api.runtime.config;
      const channelCfg = config?.channels?.["dingtalk-connector"];
      if (!channelCfg?.clientId) {
        return { ok: false, error: "DingTalk 通道未配置" };
      }

      const dingtalkConfig = {
        clientId: channelCfg.clientId,
        clientSecret: channelCfg.clientSecret,
      };

      // 从上下文获取目标用户
      const sessionStore = ctx?.sessionStore || ctx?.session;
      let target = "523612186039813142"; // 默认
      
      try {
        if (ctx?.deliveryContext?.to) {
          target = ctx.deliveryContext.to;
        }
      } catch {}

      logger.info(`发送文件: ${filePath} -> ${target}`);
      
      const result = await sendMediaToDingTalk({
        config: dingtalkConfig as any,
        target,
        mediaUrl: filePath,
      });

      const basename = path.basename(filePath);
      if (result.ok) {
        logger.info(`文件发送成功: ${basename}`);
        return { ok: true, fileName: basename, message: `文件 ${basename} 已通过钉钉发送` };
      } else {
        logger.error(`文件发送失败: ${result.error}`);
        return { ok: false, error: result.error || "发送失败" };
      }
    }
  });
}
