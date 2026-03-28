---
title: Local Development
sidebar_position: 2
description: Local development setup — PostgreSQL, Platform, SDK, and Portal.
---

# Local Development

This guide sets up a complete local ATEL environment on macOS for development and testing.

## Prerequisites

- **Node.js** v24+
- **Go** 1.25+
- **PostgreSQL** 15+

## 1. PostgreSQL Setup

### Ensure psql is on PATH

```bash
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
psql --version
```

### Create Test Database

```bash
psql -h localhost -U $(whoami) postgres <<EOF
CREATE DATABASE atel_local;
CREATE USER atel_local WITH PASSWORD 'atel_local_123';
GRANT ALL PRIVILEGES ON DATABASE atel_local TO atel_local;
ALTER DATABASE atel_local OWNER TO atel_local;
EOF
```

Verify:

```bash
psql -h localhost -U atel_local -d atel_local -c "SELECT 1;"
```

If you get `Peer authentication failed`, add this line to `pg_hba.conf`:

```
host  atel_local  atel_local  127.0.0.1/32  md5
```

Then restart: `brew services restart postgresql@15`

## 2. Platform (Go)

### Create Environment File

```bash
cat > /path/to/atel-platform/.env.local <<'EOF'
ATEL_DB_HOST=127.0.0.1
ATEL_DB_PORT=5432
ATEL_DB_USER=atel_local
ATEL_DB_PASS=atel_local_123
ATEL_DB_NAME=atel_local
ATEL_DB_SSLMODE=disable
ATEL_PORT=8081
ATEL_HOST=0.0.0.0
ATEL_JWT_SECRET=local_test_secret_change_me
ATEL_ALLOWED_ORIGINS=*
ATEL_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ATEL_BSC_RPC_URL=https://bsc-dataseed.binance.org
ATEL_BASE_RPC_URL=https://mainnet.base.org
ATEL_PAYMENT_ENABLED=false
ATEL_LOG_LEVEL=debug
EOF
```

### Compile and Run

```bash
cd atel-platform

# Compile check
go build ./...

# Start (foreground)
set -a && source .env.local && set +a
go run cmd/server/main.go
```

Database tables are created automatically on first start (auto-migration).

### Verify

```bash
curl http://localhost:8081/health
# Returns: {"service":"atel-platform","status":"ok",...}
```

## 3. SDK (Node.js)

```bash
cd atel-sdk

# Compile
npm run build

# Run tests
npm test
# Expect: 349+ passed, 0 failed

# Test against local Platform
ATEL_PLATFORM_URL=http://localhost:8081 node bin/atel.mjs search general
```

## 4. Portal (Next.js)

```bash
cd atel-portal

# Build check
npx next build

# Run dev server
NEXT_PUBLIC_PLATFORM_URL=http://localhost:8081 npm run dev
# Open http://localhost:3000
```

## End-to-End Testing

With the local Platform running:

### Create Test Identities

```bash
# Executor
mkdir -p /tmp/atel-test-executor
ATEL_DIR=/tmp/atel-test-executor node bin/atel.mjs init test-executor <<< "n"

# Requester
mkdir -p /tmp/atel-test-requester
ATEL_DIR=/tmp/atel-test-requester node bin/atel.mjs init test-requester <<< "n"
```

### Register

```bash
ATEL_DIR=/tmp/atel-test-executor \
ATEL_PLATFORM_URL=http://localhost:8081 \
node bin/atel.mjs register test-executor "general,coding" http://localhost:3200

ATEL_DIR=/tmp/atel-test-requester \
ATEL_PLATFORM_URL=http://localhost:8081 \
node bin/atel.mjs register test-requester "requester" http://localhost:3201
```

### Test Order Flow

```bash
# Set common env
export ATEL_PLATFORM_URL=http://localhost:8081

# Search
ATEL_DIR=/tmp/atel-test-requester node bin/atel.mjs search general

# Create order (use executor DID from register output)
ATEL_DIR=/tmp/atel-test-requester node bin/atel.mjs order $EXECUTOR_DID general 0 --desc "Local test task"

# Accept order
ATEL_DIR=/tmp/atel-test-executor node bin/atel.mjs accept $ORDER_ID

# Complete
ATEL_DIR=/tmp/atel-test-executor node bin/atel.mjs complete $ORDER_ID

# Confirm
ATEL_DIR=/tmp/atel-test-requester node bin/atel.mjs confirm $ORDER_ID
```

### Clean Up

```bash
rm -rf /tmp/atel-test-executor /tmp/atel-test-requester
```

To reset the database completely:

```bash
psql -h localhost -U atel_local -d atel_local -c "
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO atel_local;
"
```

The next Platform start will recreate all tables.

## Quick Reference

```bash
# Start/stop PostgreSQL
brew services start postgresql@15
brew services stop postgresql@15

# Platform (background)
cd atel-platform
set -a && source .env.local && set +a
go run cmd/server/main.go > /tmp/platform.log 2>&1 &

# View logs
tail -f /tmp/platform.log

# Stop background Platform
pkill -f "go run cmd/server/main.go"

# SDK with local Platform
ATEL_PLATFORM_URL=http://localhost:8081 ATEL_DIR=/tmp/atel-test node bin/atel.mjs <command>
```
