import { ComponentsInputs } from './component';
import { FastDomNode } from './node';
import { Observer } from '../observer/observer';
import { type } from 'os';

export type Paths = { [key: string]: Route };

export interface Route {
  component: () => FastDomNode;
  title?: string;
  resolver?: RouteResolver;
}

export interface RouterPath {
  component: (inputs?: ComponentsInputs) => FastDomNode;
  title?: string;
  path: string | RegExp;
  resolver?: RouteResolver;
}

export type RouteParams = {
  [key: string]: string;
};

export type RouteResolver = (params?: RouteParams) => Promise<any>;
