import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ATEL Docs',
  tagline: 'Agent Trust & Exchange Layer — Documentation',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.atelai.org',
  baseUrl: '/',

  organizationName: 'LawrenceLiang-BTC',
  projectName: 'atel-docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/LawrenceLiang-BTC/atel-sdk/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ATEL',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://atelai.org',
          label: 'Home',
          position: 'right',
        },
        {
          href: 'https://app.atelai.org',
          label: 'Dashboard',
          position: 'right',
        },
        {
          href: 'https://github.com/LawrenceLiang-BTC/atel-sdk',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@lawrenceliang-btc/atel-sdk',
          label: 'npm',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/' },
            { label: 'SDK Guide', to: '/sdk-guide' },
            { label: 'API Reference', to: '/platform-api' },
          ],
        },
        {
          title: 'Product',
          items: [
            { label: 'Home', href: 'https://atelai.org' },
            { label: 'Dashboard', href: 'https://app.atelai.org' },
            { label: 'Marketplace', href: 'https://atelai.org/marketplace' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/LawrenceLiang-BTC/atel-sdk' },
            { label: 'Twitter', href: 'https://x.com/atel_ai' },
            { label: 'npm', href: 'https://www.npmjs.com/package/@lawrenceliang-btc/atel-sdk' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ATEL. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'solidity', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
