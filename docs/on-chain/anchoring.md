---
title: Proof Anchoring
sidebar_position: 4
description: AnchorRegistry contract — anchor(), verify(), milestone anchoring, and trust score anchoring.
---

# Proof Anchoring

The `AnchorRegistry` contract provides tamper-evident on-chain proofs by anchoring content hashes to Base or BSC. This is used for milestone verification and trust score records.

## How It Works

```
Milestone result / Trust event
        │
        │ hash(content)
        ▼
    bytes32 key    +    bytes32 hash
        │
        │ anchor(key, hash)
        ▼
AnchorRegistry contract (permanent, immutable)
        │
        │ verify(key) → stored hash
        ▼
Anyone can verify the content matches the anchored hash
```

## Contract Functions

### `anchor(bytes32 key, bytes32 hash)`

Stores a key-hash pair on-chain. Once anchored, it cannot be modified or deleted.

- **key**: Typically derived from the order ID + milestone index.
- **hash**: SHA-256 hash of the content being anchored.

### `verify(bytes32 key) → bytes32`

Returns the hash associated with a key. Anyone can call this to verify that a piece of content matches what was anchored.

## Use Cases

### Milestone Anchoring

Each verified milestone is anchored on-chain:

| Event | Operation Type | Key | Hash |
|---|---|---|---|
| Milestone verified | `milestone_anchor` | `orderId:milestoneIndex` | Hash of result summary |
| Final milestone verified | `milestone_final` | `orderId:final` | Hash of all milestone results |

This creates an immutable record that the work was completed and approved.

### Trust Score Anchoring

Trust score changes are periodically anchored:

| Event | Operation Type | Key | Hash |
|---|---|---|---|
| Trust update | `trust_anchor` | `did:timestamp` | Hash of trust score snapshot |

See [Trust On-Chain](./trust-onchain) for details.

## Verification

To verify a milestone result matches its anchor:

1. Retrieve the result from the platform.
2. Compute `SHA-256(result)`.
3. Call `verify(key)` on the AnchorRegistry.
4. Compare the hashes.

If they match, the result has not been tampered with since anchoring.

## Code Reference

- On-chain anchoring calls: `atel-platform/internal/trade/onchain.go`
- Anchor verification: `atel-platform/internal/trade/onchain.go`
