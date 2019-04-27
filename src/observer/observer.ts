export class Observer<T> {
  private _subs: Set<(e: T) => void> = new Set();
  private firstState: T;
  private isDestroy = false;
  constructor(private _value?: T, private forces: boolean = false) {
    this.firstState = _value;
  }

  get value() {
    return this._value;
  }

  destroy(force = false) {
    if (this.isDestroy) {
      return;
    }
    if (force) {
      this._subs.clear();
    }
    this.isDestroy = true;
  }

  reInit() {
    this.isDestroy = false;
    this.value = this.firstState;
  }

  addSubscriber(subscriber: (e: T) => void) {
    if (this.isDestroy) {
      return;
    }
    this._subs.add(subscriber);
    subscriber(this._value);
  }

  removeSubscriber(subscriber: (e: T) => void) {
    if (this._subs.has(subscriber)) {
      this._subs.delete(subscriber);
    }
  }

  set value(value: T) {
    if (this.isDestroy) {
      return;
    }
    if (this._value === value && !this.forces) {
      return;
    }
    this._value = value;
    this._subs.forEach(sub => sub(value));
  }
}
