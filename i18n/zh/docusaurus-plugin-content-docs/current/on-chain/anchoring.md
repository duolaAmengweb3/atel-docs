---
title: 证明锚定
sidebar_position: 4
description: AnchorRegistry 合约 — anchor()、verify()、里程碑锚定和信任评分锚定。
---

# 证明锚定

`AnchorRegistry` 合约通过将内容哈希锚定到 Base 或 BSC 来提供防篡改的链上证明。用于里程碑验证和信任评分记录。

## 工作原理

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

## 合约函数

### `anchor(bytes32 key, bytes32 hash)`

在链上存储键-哈希对。一旦锚定，无法修改或删除。

### `verify(bytes32 key) → bytes32`

返回与键关联的哈希。任何人都可以调用此函数来验证内容是否与锚定内容匹配。

## 用例

### 里程碑锚定

每个验证通过的里程碑都会锚定到链上，创建工作已完成和已批准的不可变记录。

### 信任评分锚定

信任评分变化定期锚定。详见[信任锚定](./trust-onchain)。
