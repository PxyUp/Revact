import { Observer } from './observer';

export class fdObject<T> {
  protected obsArr: Array<Observer<T>> = [];
  protected values: { [key: string]: T } = {};
  protected obs = new Observer(this.values, true);
  private isDestroyed = false;
  constructor(dict: { [key: string]: Observer<T> | T } = {}) {
    Object.keys(dict).forEach(key => {
      const item = dict[key] as Observer<T> | T;
      if (typeof item !== 'object') {
        this.values[key] = item;
        return;
      }
      this.obsArr.push(item as Observer<T>);
      this.values[key] = (item as Observer<T>).value;

      (item as Observer<T>).addSubscriber(value => {
        this.values[key] = value;
        this.obs.value = this.values;
      });
    });
  }

  get value() {
    return this.obs.value;
  }

  get observer() {
    return this.obs;
  }

  reInit() {
    this.isDestroyed = false;
    this.obs.reInit();
    this.obsArr.forEach(item => {
      item.reInit();
    });
  }

  destroy(force = false) {
    if (this.isDestroyed) {
      return;
    }
    this.obs.destroy(force);
    this.obsArr.forEach(item => {
      item.destroy(force);
    });
    this.isDestroyed = true;
  }
}
