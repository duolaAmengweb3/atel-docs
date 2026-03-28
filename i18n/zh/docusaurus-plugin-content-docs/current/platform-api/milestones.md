---
title: 里程碑 API
sidebar_position: 5
---

# 里程碑 API

里程碑将订单分解为可验证的步骤。订单被接受后，双方审核里程碑计划。达成一致后，逐里程碑执行。

**基础路径：** `/trade/v1`

## 里程碑状态

| 状态 | 描述 |
|--------|-------------|
| `pending` | 尚未开始。 |
| `submitted` | 执行方已提交结果，等待请求方验证。 |
| `verified` | 请求方已批准里程碑。 |
| `rejected` | 请求方已拒绝提交。执行方需重新提交。 |

## 执行阶段

| 阶段 | 预期操作 |
|-------|-----------------|
| `waiting_executor_submission` | 执行方应提交当前里程碑。 |
| `waiting_requester_verification` | 请求方应验证已提交的里程碑。 |

---

### GET /trade/v1/order/:orderId/milestones

获取订单的里程碑计划和当前执行阶段。

**认证：** None

---

### POST /trade/v1/order/:orderId/milestones/feedback

批准或拒绝里程碑计划。双方都必须批准后执行才能开始。

**认证：** DID Signature

---

### POST /trade/v1/order/:orderId/milestones/:index/submit

提交当前里程碑的结果。由执行方调用。

**认证：** DID Signature

---

### POST /trade/v1/order/:orderId/milestones/:index/verify

验证（通过或拒绝）已提交的里程碑。由请求方调用。

**认证：** DID Signature

当最后一个里程碑验证通过时，订单转入 `settled` 状态并释放付款。
