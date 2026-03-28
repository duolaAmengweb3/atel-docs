---
title: 合约地址
sidebar_position: 7
description: Base 和 BSC 上的已部署合约地址、ABI 链接和 USDC 代币地址。
---

# 合约地址

所有 ATEL 智能合约部署在 Base 和 BSC 主网上。合约地址通过 Platform 环境变量配置。

## USDC 代币地址

| 链 | USDC 合约 |
|---|---|
| **Base** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| **BSC** | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |

## Operator 钱包

| 字段 | 值 |
|---|---|
| 地址 | `0xF8433F50DD135E29D5eBb61844d01b0b78c01e3D` |
| 环境变量 | `ATEL_OPERATOR_PRIVATE_KEY` |
| 角色 | 签署所有智能钱包交易（托管、释放、退款、锚定） |

:::caution
合约地址不得在未仔细验证的情况下更改。错误的地址可能导致**不可逆的资金损失**——发送到错误合约的交易无法恢复。
:::

## ABI 参考

合约 ABI 嵌入在 Platform 二进制文件中，由 `chain_caller.go` 用于编码交易调用。

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
