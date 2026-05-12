#!/bin/bash
# ============================================================
# DingTalk 文件发送脚本（demo 版）
# 用法: bash send-dingtalk-file.sh <文件路径> [target]
#   target 可选:
#     - userId（单聊，如 0123456789）
#     - cidXXX（群聊 openConversationId，如 cidabc123==）
#     不填则默认发给 APPKEY 对应的机器人管理员
# ============================================================

FILE="$1"
TARGET="${2}"  # 不填默认发给管理员，填 userId 发单聊，填 cidXXX 发群聊
[ ! -f "$FILE" ] && echo "ERROR: 文件不存在: $FILE" && exit 1

# ⚠️ 部署时替换为真实的 AppKey/AppSecret
APPKEY="dingxxxxxxxxxxxxxxxxxxxxx"
APPSECRET="your_app_secret_here"

BASENAME=$(basename "$FILE")
EXT=$(echo "${BASENAME##*.}" | tr '[:upper:]' '[:lower:]')

# 判断目标类型：cid 开头 → 群聊，含纯数字 → 单聊用户，空 → 管理员
if [[ "$TARGET" == cid* ]]; then
  IS_GROUP=true
elif [[ -n "$TARGET" ]]; then
  IS_GROUP=false
else
  IS_GROUP=false
fi

case "$EXT" in jpg|jpeg|png|gif|bmp|webp) IS_IMAGE=true ;; *) IS_IMAGE=false ;; esac

# 获取 AccessToken
OPENAPI_TOKEN=$(curl -sf "https://api.dingtalk.com/v1.0/oauth2/accessToken" \
  -H "Content-Type: application/json" \
  -d "{\"appKey\":\"$APPKEY\",\"appSecret\":\"$APPSECRET\"}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('accessToken',''))" 2>/dev/null)

OAPI_TOKEN=$(curl -sf "https://oapi.dingtalk.com/gettoken?appkey=$APPKEY&appsecret=$APPSECRET" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null)

# 上传媒体到钉钉
if [ "$IS_IMAGE" = true ]; then
  case "$EXT" in
    png) MIME="image/png" ;;
    jpg|jpeg) MIME="image/jpeg" ;;
    gif) MIME="image/gif" ;;
    webp) MIME="image/webp" ;;
    *) MIME="image/png" ;;
  esac
  UPLOAD=$(curl -sf "https://oapi.dingtalk.com/media/upload?access_token=$OAPI_TOKEN&type=image" -F "media=@$FILE;type=$MIME")
  MEDIA_ID=$(echo "$UPLOAD" | python3 -c "import sys,json; print(json.load(sys.stdin).get('media_id',''))" 2>/dev/null)
  MSG_KEY="sampleImageMsg"
  MSG_PARAM="{\"photoURL\":\"$MEDIA_ID\"}"
else
  UPLOAD=$(curl -sf "https://oapi.dingtalk.com/media/upload?access_token=$OAPI_TOKEN&type=file" -F "media=@$FILE")
  MEDIA_ID=$(echo "$UPLOAD" | python3 -c "import sys,json; print(json.load(sys.stdin).get('media_id',''))" 2>/dev/null)
  MSG_KEY="sampleFile"
  MSG_PARAM="{\"mediaId\":\"$MEDIA_ID\",\"fileName\":\"$BASENAME\",\"fileType\":\"$EXT\"}"
fi

# 发送消息：群聊用 groupMessages/send，单聊用 oToMessages/batchSend
if [ "$IS_GROUP" = true ]; then
  API="https://api.dingtalk.com/v1.0/robot/groupMessages/send"
  TARGET_JSON="\"openConversationId\":\"$TARGET\""
  TARGET_LABEL="群聊($TARGET)"
elif [ -n "$TARGET" ]; then
  API="https://api.dingtalk.com/v1.0/robot/oToMessages/batchSend"
  TARGET_JSON="\"userIds\":[\"$TARGET\"]"
  TARGET_LABEL="用户($TARGET)"
else
  # 不填 target 时发空数组，钉钉 API 会发给管理员
  API="https://api.dingtalk.com/v1.0/robot/oToMessages/batchSend"
  TARGET_JSON="\"userIds\":[]"
  TARGET_LABEL="管理员"
fi

# 转义 msgParam 中的双引号
ESCAPED_PARAM=$(echo "$MSG_PARAM" | sed 's/"/\\"/g')

curl -sf -X POST "$API" \
  -H "Content-Type: application/json" \
  -H "x-acs-dingtalk-access-token: $OPENAPI_TOKEN" \
  -d "{\"robotCode\":\"$APPKEY\",$TARGET_JSON,\"msgKey\":\"$MSG_KEY\",\"msgParam\":\"$ESCAPED_PARAM\"}" > /dev/null

echo "SUCCESS: $BASENAME → $TARGET_LABEL ($([ "$IS_IMAGE" = true ] && echo '图片预览' || echo '文件附件'))"
