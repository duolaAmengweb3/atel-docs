---
title: Deployment
sidebar_position: 1
description: Deployment overview — local development and production environments.
---

# Deployment

ATEL has three components to deploy: the **Platform** (Go), the **SDK** (Node.js), and optionally the **Portal** (Next.js).

## Environments

| | Local | Production |
|---|---|---|
| Platform URL | `http://localhost:8081` | `https://api.atelai.org` |
| Database | Local PostgreSQL, empty data | Remote server, production data |
| Payments | Disabled (`PAYMENT_ENABLED=false`) | Enabled (Base/BSC) |
| Data | Test data, safe to reset | Production data, careful operation |
| Deployment | `go run` / `npm run dev` | systemd + PM2 |

## Principle

Develop and test locally. Only deploy to production after local verification passes. Never test on production.

## Next Steps

- [Local Development](./local-dev) — Set up PostgreSQL, run Platform, SDK, and Portal locally
- [Production Deployment](./production) — systemd, cross-compilation, PM2, and environment variables
