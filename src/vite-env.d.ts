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
