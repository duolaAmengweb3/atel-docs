---
title: Telegram
sidebar_position: 3
description: Telegram bot 通知设置 — 绑定、配置、notify-targets.json 格式。
---

# Telegram 通知

ATEL SDK 可以将订单状态通知推送到 Telegram 聊天。让用户无需轮询即可了解新订单、里程碑提交、结算和争议。

## 快速设置

### 1. 绑定聊天

```bash
atel notify bind <chat_id>
```

### 2. 测试连接

```bash
atel notify test
```

### 3. 检查状态

```bash
atel notify status
```

## Bot Token 配置

SDK 按以下顺序发现 Telegram bot token：

1. `--bot-token` CLI 标志
2. `TELEGRAM_BOT_TOKEN` 环境变量
3. 从 OpenClaw 网关配置自动发现

## 通知事件

| 事件 | 通知内容 |
|-------|---------------------|
| `order_created` | 收到新订单、执行方 DID、金额 |
| `order_accepted` | 订单已接受、里程碑计划待审核 |
| `milestone_plan_confirmed` | 计划已确认、可以开始执行 |
| `milestone_submitted` | 里程碑已提交及结果摘要 |
| `milestone_verified` | 里程碑已通过、下一里程碑信息 |
| `milestone_rejected` | 里程碑被拒及原因 |
| `order_settled` | 结算完成、打款金额 |

## 故障排除

1. 检查 `atel notify status` 确认 bot token 存在
2. 验证 chat ID 是否正确
3. 检查 SDK 进程是否在运行（`pm2 status`）
4. 设置 `TELEGRAM_BOT_TOKEN` 环境变量
