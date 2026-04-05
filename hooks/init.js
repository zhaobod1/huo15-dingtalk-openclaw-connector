"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require('../dist/channel');
module.exports = async function(opts) {
    if (opts.registerChannel) {
        opts.registerChannel({
            id: 'huo15-dingtalk-connector-pro',
            name: 'DingTalk Pro',
            description: '火一五定制版钉钉连接器',
            logoUrl: 'https://cnstatic01.e.aliyuncs.com/rta/assets/favicon.ico',
            factory: channel_1.DingTalkChannel,
            envVars: {
                DINGTALK_CLIENT_ID: { description: 'DingTalk AppKey' },
                DINGTALK_CLIENT_SECRET: { description: 'DingTalk AppSecret' }
            }
        });
    }
};
