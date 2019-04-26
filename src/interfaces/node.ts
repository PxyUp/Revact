import { Observer } from '../observer/observer';

export interface RevactNode {
  tag: string | 'textNode';
  show?: Observer<boolean> | boolean;
  attrs?: { [key: string]: any } | Observer<any>;
  props?: { [key: string]: any } | Observer<any>;
  styles?: string | { [key: string]: any } | Observer<any>;
  parent?: HTMLElement;
  classList?: string | Array<string> | { [key: string]: boolean } | Observer<any>;
  children?: Array<RevactNode | HTMLElement | Comment | Array<any>>;
  listeners?: { [key: string]: any | Array<any> };
  textValue?: Observer<any> | string;
  instance?: any;
  domNode?: HTMLElement | Text | DocumentFragment;
}
