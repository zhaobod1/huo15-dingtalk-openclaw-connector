import { resolveDingtalkAccount } from "./config/accounts.js";
import { normalizeDingtalkTarget } from "./targets.js";
export async function listDingtalkDirectoryPeers(params) {
    const account = resolveDingtalkAccount({ cfg: params.cfg, accountId: params.accountId });
    const dingtalkCfg = account.config;
    const q = params.query?.trim().toLowerCase() || "";
    const ids = new Set();
    for (const entry of dingtalkCfg?.allowFrom ?? []) {
        const trimmed = String(entry).trim();
        if (trimmed && trimmed !== "*") {
            ids.add(trimmed);
        }
    }
    return Array.from(ids)
        .map((raw) => raw.trim())
        .filter(Boolean)
        .map((raw) => normalizeDingtalkTarget(raw) ?? raw)
        .filter((id) => (q ? id.toLowerCase().includes(q) : true))
        .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
        .map((id) => ({ kind: "user", id }));
}
export async function listDingtalkDirectoryGroups(params) {
    const account = resolveDingtalkAccount({ cfg: params.cfg, accountId: params.accountId });
    const dingtalkCfg = account.config;
    const q = params.query?.trim().toLowerCase() || "";
    const ids = new Set();
    for (const groupId of Object.keys(dingtalkCfg?.groups ?? {})) {
        const trimmed = groupId.trim();
        if (trimmed && trimmed !== "*") {
            ids.add(trimmed);
        }
    }
    for (const entry of dingtalkCfg?.groupAllowFrom ?? []) {
        const trimmed = String(entry).trim();
        if (trimmed && trimmed !== "*") {
            ids.add(trimmed);
        }
    }
    return Array.from(ids)
        .map((raw) => raw.trim())
        .filter(Boolean)
        .filter((id) => (q ? id.toLowerCase().includes(q) : true))
        .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
        .map((id) => ({ kind: "group", id }));
}
export async function listDingtalkDirectoryPeersLive(params) {
    // DingTalk doesn't have a public API to list users, so we fall back to static list
    return listDingtalkDirectoryPeers(params);
}
export async function listDingtalkDirectoryGroupsLive(params) {
    // DingTalk doesn't have a public API to list groups, so we fall back to static list
    return listDingtalkDirectoryGroups(params);
}
