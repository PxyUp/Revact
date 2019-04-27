import { asyncCall, removeAllListenersComponent } from '../misc/misc';

import { ClassConstructor } from '../interfaces/component';
import { Observer } from '../observer/observer';
import { RevactNode } from '../interfaces/node';

export function createComponent<T extends ClassConstructor<any>>(
  classProvider: T,
  ...args: T extends new (...args: infer A) => any ? A : never
): RevactNode {
  const instance = new classProvider(...args);
  instance.template.instance = instance;
  return instance.template;
}

export class Component {
  public rValues: { [key: string]: Observer<any> } = {};
  public template: RevactNode;
  protected onDestroy() {}
  protected onInit() {}

  reInit() {
    Object.keys(this.rValues).forEach(key => {
      this.rValues[key].reInit();
    });
    this.onInit();
  }

  destroy(...args: any) {
    const force = args[0];
    Object.keys(this.rValues).forEach(key => {
      this.rValues[key].destroy(...args);
    });
    this.onDestroy();
    if (force === true) {
      removeAllListenersComponent(this.template);
      delete this.rValues;
      delete this.template;
    }
  }
}
