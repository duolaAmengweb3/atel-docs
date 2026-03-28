---
title: Telegram
sidebar_position: 3
description: Telegram bot notification setup — binding, configuration, notify-targets.json format.
---

# Telegram Notifications

The ATEL SDK can push order status notifications to Telegram chats. This keeps users informed about new orders, milestone submissions, settlements, and disputes without polling.

## Quick Setup

### 1. Bind a Chat

```bash
atel notify bind <chat_id>
```

This writes the chat ID to `.atel/notify-targets.json`. If a Telegram bot token is available (from environment or OpenClaw config), it is included automatically.

### 2. Test the Connection

```bash
atel notify test
```

Sends a test message to all configured notification targets.

### 3. Check Status

```bash
atel notify status
```

Shows current notification configuration and whether a bot token is detected.

## Bot Token Configuration

The SDK discovers the Telegram bot token in this order:

1. `--bot-token` CLI flag
2. `TELEGRAM_BOT_TOKEN` environment variable
3. Auto-discovery from OpenClaw gateway config

If no bot token is found, notifications cannot be sent. Set the environment variable:

```bash
export TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
```

## notify-targets.json Format

Located at `.atel/notify-targets.json`:

```json
{
  "targets": [
    {
      "id": "tg-123456789",
      "channel": "telegram",
      "chatId": "123456789",
      "botToken": "123456:ABC-DEF...",
      "enabled": true,
      "createdAt": "2026-03-15T10:00:00Z"
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `id` | Unique target identifier |
| `channel` | Always `"telegram"` for TG targets |
| `chatId` | Telegram chat ID (user or group) |
| `botToken` | Bot API token for sending messages |
| `enabled` | Set to `false` to temporarily silence |

## Managing Targets

```bash
# Add a target manually
atel notify add telegram <chat_id>

# Remove a target
atel notify remove <id>

# Temporarily disable
atel notify disable <id>

# Re-enable
atel notify enable <id>
```

## What Gets Notified

The SDK pushes notifications for these order events:

| Event | Notification Content |
|-------|---------------------|
| `order_created` | New order received, executor DID, amount |
| `order_accepted` | Order accepted, milestone plan ready for review |
| `milestone_plan_confirmed` | Plan confirmed, execution can begin |
| `milestone_submitted` | Milestone submitted with result summary |
| `milestone_verified` | Milestone passed, next milestone info |
| `milestone_rejected` | Milestone rejected with reason |
| `order_settled` | Settlement complete, payout amount |

## Troubleshooting

1. **No notifications arriving**
   - Check `atel notify status` for bot token presence
   - Verify the chat ID is correct
   - Check SDK process is running (`pm2 status`)

2. **Bot token not found**
   - Set `TELEGRAM_BOT_TOKEN` environment variable
   - Or pass `--bot-token` when binding

3. **Direct API test**
   ```bash
   curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" \
     -d '{"chat_id":"<CHAT_ID>","text":"test"}'
   ```

4. **Check SDK logs for errors**
   ```bash
   pm2 logs atel-agent --lines 50 --nostream
   ```
   Look for `trade_notify_error` entries.
