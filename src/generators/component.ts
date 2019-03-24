import { FastDomNode } from '../interfaces/node';
import { Observer } from '../observer/observer';

export function createComponent(
  classProvider: any,
  inputs?: { [key: string]: Observer<any> | any },
): FastDomNode {
  const instance = new classProvider(inputs);
  instance.template.instance = instance;
  return instance.template;
}

export class Component {
  protected reactive: { [key: string]: Observer<any> } = {};
  protected template: FastDomNode;
  protected onDestroy() {}
  protected onInit() {}

  reInit() {
    Object.keys(this.reactive).forEach(key => {
      this.reactive[key].reInit();
    });
    this.onInit();
  }

  destroy() {
    Object.keys(this.reactive).forEach(key => {
      this.reactive[key].destroy();
    });
    this.onDestroy();
  }
}
