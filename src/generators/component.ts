import { ClassConstructor } from '../interfaces/component';
import { Observer } from '../observer/observer';
import { RevactNode } from '../interfaces/node';
import { removeAllListenersComponent } from '../misc/misc';

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
    if (force === true) {
      removeAllListenersComponent(this.template);
    }
    this.onDestroy();
  }
}
