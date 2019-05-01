import { Observer } from '../observer/observer';
import { RevactNode } from '../interfaces/node';

export class rList<F extends any[]> {
  private parent: HTMLElement;
  constructor(
    private items: Observer<Array<any>> | Array<any>,
    private itemFn: (...args: Array<any>) => RevactNode,
    private inputs: F = [] as any,
    private keyFn?: (e: any) => string,
  ) {}

  setParent(parent: HTMLElement) {
    this.parent = parent;
  }
}
