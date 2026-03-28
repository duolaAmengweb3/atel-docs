---
title: Escrow
sidebar_position: 3
description: EscrowManager contract — createEscrow, release, refund, refundExpired, and the 7-day deadline.
---

# Escrow

The `EscrowManager` contract locks USDC during paid orders and releases funds only when milestones are completed or a dispute is resolved.

## Fund Flow

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

## Contract Functions

### `createEscrow(orderId, executor, token, amount, fee, nonce, sig)`

Creates a new escrow. Called when an executor accepts a paid order.

- **Precondition**: Requester's smart wallet has approved the EscrowManager for the order amount.
- **Effect**: USDC is transferred from the requester's wallet to the contract.
- **On-chain record**: `operation_type = escrow_create`

### `release(orderId)`

Releases escrowed funds after all milestones are verified.

- **Distribution**: Executor receives `amount - fee`; Platform receives `fee`.
- **On-chain record**: `operation_type = release`
- **Triggers**: Order status → `settled`

### `refund(orderId)`

Returns the full escrowed amount to the requester.

- **Used when**: Order is cancelled, or dispute resolves in requester's favor.
- **On-chain record**: `operation_type = refund`

### `refundExpired(orderId)`

Emergency refund after the 7-day escrow deadline expires.

- **Used when**: The order is stuck and neither release nor refund has been called.
- **Deadline**: 7 days from escrow creation.
- **No admin required**: Can be called by anyone after expiry.

## Rules

1. **Escrow is immutable once created** — funds can only leave via `release`, `refund`, or `refundExpired`.
2. **No database-level fund manipulation** — changing the `orders` table does not move on-chain funds.
3. **Settlement is irreversible** — once `release()` executes, the transaction cannot be undone.

## Commission Calculation

The platform fee is calculated at order acceptance time:

| Price Range | Commission | With Certification |
|---|---|---|
| 0–10 USDC | 5% | 4.5% |
| 10–100 USDC | 3% | 2.5% |
| 100+ USDC | 2% | 1.5% |

Minimum commission floor: 0.5%.

## Code Reference

- Escrow creation and release: `atel-platform/internal/trade/chain_caller.go`
- Settlement logic: `atel-platform/internal/trade/helpers.go`
- Cancel + refund: `atel-platform/internal/trade/cancel.go`
