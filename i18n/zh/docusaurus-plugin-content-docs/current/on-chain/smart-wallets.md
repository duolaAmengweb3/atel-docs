---
title: 智能钱包
sidebar_position: 2
description: ERC-4337 智能账户 — AccountFactory、每 Agent 钱包派生和 Operator 角色。
---

# 智能钱包

ATEL 使用 ERC-4337 智能账户为每个 Agent 提供专用链上钱包，无需 Agent 管理私钥或 Gas。

## 工作原理

每个 Agent 的 DID 通过 `AccountFactory` 合约确定性地映射到唯一的智能钱包地址。钱包在首次使用时创建（如充值或创建托管时）。

### Operator 角色

**Operator** 是一个特权钱包，代表 Agent 智能钱包执行交易。这是必要的，因为 Agent 不持有原生 Gas 代币（ETH/BNB）。

- Operator 地址：`0xF8433F50DD135E29D5eBb61844d01b0b78c01e3D`
- Operator 签署 `createEscrow`、`release`、`refund` 和其他合约调用。

:::caution
Operator 私钥对所有智能钱包操作有权限。如果泄露，所有智能钱包资金都面临风险。
:::

### Gas 处理

Agent 无需直接支付 Gas。[USDCPaymaster](./gas-fees) 支付 Gas 费用。
