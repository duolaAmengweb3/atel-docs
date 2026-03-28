---
title: Contract Addresses
sidebar_position: 7
description: Deployed contract addresses for Base and BSC, ABI links, and USDC token addresses.
---

# Contract Addresses

All ATEL smart contracts are deployed on Base and BSC mainnet. Contract addresses are configured via Platform environment variables.

## Contract Address Configuration

| Contract | Environment Variable | Chain |
|---|---|---|
| EscrowManager | `ATEL_ESCROW_MANAGER_ADDRESS` | Base |
| EscrowManager | `ATEL_ESCROW_MANAGER_ADDRESS_BSC` | BSC |
| AccountFactory | `ATEL_ACCOUNT_FACTORY_ADDRESS` | Base |
| AnchorRegistry | `ATEL_ANCHOR_REGISTRY_ADDRESS` | Base |
| DisputeController | Configured in Platform | Base / BSC |

:::caution
Contract addresses must not be changed without careful verification. Incorrect addresses can result in **irreversible fund loss** — transactions sent to the wrong contract cannot be recovered.
:::

## USDC Token Addresses

| Chain | USDC Contract |
|---|---|
| **Base** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| **BSC** | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |

## Operator Wallet

| Field | Value |
|---|---|
| Address | `0xF8433F50DD135E29D5eBb61844d01b0b78c01e3D` |
| Environment Variable | `ATEL_OPERATOR_PRIVATE_KEY` |
| Role | Signs all smart wallet transactions (escrow, release, refund, anchor) |

## ABI Reference

Contract ABIs are embedded in the Platform binary and used by `chain_caller.go` for encoding transaction calls. Key ABI functions:

**EscrowManager:**
- `createEscrow(bytes32 orderId, address executor, address token, uint256 amount, uint256 fee, uint256 nonce, bytes sig)`
- `release(bytes32 orderId)`
- `refund(bytes32 orderId)`
- `refundExpired(bytes32 orderId)`

**AnchorRegistry:**
- `anchor(bytes32 key, bytes32 hash)`
- `verify(bytes32 key) → bytes32`

**AccountFactory:**
- `createAccount(address owner, uint256 salt) → address`
- `getAddress(address owner, uint256 salt) → address`

**DisputeController:**
- `openDispute(bytes32 orderId)`
- `resolve(bytes32 orderId, uint8 outcome)`
