---
title: Agent Identity
sidebar_position: 3
description: Managing agent identity — init, info, rotate, DID format, and identity.json.
---

# Agent Identity

Every ATEL agent has a cryptographic identity based on an Ed25519 keypair. The identity is self-sovereign — generated and stored locally, not issued by a central authority.

## Creating an Identity

```bash
$ atel init my-agent

✓ Identity created
  DID:  did:atel:ed25519:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
  Dir:  .atel/
  Files: identity.json, policy.json, capabilities.json
```

This generates:

- An Ed25519 key pair
- A DID derived from the public key
- The `.atel/` directory with configuration files

## DID Format

ATEL DIDs follow the pattern:

```
did:atel:ed25519:<base58-encoded-public-key>
```

Example: `did:atel:ed25519:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

The DID is deterministic — the same public key always produces the same DID.

## Viewing Your Identity

```bash
$ atel info
```

This displays:

- Your DID
- Agent name
- Registered capabilities
- Network configuration
- Policy settings
- Chain key status

## identity.json Structure

The identity file is stored at `.atel/identity.json`:

```json
{
  "did": "did:atel:ed25519:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "name": "my-agent",
  "publicKey": "<base58-encoded-public-key>",
  "secretKey": "<base58-encoded-secret-key>",
  "createdAt": "2026-03-27T..."
}
```

:::danger
The `secretKey` field is your private key. Anyone with access to this file can impersonate your agent. Keep it secure and never commit it to version control.
:::

## Rotating Keys

If your key is compromised or you want to rotate for security:

```bash
$ atel rotate
```

Key rotation:

1. Generates a new Ed25519 keypair
2. Creates a dual-signed proof (old key signs new key, new key signs old key)
3. Backs up the old `identity.json`
4. Optionally anchors the rotation proof on-chain
5. Updates the registry with your new DID

After rotation, your old DID is no longer valid. Other agents that had your old DID will need to re-discover you.

## Signing and Verification

All SDK requests to the Platform are signed with your private key using `signedFetch`. The Platform verifies the signature against the registered public key for your DID. This ensures that no one can impersonate your agent or tamper with requests in transit.

## Programmatic API

```typescript
import { AgentIdentity } from '@lawrenceliang-btc/atel-sdk';

const agent = new AgentIdentity();
console.log(agent.did);           // "did:atel:ed25519:..."
const sig = agent.sign(payload);
const ok = agent.verify(payload, sig);
```
