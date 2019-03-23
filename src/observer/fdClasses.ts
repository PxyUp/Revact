import { Observer } from "./observer";

export class fdClasses {
    private obsArr: Array<Observer<boolean>> = [];
    private styles:  { [key: string]: boolean } = {};
    private obs = new Observer(this.styles, true);
    constructor(classes: { [key: string]: Observer<boolean> | boolean } = {}) {
        Object.keys(classes).forEach((key) => {
            const item = classes[key];
            if (typeof item === 'boolean') {
                this.styles[key] = item;
                return;
            }
            this.obsArr.push(item)
            this.styles[key] = item.value;
            
            item.addSubscribers((value) => {
                this.styles[key] = value;
                this.obs.value = this.styles;
            })
        })
    }

    get value() {
        return this.obs;
    }

    reInit() {
        this.obs.reInit();
        this.obsArr.forEach((item) => {
            item.reInit();
        })
    }

    destroy() {
        this.obs.destroy();
        this.obsArr.forEach((item) => {
            item.destroy();
        })
    }
}