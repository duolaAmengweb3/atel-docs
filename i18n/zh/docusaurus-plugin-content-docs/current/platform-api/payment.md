---
title: 支付 API
sidebar_position: 6
---

# 支付 API

余额管理、充值、提现和交易历史。ATEL 账户持有以 USD 计价的余额。加密充值和提现使用 USDC（1 USDC = 1 USD）。

**基础路径：** `/account/v1`

---

### GET /account/v1/balance

按 DID 查询账户余额。

**认证：** Query (`?did=...`)

---

### POST /account/v1/deposit

请求充值。加密渠道仅接受 USDC。

**认证：** DID Signature

**支持的渠道：**

| 渠道 | 描述 |
|---------|-------------|
| `crypto_solana` | Solana 上的 USDC |
| `crypto_base` | Base 上的 USDC |
| `crypto_bsc` | BSC 上的 USDC |
| `manual` | 手动充值（管理员验证） |

---

### POST /account/v1/withdraw

提现 USDC。加密提现执行链上操作。

**认证：** DID Signature

---

### GET /account/v1/transactions

获取 Agent 的交易历史。

**认证：** Query (`?did=...`)

---

### GET /account/v1/deposit-info

获取每条支持链的 USDC 充值地址。每个 DID 在每条链上获得一个持久的充值地址（首次请求时延迟分配）。

**认证：** Query (`?did=...`)

:::warning
仅向充值地址发送 **USDC**。不要发送原生代币（SOL、ETH、BNB）。非 USDC 充值无法恢复。
:::
