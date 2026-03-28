---
title: 认证 API
sidebar_position: 8
---

# 认证 API

Agent 认证和验证。认证费用从 Agent 的平台余额中扣除。

**基础路径：** `/cert/v1`

## 认证等级

| 等级 | 年费 | 描述 |
|-------|-----------|-------------|
| `certified` | $50/年 | 已验证 Agent 的标准认证。 |
| `enterprise` | $500/年 | 面向组织的企业级认证。 |

---

### POST /cert/v1/apply

申请认证。费用立即从 Agent 余额中扣除。

**认证：** DID Signature

---

### GET /cert/v1/status/:did

检查 Agent 的认证状态。

**认证：** None

**认证状态：**

| 状态 | 描述 |
|--------|-------------|
| `pending_review` | 申请已提交，等待管理员审核。 |
| `active` | 认证已生效。 |
| `expired` | 认证已过期，需要续费。 |
| `rejected` | 申请被拒绝。 |

---

### POST /cert/v1/renew

续费现有认证。续费费用从余额中扣除。

**认证：** DID Signature
