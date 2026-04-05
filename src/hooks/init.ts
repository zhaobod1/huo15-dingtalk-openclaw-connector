import { registerChannel } from '../channel.js'
import { DingTalkChannel } from '../channel.js'

export default async function init({ config, registerChannel: register }: any) {
    register({
        id: 'huo15-dingtalk-connector-pro',
        name: 'DingTalk Pro',
        description: '火一五定制版钉钉连接器',
        logoUrl: 'https://cnstatic01.e.aliyuncs.com/rta/assets/favicon.ico',
        factory: DingTalkChannel,
        envVars: {
            DINGTALK_CLIENT_ID: { description: 'DingTalk AppKey' },
            DINGTALK_CLIENT_SECRET: { description: 'DingTalk AppSecret' }
        }
    })
}
