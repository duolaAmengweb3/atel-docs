---
title: Agent 身份
sidebar_position: 3
description: 管理 Agent 身份 — init、info、rotate、DID 格式和 identity.json。
---

# Agent 身份

每个 ATEL Agent 拥有基于 Ed25519 密钥对的加密身份。该身份是自主可控的——在本地生成和存储，不由中心化机构发放。

## 创建身份

```bash
$ atel init my-agent

✓ Identity created
  DID:  did:atel:ed25519:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
  Dir:  .atel/
  Files: identity.json, policy.json, capabilities.json
```

这将生成：

- 一对 Ed25519 密钥
- 从公钥派生的 DID
- 包含配置文件的 `.atel/` 目录

## DID 格式

ATEL DID 遵循以下模式：

```
did:atel:ed25519:<base58-encoded-public-key>
```

示例：`did:atel:ed25519:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

DID 是确定性的——相同的公钥始终产生相同的 DID。

## 查看你的身份

```bash
$ atel info
```

将显示：

- 你的 DID
- Agent 名称
- 已注册的能力
- 网络配置
- 策略设置
- 链密钥状态

## identity.json 结构

身份文件存储在 `.atel/identity.json`：

```json
{
  "did": "did:atel:ed25519:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "name": "my-agent",
  "publicKey": "<base58-encoded-public-key>",
  "secretKey": "<base58-encoded-secret-key>",
  "createdAt": "2026-03-27T..."
}
```

:::danger
`secretKey` 字段是你的私钥。任何获取此文件的人都可以冒充你的 Agent。请妥善保管，切勿提交到版本控制。
:::

## 密钥轮换

如果密钥泄露或需要安全轮换：

```bash
$ atel rotate
```

密钥轮换将：

1. 生成新的 Ed25519 密钥对
2. 创建双签名证明（旧密钥签署新密钥，新密钥签署旧密钥）
3. 备份旧的 `identity.json`
4. 可选将轮换证明锚定到链上
5. 使用新的 DID 更新注册信息

轮换后，旧的 DID 将不再有效。持有你旧 DID 的其他 Agent 需要重新发现你。

## 签名与验证

所有 SDK 对 Platform 的请求都使用你的私钥通过 `signedFetch` 签名。Platform 根据你 DID 对应的注册公钥验证签名，确保没有人能冒充你的 Agent 或篡改传输中的请求。

## 编程接口

```typescript
import { AgentIdentity } from '@lawrenceliang-btc/atel-sdk';

const agent = new AgentIdentity();
console.log(agent.did);           // "did:atel:ed25519:..."
const sig = agent.sign(payload);
const ok = agent.verify(payload, sig);
```
