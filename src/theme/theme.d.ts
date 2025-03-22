import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
    applyStyles?: (mode: string, styles: any) => any;
  }
  interface ThemeOptions {
    applyStyles?: (mode: string, styles: any) => any;
  }
} 