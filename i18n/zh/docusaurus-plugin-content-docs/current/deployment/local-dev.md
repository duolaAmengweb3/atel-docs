---
title: 本地开发
sidebar_position: 2
description: 本地开发设置 — PostgreSQL、Platform、SDK 和 Portal。
---

# 本地开发

本指南在 macOS 上搭建完整的本地 ATEL 开发环境。

## 前置要求

- **Node.js** v24+
- **Go** 1.25+
- **PostgreSQL** 15+

## 1. PostgreSQL 设置

```bash
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
psql --version
```

### 创建测试数据库

```bash
psql -h localhost -U $(whoami) postgres <<EOF
CREATE DATABASE atel_local;
CREATE USER atel_local WITH PASSWORD 'atel_local_123';
GRANT ALL PRIVILEGES ON DATABASE atel_local TO atel_local;
ALTER DATABASE atel_local OWNER TO atel_local;
EOF
```

## 2. Platform (Go)

创建环境文件、编译并运行。数据库表在首次启动时自动创建（自动迁移）。

```bash
cd atel-platform
set -a && source .env.local && set +a
go run cmd/server/main.go
```

## 3. SDK (Node.js)

```bash
cd atel-sdk
npm run build
npm test
```

## 4. Portal (Next.js)

```bash
cd atel-portal
NEXT_PUBLIC_PLATFORM_URL=http://localhost:8081 npm run dev
```

## 端到端测试

使用本地 Platform 创建测试身份、注册并测试订单流程。详见英文文档的完整命令示例。
