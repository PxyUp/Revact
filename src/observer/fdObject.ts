import { Observer } from './observer';

export class fdObject<T> {
  protected obsArr: Array<Observer<T>> = [];
  protected values: { [key: string]: T } = {};
  protected obs = new Observer(this.values, true);
  constructor(dict: { [key: string]: Observer<T> | T } = {}) {
    Object.keys(dict).forEach(key => {
      const item = dict[key] as Observer<T> | T;
      if (typeof item !== 'object') {
        this.values[key] = item;
        return;
      }
      this.obsArr.push(item as Observer<T>);
      this.values[key] = (item as Observer<T>).value;

      (item as Observer<T>).addSubscribers(value => {
        this.values[key] = value;
        this.obs.value = this.values;
      });
    });
  }

  get value() {
    return this.obs;
  }

  reInit() {
    this.obs.reInit();
    this.obsArr.forEach(item => {
      item.reInit();
    });
  }

  destroy(force = false) {
    this.obs.destroy(force);
    this.obsArr.forEach(item => {
      item.destroy(force);
    });
  }
}
