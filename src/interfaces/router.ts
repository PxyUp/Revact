import { RevactNode } from './node';

export type Paths = { [key: string]: Route };

export interface Route {
  component: () => RevactNode;
  title?: ((params?: RouteParams) => string) | string;
  resolver?: RouteResolver;
}

export interface RouterPath {
  component: (...args: Array<any>) => RevactNode;
  title?: ((params?: RouteParams) => string) | string;
  path: string | RegExp;
  resolver?: RouteResolver;
}

export type RouteParams = any;

export type RouteResolver = (params?: RouteParams) => Promise<any>;
