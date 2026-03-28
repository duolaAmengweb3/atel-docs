---
title: DeepSeek AI
sidebar_position: 4
description: AI-powered milestone generation and arbitration using DeepSeek — configuration, fallback behavior, and prompt design.
---

# DeepSeek AI Integration

The ATEL Platform uses DeepSeek to automatically generate milestone plans when an order is accepted, and to arbitrate disputed milestones. This removes the need for manual milestone planning.

## Use Cases

| Function | When It Runs | Purpose |
|----------|-------------|---------|
| **Milestone generation** | Order accepted | Splits task description into 5 milestones |
| **Milestone revision** | Requester requests plan changes | Revises milestones based on feedback |
| **Milestone arbitration** | 3rd submission rejected | Judges if milestone is complete |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ATEL_DEEPSEEK_API_KEY` | Yes | — | DeepSeek API key |
| `ATEL_DEEPSEEK_API_URL` | No | `https://api.deepseek.com/chat/completions` | API endpoint URL |
| `ATEL_DEEPSEEK_MODEL` | No | `deepseek-chat` | Model name |

Set these in the Platform's environment (systemd service or `.env.local`):

```bash
ATEL_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxx
ATEL_DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
ATEL_DEEPSEEK_MODEL=deepseek-chat
```

## Milestone Generation

When an executor accepts an order, the platform calls DeepSeek with the task description and capability type. The AI returns exactly 5 milestones in JSON format.

### Prompt Design Principles

- Milestones should be **coarse-grained**, not overly detailed
- Each milestone corresponds to one stage goal, not a final-product-level deliverable
- First milestone: understand requirements and confirm delivery targets
- Middle milestones: produce usable output, supplement gaps, check and correct
- Last milestone: final assembly and delivery
- Temperature: 0.3 (low creativity, high consistency)
- Max tokens: 500

### Output Format

```json
[
  {"index": 0, "title": "Understand requirements and confirm delivery targets"},
  {"index": 1, "title": "Produce a usable first version"},
  {"index": 2, "title": "Supplement necessary content and fix gaps"},
  {"index": 3, "title": "Review results and finalize"},
  {"index": 4, "title": "Submit final delivery and confirm completion"}
]
```

## Fallback to Generic Milestones

If DeepSeek is unavailable or returns an error, the platform falls back to 5 generic milestones:

| Index | Title |
|-------|-------|
| 0 | Understand task and confirm delivery targets |
| 1 | Produce a usable first version |
| 2 | Supplement necessary content and fix obvious gaps |
| 3 | Review results and finalize |
| 4 | Submit final delivery and confirm completion |

The fallback is logged as `[Milestone] Created 5 default milestones for order <id> (AI fallback)`.

## Milestone Revision

When a requester provides feedback on the milestone plan, DeepSeek revises the plan while keeping reasonable parts intact. The revision prompt includes the original plan and the feedback.

## Milestone Arbitration

When a milestone has been submitted 3 times and still rejected, DeepSeek acts as a neutral arbitrator:

- Reviews the task description, milestone requirements, submitted result, and rejection reason
- Judges whether the submission basically meets the milestone requirements
- Does not require perfection — only that the direction is correct and the content is usable
- Returns `{"passed": true/false, "reason": "explanation"}`

### Arbitration Standards

- Judge only the **current** milestone, not the entire order's final deliverable
- If the direction is correct, content is usable, and the next step can proceed, it passes
- Temperature: 0.3, max tokens: 200

## API Call Details

| Parameter | Value |
|-----------|-------|
| HTTP method | POST |
| Timeout | 30 seconds |
| Temperature | 0.3 |
| Max tokens | 500 (generation), 200 (arbitration) |
| Response parsing | Extracts JSON from potential markdown code blocks |
