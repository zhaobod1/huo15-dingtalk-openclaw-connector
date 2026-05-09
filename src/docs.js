/**
 * 钉钉文档 API 客户端
 * 支持读写钉钉在线文档（文档、表格等）
 */
import { getAccessToken, DINGTALK_API } from './utils/index.js';
import { dingtalkHttp } from './utils/http-client.js';
// ============ 钉钉文档客户端类 ============
export class DingtalkDocsClient {
    config;
    log;
    constructor(config, log) {
        this.config = config;
        this.log = log;
    }
    /** 获取带鉴权的请求头 */
    async getHeaders() {
        const token = await getAccessToken(this.config);
        return {
            'x-acs-dingtalk-access-token': token,
            'Content-Type': 'application/json',
        };
    }
    /**
     * 获取文档元信息
     */
    async getDocInfo(spaceId, docId) {
        try {
            const headers = await this.getHeaders();
            this.log?.info?.(`[DingTalk][Docs] 获取文档信息: spaceId=${spaceId}, docId=${docId}`);
            const resp = await dingtalkHttp.get(`${DINGTALK_API}/v1.0/doc/spaces/${spaceId}/docs/${docId}`, { headers, timeout: 10_000 });
            const data = resp.data;
            this.log?.info?.(`[DingTalk][Docs] 文档信息获取成功: title=${data?.title}`);
            return {
                docId: data.docId || docId,
                title: data.title || '',
                docType: data.docType || 'unknown',
                creatorId: data.creatorId,
                updatedAt: data.updatedAt,
            };
        }
        catch (err) {
            this.log?.error?.(`[DingTalk][Docs] 获取文档信息失败: ${err.message}`);
            return null;
        }
    }
    /**
     * 读取文档内容（通过 v2.0/wiki 节点 API）
     */
    async readDoc(nodeId, operatorId) {
        try {
            const headers = await this.getHeaders();
            this.log?.info?.(`[DingTalk][Docs] 读取知识库节点: nodeId=${nodeId}, operatorId=${operatorId}`);
            if (!operatorId) {
                this.log?.error?.('[DingTalk][Docs] readDoc 需要 operatorId（unionId）');
                return null;
            }
            const resp = await dingtalkHttp.get(`${DINGTALK_API}/v2.0/wiki/nodes/${nodeId}/content`, { headers, params: { operatorId }, timeout: 30_000 });
            const node = resp.data?.node || resp.data;
            const name = node.name || '未知文档';
            const category = node.category || 'unknown';
            const url = node.url || '';
            const workspaceId = node.workspaceId || '';
            const content = [
                `文档名: ${name}`,
                `类型: ${category}`,
                `URL: ${url}`,
                `工作区: ${workspaceId}`,
            ].join('\n');
            this.log?.info?.(`[DingTalk][Docs] 节点信息获取成功: name=${name}, category=${category}`);
            return content;
        }
        catch (err) {
            this.log?.error?.(`[DingTalk][Docs] 读取节点失败: ${err.message}`);
            if (err.response) {
                this.log?.error?.(`[DingTalk][Docs] 错误详情: status=${err.response.status} data=${JSON.stringify(err.response.data)}`);
            }
            return null;
        }
    }
    /**
     * 从 block 树中递归提取纯文本内容
     */
    extractTextFromBlocks(blocks) {
        const result = [];
        for (const block of blocks) {
            if (block.text) {
                result.push(block.text);
            }
            if (block.children && block.children.length > 0) {
                result.push(...this.extractTextFromBlocks(block.children));
            }
        }
        return result;
    }
    /**
     * 向文档追加内容
     */
    async appendToDoc(docId, content, index = -1) {
        try {
            const headers = await this.getHeaders();
            this.log?.info?.(`[DingTalk][Docs] 向文档追加内容: docId=${docId}, contentLen=${content.length}`);
            const body = {
                blockType: 'PARAGRAPH',
                body: {
                    text: content,
                },
                index,
            };
            await dingtalkHttp.post(`${DINGTALK_API}/v1.0/doc/documents/${docId}/blocks/root/children`, body, { headers, timeout: 10_000 });
            this.log?.info?.(`[DingTalk][Docs] 内容追加成功`);
            return true;
        }
        catch (err) {
            this.log?.error?.(`[DingTalk][Docs] 追加内容失败: ${err.message}`);
            if (err.response) {
                this.log?.error?.(`[DingTalk][Docs] 错误详情: status=${err.response.status} data=${JSON.stringify(err.response.data)}`);
            }
            return false;
        }
    }
    /**
     * 创建新文档
     */
    async createDoc(spaceId, title, content) {
        try {
            const headers = await this.getHeaders();
            this.log?.info?.(`[DingTalk][Docs] 创建文档: spaceId=${spaceId}, title=${title}`);
            const body = {
                spaceId,
                parentDentryId: '',
                name: title,
                docType: 'alidoc',
            };
            const resp = await dingtalkHttp.post(`${DINGTALK_API}/v1.0/doc/spaces/${spaceId}/docs`, body, { headers, timeout: 10_000 });
            const data = resp.data;
            this.log?.info?.(`[DingTalk][Docs] 文档创建成功: docId=${data?.docId}`);
            const docInfo = {
                docId: data.docId || data.dentryUuid || '',
                title: title,
                docType: data.docType || 'alidoc',
            };
            if (content && docInfo.docId) {
                await this.appendToDoc(docInfo.docId, content);
            }
            return docInfo;
        }
        catch (err) {
            this.log?.error?.(`[DingTalk][Docs] 创建文档失败: ${err.message}`);
            if (err.response) {
                this.log?.error?.(`[DingTalk][Docs] 错误详情: status=${err.response.status} data=${JSON.stringify(err.response.data)}`);
            }
            return null;
        }
    }
    /**
     * 搜索文档
     */
    async searchDocs(keyword, spaceId) {
        try {
            const headers = await this.getHeaders();
            this.log?.info?.(`[DingTalk][Docs] 搜索文档: keyword=${keyword}, spaceId=${spaceId || '全部'}`);
            const body = { keyword, maxResults: 20 };
            if (spaceId)
                body.spaceId = spaceId;
            const resp = await dingtalkHttp.post(`${DINGTALK_API}/v1.0/doc/docs/search`, body, { headers, timeout: 10_000 });
            const items = resp.data?.items || [];
            const docs = items.map((item) => ({
                docId: item.docId || item.dentryUuid || '',
                title: item.name || item.title || '',
                docType: item.docType || 'unknown',
                creatorId: item.creatorId,
                updatedAt: item.updatedAt,
            }));
            this.log?.info?.(`[DingTalk][Docs] 搜索到 ${docs.length} 个文档`);
            return docs;
        }
        catch (err) {
            this.log?.error?.(`[DingTalk][Docs] 搜索文档失败: ${err.message}`);
            return [];
        }
    }
    /**
     * 列出空间下的文档
     */
    async listDocs(spaceId, parentId) {
        try {
            const headers = await this.getHeaders();
            this.log?.info?.(`[DingTalk][Docs] 列出文档: spaceId=${spaceId}, parentId=${parentId || '根目录'}`);
            const params = { maxResults: 50 };
            if (parentId)
                params.parentDentryId = parentId;
            const resp = await dingtalkHttp.get(`${DINGTALK_API}/v1.0/doc/spaces/${spaceId}/dentries`, { headers, params, timeout: 10_000 });
            const items = resp.data?.items || [];
            const docs = items.map((item) => ({
                docId: item.dentryUuid || item.docId || '',
                title: item.name || '',
                docType: item.docType || item.dentryType || 'unknown',
                creatorId: item.creatorId,
                updatedAt: item.updatedAt,
            }));
            this.log?.info?.(`[DingTalk][Docs] 列出 ${docs.length} 个文档/目录`);
            return docs;
        }
        catch (err) {
            this.log?.error?.(`[DingTalk][Docs] 列出文档失败: ${err.message}`);
            return [];
        }
    }
}
