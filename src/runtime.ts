import type { PluginRuntime } from "openclaw/plugin-sdk";

// v1.0.9 fix: 用 globalThis + Symbol.for 替代 module-level closure。
// v1.0.6 起 OpenClaw 加载本 plugin 时，register() 通过 openclaw.extensions
// 走 .ts 入口，但消息分发链路某些路径可能再次解析模块（package.json.main、
// 或 .js → .ts 后缀回退导致的不同 cache key），生成第二份 module 实例 →
// setRuntime 写到的 closure 在另一份 module 的 getRuntime 看不到 →
// 报 "DingTalk runtime not initialized"，钉钉永远拿不到 SDK runtime。
//
// Symbol.for 从全局 registry 查表，所有 module 实例共享同一个 globalThis 槽位，
// 即便被加载多次也能共用 runtime。
const RUNTIME_KEY = Symbol.for("huo15:dingtalk-openclaw-connector:runtime");

interface RuntimeSlot {
  value: PluginRuntime | null;
}

function getSlot(): RuntimeSlot {
  const g = globalThis as unknown as Record<symbol, RuntimeSlot | undefined>;
  let slot = g[RUNTIME_KEY];
  if (!slot) {
    slot = { value: null };
    g[RUNTIME_KEY] = slot;
  }
  return slot;
}

export function setDingtalkRuntime(next: PluginRuntime): void {
  getSlot().value = next;
}

export function clearDingtalkRuntime(): void {
  getSlot().value = null;
}

export function tryGetDingtalkRuntime(): PluginRuntime | null {
  return getSlot().value;
}

export function getDingtalkRuntime(): PluginRuntime {
  const v = getSlot().value;
  if (v === null) {
    throw new Error("DingTalk runtime not initialized");
  }
  return v;
}

// ============ 当前会话 target 存储 ============
// 用于 send_dingtalk_file 等工具在 agent 执行上下文中获取当前消息的发送者，
// 避免硬编码 target 或要求 agent 手动传参。
const CURRENT_TARGET_KEY = Symbol.for("huo15:dingtalk-openclaw-connector:currentTarget");

interface CurrentTargetSlot {
  senderId: string | null;
  conversationId: string | null;
  isDirect: boolean;
}

function getTargetSlot(): CurrentTargetSlot {
  const g = globalThis as unknown as Record<symbol, CurrentTargetSlot | undefined>;
  let slot = g[CURRENT_TARGET_KEY];
  if (!slot) {
    slot = { senderId: null, conversationId: null, isDirect: true };
    g[CURRENT_TARGET_KEY] = slot;
  }
  return slot;
}

export function setCurrentTarget(senderId: string, conversationId: string, isDirect: boolean): void {
  const s = getTargetSlot();
  s.senderId = senderId;
  s.conversationId = conversationId;
  s.isDirect = isDirect;
}

export function getCurrentTarget(): { senderId: string | null; conversationId: string | null; isDirect: boolean } {
  const s = getTargetSlot();
  return { senderId: s.senderId, conversationId: s.conversationId, isDirect: s.isDirect };
}

export function clearCurrentTarget(): void {
  const s = getTargetSlot();
  s.senderId = null;
  s.conversationId = null;
}
