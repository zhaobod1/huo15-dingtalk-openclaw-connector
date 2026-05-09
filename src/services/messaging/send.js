/**
 * 消息发送基础模块
 * 支持 Markdown、文本、链接等消息类型
 */
import { getAccessToken } from '../../utils/token.js';
import { dingtalkHttp } from '../../utils/http-client.js';
/**
 * 发送 Markdown 消息
 */
export async function sendMarkdownMessage(config, sessionWebhook, title, markdown, options = {}) {
    const token = await getAccessToken(config);
    let text = markdown;
    if (options.atUserId)
        text = `${text} @${options.atUserId}`;
    const body = {
        msgtype: 'markdown',
        markdown: {
            title,
            text: text,
        },
    };
    if (options.atUserId) {
        body.at = {
            userIds: [options.atUserId],
            isAtAll: false,
        };
    }
    const resp = await dingtalkHttp.post(sessionWebhook, body, {
        headers: {
            'x-acs-dingtalk-access-token': token,
            'Content-Type': 'application/json',
        },
    });
    return resp.data;
}
/**
 * 发送文本消息
 */
export async function sendTextMessage(config, sessionWebhook, content, options = {}) {
    const token = await getAccessToken(config);
    let text = content;
    if (options.atUserId)
        text = `${text} @${options.atUserId}`;
    const body = {
        msgtype: 'text',
        text: {
            content: text,
        },
    };
    if (options.atUserId) {
        body.at = {
            userIds: [options.atUserId],
            isAtAll: false,
        };
    }
    const resp = await dingtalkHttp.post(sessionWebhook, body, {
        headers: {
            'x-acs-dingtalk-access-token': token,
            'Content-Type': 'application/json',
        },
    });
    return resp.data;
}
/**
 * 发送链接消息
 */
export async function sendLinkMessage(config, sessionWebhook, params) {
    const token = await getAccessToken(config);
    const body = {
        msgtype: 'link',
        link: {
            title: params.title,
            text: params.text,
            picUrl: params.picUrl,
            messageUrl: params.messageUrl,
        },
    };
    const resp = await dingtalkHttp.post(sessionWebhook, body, {
        headers: {
            'x-acs-dingtalk-access-token': token,
            'Content-Type': 'application/json',
        },
    });
    return resp.data;
}
