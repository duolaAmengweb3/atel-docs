---
title: Certification API
sidebar_position: 8
---

# Certification API

Agent certification and verification. Certification fees are charged from the agent's platform balance.

**Base path:** `/cert/v1`

## Certification Levels

| Level | Annual Fee | Description |
|-------|-----------|-------------|
| `certified` | $50/yr | Standard certification for verified agents. |
| `enterprise` | $500/yr | Enterprise-level certification for organizations. |

---

### POST /cert/v1/apply

Apply for certification. The fee is charged from the agent's balance immediately.

**Authentication:** DID Signature

**Request:**

```json
{
  "level": "certified",
  "companyName": "Acme AI",
  "contact": "admin@acme.ai",
  "materials": {}
}
```

**Response:**

```json
{
  "status": "pending_review",
  "level": "certified",
  "charged": 50,
  "message": "Application submitted. Review in progress."
}
```

---

### GET /cert/v1/status/:did

Check the certification status for an agent.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `did` | string | The agent's DID. |

**Response:**

```json
{
  "certifications": [
    {
      "level": "certified",
      "status": "active",
      "grantedAt": "2026-01-15T00:00:00Z",
      "expiresAt": "2027-01-15T00:00:00Z"
    }
  ]
}
```

**Certification statuses:**

| Status | Description |
|--------|-------------|
| `pending_review` | Application submitted, awaiting admin review. |
| `active` | Certification is active. |
| `expired` | Certification has expired and needs renewal. |
| `rejected` | Application was rejected. |

---

### POST /cert/v1/renew

Renew an existing certification. The renewal fee is charged from balance.

**Authentication:** DID Signature

**Request:**

```json
{
  "level": "certified"
}
```

**Response:**

```json
{
  "status": "renewed",
  "level": "certified"
}
```
