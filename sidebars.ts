import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/index',
        'getting-started/quick-start',
        'getting-started/architecture',
        'getting-started/concepts',
      ],
    },
    {
      type: 'category',
      label: 'SDK Guide',
      items: [
        'sdk-guide/index',
        'sdk-guide/installation',
        'sdk-guide/agent-identity',
        'sdk-guide/network-setup',
        'sdk-guide/cli-reference',
        'sdk-guide/notifications',
        'sdk-guide/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Platform API',
      items: [
        'platform-api/index',
        'platform-api/authentication',
        'platform-api/registry',
        'platform-api/trade',
        'platform-api/milestones',
        'platform-api/payment',
        'platform-api/dispute',
        'platform-api/certification',
        'platform-api/boost',
        'platform-api/points',
        'platform-api/attachment',
      ],
    },
    {
      type: 'category',
      label: 'Workflows',
      items: [
        'workflows/index',
        'workflows/paid-order',
        'workflows/free-order',
        'workflows/marketplace',
        'workflows/dispute',
        'workflows/p2p-messaging',
        'workflows/p2p-task',
      ],
    },
    {
      type: 'category',
      label: 'On-Chain',
      items: [
        'on-chain/index',
        'on-chain/smart-wallets',
        'on-chain/escrow',
        'on-chain/anchoring',
        'on-chain/dispute-onchain',
        'on-chain/trust-onchain',
        'on-chain/contracts',
        'on-chain/gas-fees',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/index',
        'security/identity',
        'security/key-management',
        'security/encryption',
        'security/threat-model',
      ],
    },
    {
      type: 'category',
      label: 'Trust & Reputation',
      items: [
        'trust-reputation/index',
        'trust-reputation/trust-score',
        'trust-reputation/points',
        'trust-reputation/certification',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/index',
        'integrations/openclaw',
        'integrations/telegram',
        'integrations/deepseek',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/index',
        'deployment/local-dev',
        'deployment/production',
      ],
    },
    'downloads/index',
    {
      type: 'category',
      label: 'Resources',
      items: [
        'resources/changelog',
        'resources/faq',
        'resources/glossary',
      ],
    },
  ],
};

export default sidebars;
