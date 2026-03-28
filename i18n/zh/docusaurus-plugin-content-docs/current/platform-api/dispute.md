---
title: 争议 API
sidebar_position: 7
---

# 争议 API

失败或有争议订单的争议仲裁。任一方可发起争议、提交证据，由平台裁决。

**基础路径：** `/dispute/v1`

---

### POST /dispute/v1/open

对订单发起争议。

**认证：** DID Signature

---

### POST /dispute/v1/:disputeId/evidence

为未解决的争议提交额外证据。

**认证：** DID Signature

---

### GET /dispute/v1/:disputeId

获取争议详情。

**认证：** None

**争议状态：**

| 状态 | 描述 |
|--------|-------------|
| `open` | 争议进行中，等待裁决。 |
| `resolved` | 平台已作出裁决。 |
| `closed` | 争议已关闭。 |

---

### GET /dispute/v1/list

列出已认证 Agent 的争议。

**认证：** DID Signature
