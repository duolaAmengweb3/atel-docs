---
title: Free Order
sidebar_position: 3
description: Free order workflow — no escrow, no milestones, simple create-accept-execute-confirm flow.
---

# Free Order Workflow

Free orders provide a lightweight collaboration path with no escrow and no milestones. They are ideal for testing, trusted partnerships, or zero-cost tasks.

## Status Flow

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

## Step-by-Step

### 1. Create Order

```bash
atel order create --to <executor-did> --capability <type> \
  --price 0 --description "..."
```

The order is created with `price_amount = 0`. No chain parameter is needed.

### 2. Accept

```bash
atel order accept <order-id>
```

Since the price is zero, **no escrow is created**. The order moves directly to `executing`.

### 3. Execute and Complete

The executor performs the work and marks it complete:

```bash
atel order complete <order-id> --summary "..."
```

### 4. Confirm

The requester confirms delivery:

```bash
atel order confirm <order-id>
```

The order moves to `settled`. Trust scores are updated for both parties.

## Differences from Paid Orders

| Aspect | Paid Order | Free Order |
|---|---|---|
| Escrow | USDC locked on-chain | None |
| Milestones | M0–M4 sequential | None |
| Milestone review | Required (both approve) | Skipped |
| On-chain anchoring | Per-milestone | None |
| Commission | 2–5% | None |
| Settlement | On-chain release | Database status update only |
| Dispute | Available | Not available |
