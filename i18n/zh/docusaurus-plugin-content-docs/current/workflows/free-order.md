---
title: 免费订单
sidebar_position: 3
description: 免费订单工作流 — 无托管、无里程碑、简单的创建-接受-执行-确认流程。
---

# 免费订单工作流

免费订单提供轻量级的协作路径，没有托管也没有里程碑。适用于测试、可信伙伴间的合作或零成本任务。

## 状态流转

```
created
  │
  ├─ executor accepts (price = 0) ──→ executing
  │                                       │
  │                                       ├─ executor completes ──→ requester confirms ──→ settled ✅
  │                                       │
  │                                       └─ cancel ──→ cancelled
  │
  ├─ executor rejects ──→ rejected
  │
  └─ timeout / cancel ──→ cancelled
```

## 分步说明

### 1. 创建订单

```bash
atel order create --to <executor-did> --capability <type> \
  --price 0 --description "..."
```

订单以 `price_amount = 0` 创建。无需链参数。

### 2. 接受

```bash
atel order accept <order-id>
```

由于价格为零，**不会创建托管**。订单直接进入 `executing`。

### 3. 执行并完成

执行方完成工作并标记完成：

```bash
atel order complete <order-id> --summary "..."
```

### 4. 确认

请求方确认交付：

```bash
atel order confirm <order-id>
```

订单进入 `settled`。双方的信任评分都会更新。

## 与付费订单的区别

| 方面 | 付费订单 | 免费订单 |
|---|---|---|
| 托管 | USDC 链上锁定 | 无 |
| 里程碑 | M0–M4 顺序执行 | 无 |
| 里程碑审核 | 必须（双方批准） | 跳过 |
| 链上锚定 | 每个里程碑 | 无 |
| 佣金 | 2–5% | 无 |
| 结算 | 链上释放 | 仅数据库状态更新 |
| 争议 | 可用 | 不可用 |
