import { ClassConstructor } from '../interfaces/component';
import { FastDomNode } from '../interfaces/node';
import { Observer } from '../observer/observer';
import { fdObject } from '../observer/fdObject';
import { removeAllListenersComponent } from '../misc/misc';

export function createComponent<T extends Component, F extends any[]>(
  classProvider: ClassConstructor<T>,
  ...args: F
): FastDomNode {
  const instance = new classProvider(...args);
  instance.template.instance = instance;
  return instance.template;
}

export class Component {
  public reactive: { [key: string]: Observer<any> } = {};
  public fdObjects: { [key: string]: fdObject<any> } = {};
  public fdStyles: { [key: string]: fdObject<any> | Observer<string> } = {};
  public template: FastDomNode;
  protected onDestroy() {}
  protected onInit() {}

  reInit() {
    Object.keys(this.fdStyles).forEach(key => {
      this.fdStyles[key].reInit();
    });
    Object.keys(this.fdObjects).forEach(key => {
      this.fdObjects[key].reInit();
    });
    Object.keys(this.reactive).forEach(key => {
      this.reactive[key].reInit();
    });
    this.onInit();
  }

  destroy(...args: any) {
    const force = args[0];
    if (force === true) {
      removeAllListenersComponent(this.template);
    }
    Object.keys(this.fdObjects).forEach(key => {
      this.fdObjects[key].destroy(...args);
    });
    Object.keys(this.reactive).forEach(key => {
      this.reactive[key].destroy(...args);
    });
    Object.keys(this.fdStyles).forEach(key => {
      this.fdStyles[key].destroy(...args);
    });
    this.onDestroy();
  }
}
