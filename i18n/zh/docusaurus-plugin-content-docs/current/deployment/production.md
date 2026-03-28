---
title: 生产部署
sidebar_position: 3
description: 生产部署 — systemd 服务、交叉编译、PM2 和环境变量。
---

# 生产部署

## 架构

| 角色 | 服务器 | 管理 |
|------|--------|-----------|
| Platform (Go) | YOUR_PLATFORM_IP:8200 | systemd: `atel-platform.service` |
| SDK Agent (Requester) | YOUR_AGENT_IP_1 | PM2: `atel-agent` |
| SDK Agent (Executor) | YOUR_AGENT_IP_2 | PM2: `atel-agent` |

## Platform 部署

### 1. 交叉编译

在 macOS 上为 Linux 构建：

```bash
cd atel-platform
GOOS=linux GOARCH=amd64 go build -o /tmp/atel-platform-linux cmd/server/main.go
```

### 2. 上传并重启

```bash
ssh root@YOUR_PLATFORM_IP "systemctl stop atel-platform"
scp /tmp/atel-platform-linux root@YOUR_PLATFORM_IP:/opt/atel-platform/atel-platform
ssh root@YOUR_PLATFORM_IP "chmod +x /opt/atel-platform/atel-platform && systemctl start atel-platform"
```

## SDK 部署

上传新的 SDK 文件并重启 PM2：

```bash
scp bin/atel.mjs root@YOUR_AGENT_IP:/usr/lib/node_modules/@lawrenceliang-btc/atel-sdk/bin/atel.mjs
ssh root@YOUR_AGENT_IP "pm2 restart atel-agent"
```

## 环境变量

### Platform（必需）

| 变量 | 描述 |
|----------|-------------|
| `ATEL_PORT` | HTTP 监听端口 |
| `ATEL_DB_HOST` | PostgreSQL 主机 |
| `ATEL_DB_USER` | PostgreSQL 用户 |
| `ATEL_DB_PASS` | PostgreSQL 密码 |
| `ATEL_DB_NAME` | PostgreSQL 数据库名 |
| `ATEL_OPERATOR_PRIVATE_KEY` | Operator 钱包私钥 |

### Platform（链相关）

| 变量 | 描述 |
|----------|-------------|
| `ATEL_SOLANA_RPC_URL` | Solana RPC 端点 |
| `ATEL_BASE_RPC_URL` | Base RPC 端点 |
| `ATEL_BSC_RPC_URL` | BSC RPC 端点 |
| `ATEL_ESCROW_MANAGER_ADDRESS` | Base EscrowManager 合约 |
| `ATEL_ESCROW_MANAGER_ADDRESS_BSC` | BSC EscrowManager 合约 |

### SDK

| 变量 | 描述 |
|----------|-------------|
| `ATEL_PLATFORM` | Platform URL（如 `https://api.atelai.org`） |
| `ATEL_DIR` | 身份目录（默认：当前目录的 `.atel`） |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token 用于通知 |

## 监控

```bash
# Platform 健康检查
curl https://api.atelai.org/health

# SDK 状态
ssh root@<server> "pm2 status"
```
