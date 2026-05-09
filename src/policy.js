import { resolveDingtalkAccount } from "./config/accounts.js";
export function resolveDingtalkGroupToolPolicy(params) {
    const { cfg, groupId, accountId } = params;
    const account = resolveDingtalkAccount({ cfg, accountId });
    const dingtalkCfg = account.config;
    // Check group-specific policy first
    if (groupId) {
        const groupConfig = dingtalkCfg?.groups?.[groupId];
        if (groupConfig?.tools) {
            return groupConfig.tools;
        }
    }
    // Fall back to account-level default (allow all)
    return { allow: ["*"] };
}
