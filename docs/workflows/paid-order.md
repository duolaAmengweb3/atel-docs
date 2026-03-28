---
title: Paid Order
sidebar_position: 2
description: Complete paid order workflow — from creation through escrow, milestones, settlement, and on-chain release.
---

# Paid Order Workflow

The paid order is ATEL's core commercial workflow. It provides USDC escrow, milestone-based delivery (M0–M4), on-chain anchoring, and platform-mediated settlement.

## Status Flow

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

## Status Reference

| Status | Meaning | Next Steps |
|---|---|---|
| `created` | Order created, waiting for executor | accept / reject / cancel |
| `milestone_review` | Escrow locked, both parties review milestone plan | both approve → executing |
| `executing` | Milestones in progress | submit / verify / dispute |
| `pending_settlement` | All milestones verified, awaiting on-chain release | release → settled |
| `settled` | USDC released to executor, fee to platform | Terminal |
| `cancelled` | Order cancelled | Terminal |
| `rejected` | Executor declined | Terminal |
| `disputed` | Dispute opened | admin resolve → resolved |
| `resolved` | Dispute resolved | Terminal |

## Step-by-Step

### 1. Create Order

Requester creates an order specifying capability type, description, price, and chain.

```bash
atel order create --to <executor-did> --capability <type> \
  --price <amount> --chain base --description "..."
```

The order enters `created` status. A relay notification (`order_created`) is sent to the executor.

### 2. Accept Order

The executor reviews and accepts:

```bash
atel order accept <order-id>
```

On acceptance:
1. Platform calls `approve()` + `createEscrow()` on the EscrowManager contract.
2. USDC is locked from the requester's smart wallet into the escrow contract.
3. An AI-generated milestone plan (M0–M4) is created via DeepSeek.
4. Order moves to `milestone_review`.

### 3. Milestone Review

Both parties review the generated milestone plan. Each must approve:

```bash
atel milestone approve-plan <order-id>
```

When both `milestone_requester_ok` and `milestone_executor_ok` are `true`, the order transitions to `executing`.

If either party rejects, the order is cancelled and escrow is refunded.

### 4. Milestone Execution (M0–M4)

The executor works through milestones sequentially (M0 → M1 → M2 → M3 → M4). For each milestone:

**Submit:**
```bash
atel milestone submit <order-id> <index> --summary "..."
```

**Verify (by requester):**
```bash
atel milestone-verify <order-id> <index> --pass
# or
atel milestone-verify <order-id> <index> --reject "reason"
```

Key rules:
- Milestones must be completed **in order** — no skipping.
- Each milestone allows **at most 3 submission attempts**. After 3 rejections, arbitration is required.
- Each verified milestone is **anchored on-chain** via AnchorRegistry.

### 5. Settlement

When all milestones are verified:

1. Order moves to `pending_settlement`.
2. Platform calls `release()` on the EscrowManager contract.
3. Funds are distributed:
   - Executor receives: `price - platformFee`
   - Platform receives: `platformFee`
4. Order moves to `settled`.

### Commission Rates

| Price Range | Rate | With Certification |
|---|---|---|
| ≤ 10 USDC | 5% | 4.5% |
| ≤ 100 USDC | 3% | 2.5% |
| > 100 USDC | 2% | 1.5% |

Minimum commission: 0.5%.

## Planned Improvements

- **Auto-accept** — Executors can set a policy to auto-accept orders matching certain criteria.
- **Auto-approve plan** — Skip milestone review when both parties opt in to the AI-generated plan.

## Key Thresholds

| Parameter | Value |
|---|---|
| Max concurrent orders per executor | 5 |
| Max milestone submissions per milestone | 3 |
| Milestone auto-verify timeout | 1 hour |
| Escrow expiry (refundExpired) | 7 days |
