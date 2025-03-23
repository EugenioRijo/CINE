import 'styled-components';
import { CSSProp } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    currentTheme: 'light' | 'dark';
  }

  export interface StyledInterface {
    div: any;
    span: any;
    h1: any;
    button: any;
    [key: string]: any;
  }

  const styled: StyledInterface;
  export default styled;
}

declare module 'react' {
  interface Attributes {
    css?: CSSProp;
  }
}

declare module 'styled-components' {
  export interface ThemedStyledComponentsModule<T> {
    createGlobalStyle: any;
    css: any;
    keyframes: any;
    ThemeProvider: any;
    useTheme: any;
    withTheme: any;
    ServerStyleSheet: any;
    StyleSheetManager: any;
  }

  export interface ThemedBaseStyledInterface<T> {
    <Tag extends keyof JSX.IntrinsicElements>(
      tag: Tag
    ): ThemedStyledFunction<Tag, T>;
  }

  export type ThemedStyledInterface<T> = ThemedBaseStyledInterface<T>;

  export interface ThemedStyledFunction<Tag extends keyof JSX.IntrinsicElements, T> {
    <Props extends {}>(
      strings: TemplateStringsArray,
      ...interpolations: Array<Interpolation<Props & { theme: T }>>
    ): StyledComponent<Tag, T, Props>;
  }

  export type StyledComponent<
    Tag extends keyof JSX.IntrinsicElements,
    T,
    Props extends {} = {}
  > = React.ComponentType<JSX.IntrinsicElements[Tag] & Props>;

  export type Interpolation<P> = any;
} 