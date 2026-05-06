#!/bin/bash
FILE="$1"
[ ! -f "$FILE" ] && echo "ERROR: 文件不存在: $FILE" && exit 1

APPKEY="dinglj6rxic4jypfvjwt"
APPSECRET="WQMqRd-Amu9aOpRSHPMNf4Tza7Rd86f2vcaKpXCxZ9dUAoNb8hKpIOOmFAsDfI2t"
USERID="523612186039813142"
BASENAME=$(basename "$FILE")
EXT=$(echo "${BASENAME##*.}" | tr '[:upper:]' '[:lower:]')

case "$EXT" in jpg|jpeg|png|gif|bmp|webp) IS_IMAGE=true ;; *) IS_IMAGE=false ;; esac

OPENAPI_TOKEN=$(curl -sf "https://api.dingtalk.com/v1.0/oauth2/accessToken" \
  -H "Content-Type: application/json" \
  -d "{\"appKey\":\"$APPKEY\",\"appSecret\":\"$APPSECRET\"}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('accessToken',''))")

OAPI_TOKEN=$(curl -sf "https://oapi.dingtalk.com/gettoken?appkey=$APPKEY&appsecret=$APPSECRET" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))")

if [ "$IS_IMAGE" = true ]; then
  case "$EXT" in png) MIME="image/png" ;; jpg|jpeg) MIME="image/jpeg" ;; gif) MIME="image/gif" ;; webp) MIME="image/webp" ;; *) MIME="image/png" ;; esac
  UPLOAD=$(curl -sf "https://oapi.dingtalk.com/media/upload?access_token=$OAPI_TOKEN&type=image" -F "media=@$FILE;type=$MIME")
  MEDIA_ID=$(echo "$UPLOAD" | python3 -c "import sys,json; print(json.load(sys.stdin).get('media_id',''))")
  curl -sf -X POST "https://api.dingtalk.com/v1.0/robot/oToMessages/batchSend" \
    -H "Content-Type: application/json" -H "x-acs-dingtalk-access-token: $OPENAPI_TOKEN" \
    -d "{\"robotCode\":\"$APPKEY\",\"userIds\":[\"$USERID\"],\"msgKey\":\"sampleImageMsg\",\"msgParam\":\"{\\\"photoURL\\\":\\\"$MEDIA_ID\\\"}\"}" > /dev/null
else
  UPLOAD=$(curl -sf "https://oapi.dingtalk.com/media/upload?access_token=$OAPI_TOKEN&type=file" -F "media=@$FILE")
  MEDIA_ID=$(echo "$UPLOAD" | python3 -c "import sys,json; print(json.load(sys.stdin).get('media_id',''))")
  curl -sf -X POST "https://api.dingtalk.com/v1.0/robot/oToMessages/batchSend" \
    -H "Content-Type: application/json" -H "x-acs-dingtalk-access-token: $OPENAPI_TOKEN" \
    -d "{\"robotCode\":\"$APPKEY\",\"userIds\":[\"$USERID\"],\"msgKey\":\"sampleFile\",\"msgParam\":\"{\\\"mediaId\\\":\\\"$MEDIA_ID\\\",\\\"fileName\\\":\\\"$BASENAME\\\",\\\"fileType\\\":\\\"$EXT\\\"}\"}" > /dev/null
fi
echo "SUCCESS: $BASENAME 已发送 ($([ "$IS_IMAGE" = true ] && echo '图片预览' || echo '文件附件'))"
