function stripProviderPrefix(raw) {
    return raw.replace(/^(dingtalk|dd|ding):/i, "").trim();
}
export function normalizeDingtalkTarget(raw) {
    const trimmed = raw.trim();
    if (!trimmed) {
        return null;
    }
    const withoutProvider = stripProviderPrefix(trimmed);
    const lowered = withoutProvider.toLowerCase();
    if (lowered.startsWith("user:")) {
        return withoutProvider.slice("user:".length).trim() || null;
    }
    if (lowered.startsWith("group:")) {
        return withoutProvider.slice("group:".length).trim() || null;
    }
    return withoutProvider;
}
export function formatDingtalkTarget(id, type) {
    const trimmed = id.trim();
    if (type === "group") {
        return `group:${trimmed}`;
    }
    if (type === "user") {
        return `user:${trimmed}`;
    }
    return trimmed;
}
export function looksLikeDingtalkId(raw) {
    const trimmed = stripProviderPrefix(raw.trim());
    if (!trimmed) {
        return false;
    }
    if (/^(user|group):/i.test(trimmed)) {
        return true;
    }
    return true;
}
