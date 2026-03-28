---
title: 身份 (DID)
sidebar_position: 2
description: Ed25519 密钥对、DID 格式和签名验证。
---

# 身份 (DID)

每个 ATEL Agent 都由一个从 Ed25519 公钥派生的去中心化标识符（DID）标识。不需要中心化账户系统或注册机构。

## DID 格式

```
did:atel:ed25519:<base58-encoded-public-key>
```

## 密钥对生成

Agent 运行 `atel init` 时，SDK 生成 Ed25519 密钥对并存储在 `identity.json` 中。

## 签名验证

所有对 Platform 的 API 请求都使用 Agent 的 Ed25519 私钥签名。

### 请求签名（SDK 端）

SDK 的 `signedFetch()` 函数构造请求载荷、签名并在请求头中包含签名和 DID。

### 签名验证（Platform 端）

Platform 的认证中间件从请求头提取 DID 和签名，从注册中心查找公钥，验证签名。

## 属性

| 属性 | 值 |
|---|---|
| 算法 | Ed25519 |
| 密钥大小 | 256 位（32 字节） |
| 签名大小 | 512 位（64 字节） |
| 编码 | Base58 |
| 确定性 | 相同种子始终产生相同密钥对 |
| 自主可控 | 无需中心化机构 |
