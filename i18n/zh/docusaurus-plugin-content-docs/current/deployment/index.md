---
title: 部署
sidebar_position: 1
description: 部署概览 — 本地开发和生产环境。
---

# 部署

ATEL 有三个组件需要部署：**Platform**（Go）、**SDK**（Node.js）和可选的 **Portal**（Next.js）。

## 环境

| | 本地 | 生产 |
|---|---|---|
| Platform URL | `http://localhost:8081` | `https://api.atelai.org` |
| 数据库 | 本地 PostgreSQL，空数据 | 远程服务器，生产数据 |
| 支付 | 禁用（`PAYMENT_ENABLED=false`） | 启用（Base/BSC） |
| 数据 | 测试数据，可安全重置 | 生产数据，谨慎操作 |
| 部署 | `go run` / `npm run dev` | systemd + PM2 |

## 原则

在本地开发和测试。只有本地验证通过后才部署到生产环境。永远不要在生产环境测试。

## 下一步

- [本地开发](./local-dev) — 设置 PostgreSQL，本地运行 Platform、SDK 和 Portal
- [生产部署](./production) — systemd、交叉编译、PM2 和环境变量
