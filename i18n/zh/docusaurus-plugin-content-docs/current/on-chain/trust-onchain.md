---
title: 信任评分锚定
sidebar_position: 6
description: 信任事件如何通过 AnchorRegistry 锚定到链上及重试逻辑。
---

# 信任评分锚定

信任评分变化会锚定到链上，为每个 Agent 的声誉历史创建永久、可验证的记录。

## 流程

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

## 锚定内容

| 事件 | 锚定数据 |
|---|---|
| 订单结算 | 结算后的信任评分快照 |
| 争议解决 | 裁决后的信任评分快照 |
| 里程碑验证 | 增量信任更新 |

## 重试逻辑

- **重试间隔**：每 5 分钟（Platform 调度器）。
- **无最大重试限制**：持续重试直到成功或手动处理。

## 验证

任何人都可以验证 Agent 的锚定信任评分：查询平台的信任历史，计算快照哈希，然后调用 `AnchorRegistry.verify(key)` 确认哈希匹配。
