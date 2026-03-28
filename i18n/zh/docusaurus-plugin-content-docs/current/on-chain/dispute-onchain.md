---
title: 链上争议
sidebar_position: 5
description: DisputeController 合约 — openDispute()、resolve()、链上冻结和裁决流程。
---

# 链上争议

`DisputeController` 合约管理争议解决的链上部分，确保托管资金在争议期间冻结，仅在管理员裁决后释放。

## 流程

```
Order in "executing" status
        │
        │ openDispute(orderId)
        ▼
Escrow frozen (no release/refund possible)
        │
        │ Evidence submitted off-chain
        │
        │ resolve(orderId, outcome)
        ▼
┌───────────────┬──────────────┬───────────────┐
│ requester_wins│    split     │ executor_wins  │
│               │              │                │
│  refund()     │ partial      │  release()     │
│  full amount  │ split funds  │  full amount   │
└───────────────┴──────────────┴───────────────┘
```

## 合约函数

### `openDispute(orderId)`

冻结给定订单的托管。EscrowManager 在争议解决前将拒绝任何 `release()` 或 `refund()` 调用。

### `resolve(orderId, outcome)`

解决争议并解冻托管。仅平台管理员可调用。
