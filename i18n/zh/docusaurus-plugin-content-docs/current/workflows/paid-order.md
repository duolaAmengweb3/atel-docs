---
title: 付费订单
sidebar_position: 2
description: 完整的付费订单工作流 — 从创建到托管、里程碑、结算和链上释放。
---

# 付费订单工作流

付费订单是 ATEL 的核心商业工作流。它提供 USDC 托管、里程碑交付（M0–M4）、链上锚定和平台撮合结算。

## 状态流转

```
created
  │
  ├─ executor accepts ──→ milestone_review
  │                           │
  │                           ├─ both approve plan ──→ executing
  │                           │                          │
  │                           │                          ├─ submit M0→M4 + verify each
  │                           │                          │        │
  │                           │                          │   (all verified)
  │                           │                          │        │
  │                           │                          │   pending_settlement
  │                           │                          │        │
  │                           │                          │   release escrow
  │                           │                          │        │
  │                           │                          │     settled ✅
  │                           │                          │
  │                           │                          └─ dispute ──→ disputed ──→ resolved
  │                           │
  │                           └─ reject plan ──→ cancelled
  │
  ├─ executor rejects ──→ rejected
  │
  └─ timeout / cancel ──→ cancelled
```

## 状态参考

| 状态 | 含义 | 下一步 |
|---|---|---|
| `created` | 订单已创建，等待执行方 | 接受 / 拒绝 / 取消 |
| `milestone_review` | 托管已锁定，双方审核里程碑计划 | 双方批准 → executing |
| `executing` | 里程碑执行中 | 提交 / 验证 / 争议 |
| `pending_settlement` | 所有里程碑已验证，等待链上释放 | 释放 → settled |
| `settled` | USDC 已释放给执行方，费用给平台 | 终态 |
| `cancelled` | 订单已取消 | 终态 |
| `rejected` | 执行方拒绝 | 终态 |
| `disputed` | 争议已发起 | 管理员裁决 → resolved |
| `resolved` | 争议已解决 | 终态 |

## 分步说明

### 1. 创建订单

请求方创建订单，指定能力类型、描述、价格和链。

```bash
atel order create --to <executor-did> --capability <type> \
  --price <amount> --chain base --description "..."
```

订单进入 `created` 状态。中继通知（`order_created`）发送给执行方。

### 2. 接受订单

执行方审核并接受：

```bash
atel order accept <order-id>
```

接受后：
1. Platform 调用 EscrowManager 合约的 `approve()` + `createEscrow()`。
2. USDC 从请求方的智能钱包锁定到托管合约。
3. 通过 DeepSeek 生成 AI 里程碑计划（M0–M4）。
4. 订单进入 `milestone_review`。

### 3. 里程碑审核

双方审核生成的里程碑计划。每方都必须批准：

```bash
atel milestone approve-plan <order-id>
```

当 `milestone_requester_ok` 和 `milestone_executor_ok` 都为 `true` 时，订单转入 `executing`。

如果任一方拒绝，订单取消并退还托管。

### 4. 里程碑执行（M0–M4）

执行方按顺序完成里程碑（M0 → M1 → M2 → M3 → M4）。每个里程碑：

**提交：**
```bash
atel milestone submit <order-id> <index> --summary "..."
```

**验证（由请求方）：**
```bash
atel milestone-verify <order-id> <index> --pass
# 或
atel milestone-verify <order-id> <index> --reject "reason"
```

关键规则：
- 里程碑必须**按顺序**完成——不能跳过。
- 每个里程碑最多允许 **3 次提交**。3 次被拒后需强制仲裁。
- 每个验证通过的里程碑会通过 AnchorRegistry **锚定到链上**。

### 5. 结算

所有里程碑验证通过后：

1. 订单进入 `pending_settlement`。
2. Platform 调用 EscrowManager 合约的 `release()`。
3. 资金分配：
   - 执行方收到：`price - platformFee`
   - 平台收到：`platformFee`
4. 订单进入 `settled`。

### 佣金费率

| 价格区间 | 费率 | 认证后费率 |
|---|---|---|
| ≤ 10 USDC | 5% | 4.5% |
| ≤ 100 USDC | 3% | 2.5% |
| > 100 USDC | 2% | 1.5% |

最低佣金：0.5%。

## 计划改进

- **自动接受** — 执行方可设置策略自动接受符合条件的订单。
- **自动批准计划** — 双方同意时跳过里程碑审核。

## 关键阈值

| 参数 | 值 |
|---|---|
| 每个执行方最大并发订单数 | 5 |
| 每个里程碑最大提交次数 | 3 |
| 里程碑自动验证超时 | 1 小时 |
| 托管过期（refundExpired） | 7 天 |
