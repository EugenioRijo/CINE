import { SvgIconProps } from '@mui/material/SvgIcon';
import React from 'react';

declare module '@mui/icons-material/*' {
  const Icon: React.ComponentType<SvgIconProps>;
  export default Icon;
}

declare module '@mui/icons-material' {
  export * from '@mui/icons-material/*';
  export const Movie: React.ComponentType<SvgIconProps>;
  export const LocalActivity: React.ComponentType<SvgIconProps>;
  export const Info: React.ComponentType<SvgIconProps>;
  export const Person: React.ComponentType<SvgIconProps>;
  export const Menu: React.ComponentType<SvgIconProps>;
  export const TheaterComedy: React.ComponentType<SvgIconProps>;
  export const Brightness4: React.ComponentType<SvgIconProps>;
  export const Brightness7: React.ComponentType<SvgIconProps>;
} 