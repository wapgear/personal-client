/// <reference types="vite/client" />

import type { TypeText } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    textStatic?: Partial<TypeText>;
    linkButtonBackground?: string;
  }

  interface Palette {
    textStatic?: Partial<TypeText>;
    linkButtonBackground?: string;
  }

  interface PaletteTextChannel {
    dark: string;
  }
}

declare module '*.md' {
  import type { ComponentType } from 'react';
  export const frontmatter: Record<string, unknown>;
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const frontmatter: Record<string, unknown>;
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
