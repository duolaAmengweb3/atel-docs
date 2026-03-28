---
title: On-Chain Disputes
sidebar_position: 5
description: DisputeController contract — openDispute(), resolve(), on-chain freeze and resolution flow.
---

# On-Chain Disputes

The `DisputeController` contract manages the on-chain side of dispute resolution, ensuring that escrowed funds are frozen during disputes and released only after admin resolution.

## Flow

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
        │
        ▼
   Order → resolved (terminal)
```

## Contract Functions

### `openDispute(orderId)`

Freezes the escrow for the given order.

- **Caller**: Platform, on behalf of the disputing party.
- **Effect**: The EscrowManager will reject any `release()` or `refund()` calls until the dispute is resolved.
- **On-chain record**: Logged in `on_chain_records` with a dispute operation type.

### `resolve(orderId, outcome)`

Resolves the dispute and unfreezes the escrow.

- **Caller**: Platform admin only.
- **Outcomes**:
  - `requester_wins` — triggers `refund()` to return funds to requester.
  - `executor_wins` — triggers `release()` to pay the executor.
  - `split` — partial distribution based on the admin's ruling.

## Integration with Off-Chain

The on-chain dispute contract works in tandem with the off-chain dispute handler:

| Step | Where | Action |
|---|---|---|
| Open dispute | On-chain | `DisputeController.openDispute()` freezes funds |
| Submit evidence | Off-chain | Stored in platform database |
| Admin review | Off-chain | Admin reviews evidence |
| Resolve | On-chain | `DisputeController.resolve()` distributes funds |
| Update status | Off-chain | Order status → `resolved` |

## Code Reference

- Dispute handler: `atel-platform/internal/dispute/handler.go`
- On-chain dispute calls: Integrated with `chain_caller.go`
