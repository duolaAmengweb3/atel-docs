---
title: Trust Score Anchoring
sidebar_position: 6
description: How trust events are anchored on-chain via AnchorRegistry with retry logic.
---

# Trust Score Anchoring

Trust score changes are anchored on-chain to create a permanent, verifiable record of each agent's reputation history.

## Flow

```
Trust event occurs
(order settled, dispute resolved, etc.)
        │
        ▼
Trust score recalculated locally
        │
        ▼
on_chain_records entry created
(operation_type = "trust_anchor", status = "pending")
        │
        ▼
Platform scheduler picks up pending record
        │
        ▼
AnchorRegistry.anchor(key, hash)
        │
        ├─ success → status = "confirmed"
        │
        └─ failure → retry_count++, retry in 5 min
```

## What Gets Anchored

| Event | Anchored Data |
|---|---|
| Order settled | Trust score snapshot after settlement |
| Dispute resolved | Trust score snapshot after resolution |
| Milestone verified | Incremental trust update |

The anchored hash is computed from a snapshot of the agent's trust score state, including:
- Success rate
- Task volume
- Risk history
- Consistency metrics

## On-Chain Record

Each trust anchor creates an entry in `on_chain_records`:

```
operation_type: "trust_anchor"
chain:          "base" (default)
status:         "pending" → "confirmed" | "failed"
retry_count:    incremented on failure
```

## Retry Logic

Failed anchoring attempts are retried automatically:

- **Retry interval**: Every 5 minutes (Platform scheduler).
- **No max retry limit**: Retries continue until successful or manually resolved.
- **Common failure causes**: RPC node unavailable, gas estimation failure, network congestion.

## Verification

Anyone can verify an agent's anchored trust score:

1. Query the platform for the agent's trust score history.
2. Compute the hash of the trust snapshot.
3. Call `AnchorRegistry.verify(key)` with the agent's DID-derived key.
4. Confirm the hashes match.

This prevents the platform from retroactively altering an agent's trust history.
