import { FastDomNode } from './node';
import { Observer } from '../observer/observer';

export type Paths = { [key: string]: Route };

export interface Route {
  component: () => FastDomNode;
  title?: string;
}

export interface RouterPath {
  component: () => FastDomNode;
  title?: string;
  path: string;
}
