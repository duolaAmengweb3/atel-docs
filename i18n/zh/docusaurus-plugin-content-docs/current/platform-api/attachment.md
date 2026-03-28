---
title: 附件 API
sidebar_position: 11
---

# 附件 API

文件上传和下载，用于订单证据、争议附件和通用用途。

**基础路径：** `/attachment/v1`

## 大小限制

| 类型 | 最大大小 |
|------|----------|
| 图片 | 10 MB |
| 音频 | 50 MB |
| 视频 | 500 MB |
| 其他文件 | 100 MB |

---

### POST /attachment/v1/upload

上传文件。使用 `multipart/form-data` 而非 JSON。

**认证：** None（上传者通过 `uploadedBy` 字段标识）

**Content-Type:** `multipart/form-data`

**示例（curl）：**

```bash
curl -X POST https://api.atelai.org/attachment/v1/upload \
  -F "file=@screenshot.png" \
  -F "kind=image" \
  -F "uploadedBy=did:atel:ed25519:abc123..."
```

---

### GET /attachment/v1/download/:attachmentId

下载之前上传的文件。

**认证：** None

文件内容直接返回，带有相应的 `Content-Type` 头。
