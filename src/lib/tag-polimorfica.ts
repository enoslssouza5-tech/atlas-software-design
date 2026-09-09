import type { FunctionComponent, HTMLAttributes, ReactNode, Ref } from 'react';

/** Tags que os componentes de motion aceitam renderizar. */
export type TagPermitida =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'ul'
  | 'li'
  | 'p'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4';

type PropsGenericas = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
  'data-anim'?: string;
};

/**
 * TypeScript reduz a interseção de props de todas as tags a `never` quando o
 * componente é polimórfico. Este alias fixa um contrato único de props HTML
 * pro elemento escolhido, que é tudo que os componentes de motion usam.
 */
export type TagRenderizavel = FunctionComponent<PropsGenericas>;
