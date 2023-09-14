import type {DocsThemeConfig} from 'nextra-theme-docs';

import Image from 'next/image';

const logo = (
  <div className="select-none flex flex-row items-center">
    <Image src="/logo128.png" width={32} height={32} alt="TypeSchema" />
    <span className="font-bold ltr:ml-2 rtl:mr-2">TypeSchema</span>
  </div>
);

const config: DocsThemeConfig = {
  darkMode: false,
  docsRepositoryBase: 'https://github.com/decs/typeschema/www',
  feedback: {content: null},
  footer: {component: null},
  gitTimestamp: null,
  head: (
    <>
      <link rel="icon" type="image/png" sizes="16x16" href="logo16.png" />
      <link rel="icon" type="image/png" sizes="24x24" href="logo24.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="logo32.png" />
      <link rel="icon" type="image/png" sizes="64x64" href="logo64.png" />
      <link rel="icon" type="image/png" sizes="128x128" href="logo128.png" />
    </>
  ),
  logo,
  primaryHue: 211,
  project: {link: 'https://github.com/decs/typeschema'},
  useNextSeoProps() {
    return {
      titleTemplate: '%s — TypeSchema',
    };
  }
};

export default config;
