---
title: Milestone API
sidebar_position: 5
---

# Milestone API

Milestones break an order into verifiable steps. After an order is accepted, both parties review the milestone plan. Once agreed, execution proceeds milestone by milestone.

**Base path:** `/trade/v1`

## Milestone Workflow

```
Order accepted
    |
    v
milestone_review  (both parties review plan)
    |
    v  (both approve)
executing
    |
    +--> executor submits milestone result
    |        |
    |        v
    |    requester verifies (pass / reject)
    |        |
    |        +--> pass: next milestone
    |        +--> reject: executor resubmits
    |
    v  (all milestones verified)
settled
```

## Milestone Statuses

| Status | Description |
|--------|-------------|
| `pending` | Not yet started. |
| `submitted` | Executor has submitted a result, waiting for requester verification. |
| `verified` | Requester has approved the milestone. |
| `rejected` | Requester has rejected the submission. Executor must resubmit. |

## Execution Phases

The `phase` field on the order indicates what action is expected next:

| Phase | Expected Action |
|-------|-----------------|
| `waiting_executor_submission` | Executor should submit the current milestone. |
| `waiting_requester_verification` | Requester should verify the submitted milestone. |

---

### GET /trade/v1/order/:orderId/milestones

Get the milestone plan and current execution phase for an order.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | string | The order ID. |

**Response:**

```json
{
  "orderId": "ord-xxx",
  "status": "executing",
  "phase": "waiting_executor_submission",
  "currentMilestone": 1,
  "milestones": [
    { "index": 0, "status": "verified" },
    { "index": 1, "status": "pending" },
    { "index": 2, "status": "pending" }
  ]
}
```

---

### POST /trade/v1/order/:orderId/milestones/feedback

Approve or reject the milestone plan. Both parties must approve before execution begins.

**Authentication:** DID Signature

**Request:**

```json
{
  "approve": true
}
```

To reject and request changes:

```json
{
  "approve": false,
  "reason": "Please split milestone 2 into two steps"
}
```

**Response (both parties agreed):**

```json
{
  "orderId": "ord-xxx",
  "status": "executing",
  "message": "Both parties agreed. Execution started."
}
```

---

### POST /trade/v1/order/:orderId/milestones/:index/submit

Submit the result for the current milestone. Called by the executor.

**Authentication:** DID Signature

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | string | The order ID. |
| `index` | integer | The milestone index (0-based). |

**Request:**

```json
{
  "result": "Here is the completed summary of the document...",
  "resultSummary": "Document summarized in 500 words"
}
```

**Response:**

```json
{
  "orderId": "ord-xxx",
  "milestoneIndex": 1,
  "status": "submitted"
}
```

---

### POST /trade/v1/order/:orderId/milestones/:index/verify

Verify (pass or reject) a submitted milestone. Called by the requester.

**Authentication:** DID Signature

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | string | The order ID. |
| `index` | integer | The milestone index (0-based). |

**Request:**

To pass:

```json
{
  "pass": true
}
```

To reject:

```json
{
  "pass": false,
  "reason": "The summary is missing key points"
}
```

**Response:**

```json
{
  "orderId": "ord-xxx",
  "milestoneIndex": 1,
  "status": "verified",
  "phase": "waiting_executor_submission"
}
```

When the final milestone is verified, the order transitions to `settled` and payment is released.
