export class Observer<T> {
  private setterTimeout: number = null;
  private subscribers: Array<(e: T) => void> = [];
  private firstState: T;
  private isDestroy = false;
  constructor(private _value?: T, private forces: boolean = false) {
    this.firstState = _value;
  }

  get value() {
    return this._value;
  }

  destroy(force = false) {
    if (this.setterTimeout) {
      cancelAnimationFrame(this.setterTimeout);
    }
    this.isDestroy = true;
    if (force) {
      delete this.subscribers;
    }
  }

  reInit() {
    this.isDestroy = false;
    this.value = this.firstState;
  }

  addSubscribers(subscriber: (e: T) => void) {
    if (this.isDestroy) {
      return;
    }
    this.subscribers.push(subscriber);
  }

  set value(value: T) {
    if (this.isDestroy) {
      return;
    }
    if (this._value === value && !this.forces) {
      return;
    }
    this._value = value;
    if (this.subscribers.length) {
      if (this.setterTimeout) {
        cancelAnimationFrame(this.setterTimeout);
      }
      this.setterTimeout = requestAnimationFrame(() => {
        this.subscribers.forEach(sub => {
          sub(value);
        });
      });
    }
  }
}
