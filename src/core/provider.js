import * as monitorState from "./state";
import { createLogger } from "../utils/logger";
// 只解构 monitorState 的导出
const { clearDingtalkWebhookRateLimitStateForTest, getDingtalkWebhookRateLimitStateSizeForTest, isWebhookRateLimitedForTest, stopDingtalkMonitorState, } = monitorState;
export { clearDingtalkWebhookRateLimitStateForTest, getDingtalkWebhookRateLimitStateSizeForTest, isWebhookRateLimitedForTest, } from "./state";
export async function monitorDingtalkProvider(opts = {}) {
    const cfg = opts.config;
    if (!cfg) {
        throw new Error("Config is required for DingTalk monitor");
    }
    const log = createLogger(cfg.channels?.["dingtalk-connector"]?.debug ?? false);
    // 并行导入所有模块（无循环依赖，可以并行）
    const [accountsModule, monitorAccountModule, monitorSingleModule] = await Promise.all([
        import("../config/accounts"),
        import("./message-handler"),
        import("./connection"),
    ]);
    const { resolveDingtalkAccount, listEnabledDingtalkAccounts } = accountsModule;
    const { handleDingTalkMessage } = monitorAccountModule;
    const { monitorSingleAccount, resolveReactionSyntheticEvent } = monitorSingleModule;
    if (opts.accountId) {
        const account = resolveDingtalkAccount({ cfg, accountId: opts.accountId });
        if (!account.enabled || !account.configured) {
            throw new Error(`DingTalk account "${opts.accountId}" not configured or disabled`);
        }
        return monitorSingleAccount({
            cfg,
            account,
            runtime: opts.runtime,
            abortSignal: opts.abortSignal,
            messageHandler: handleDingTalkMessage,
            onStatusChange: opts.onStatusChange,
        });
    }
    const accounts = listEnabledDingtalkAccounts(cfg);
    if (accounts.length === 0) {
        throw new Error("No enabled DingTalk accounts configured");
    }
    log?.info?.(`dingtalk-connector: starting ${accounts.length} account(s): ${accounts.map((a) => a.accountId).join(", ")}`);
    const monitorPromises = [];
    for (const account of accounts) {
        if (opts.abortSignal?.aborted) {
            log?.info?.("dingtalk-connector: abort signal received during startup preflight; stopping startup");
            break;
        }
        monitorPromises.push(monitorSingleAccount({
            cfg,
            account,
            runtime: opts.runtime,
            abortSignal: opts.abortSignal,
            messageHandler: handleDingTalkMessage,
            onStatusChange: opts.onStatusChange,
        }));
    }
    await Promise.all(monitorPromises);
}
export function stopDingtalkMonitor(accountId) {
    stopDingtalkMonitorState(accountId);
}
