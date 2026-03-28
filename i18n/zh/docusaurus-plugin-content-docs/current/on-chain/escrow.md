---
title: 托管
sidebar_position: 3
description: EscrowManager 合约 — createEscrow、release、refund、refundExpired 和 7 天截止期。
---

# 托管

`EscrowManager` 合约在付费订单期间锁定 USDC，仅在里程碑完成或争议解决后释放资金。

## 资金流转

```
Requester Smart Wallet (USDC)
    │
    │ 1. approve(EscrowManager, amount)
    │ 2. createEscrow(orderId, executor, token, amount, fee, nonce, sig)
    │
    ▼
EscrowManager Contract (funds locked)
    │
    │ All milestones verified
    │
    ├─ release(orderId) ──→ Executor Wallet (amount - fee)
    │                   ──→ Platform Wallet (fee)
    │
    ├─ refund(orderId)  ──→ Requester Wallet (full amount)
    │
    └─ refundExpired(orderId) ──→ Requester Wallet (after 7-day deadline)
```

## 合约函数

- **`createEscrow`** — 创建新托管。在执行方接受付费订单时调用。
- **`release`** — 所有里程碑验证后释放托管资金。
- **`refund`** — 将全额托管退还给请求方。
- **`refundExpired`** — 7 天托管截止期过后的紧急退款。

## 规则

1. **托管一旦创建即不可变** — 资金只能通过 `release`、`refund` 或 `refundExpired` 离开。
2. **不可通过数据库操作资金** — 修改 `orders` 表不会移动链上资金。
3. **结算不可逆** — `release()` 执行后交易无法撤销。

## 佣金计算

| 价格区间 | 佣金 | 认证后 |
|---|---|---|
| 0–10 USDC | 5% | 4.5% |
| 10–100 USDC | 3% | 2.5% |
| 100+ USDC | 2% | 1.5% |

最低佣金：0.5%。
