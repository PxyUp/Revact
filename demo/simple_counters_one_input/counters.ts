import { Component, RevactNode, createComponent } from "../../src";

import { Observer } from "../../src/observer/observer";

export function createCounters(counter: Observer<number>) {
    return createComponent(CountersShared, counter);
}

class CountersShared extends Component {
    onClick = () => {
        this.counter.value += 1;
    }
    

    onInit() {
        console.log("init CountersShared")
    }

    onDestroy() {
        console.log("destroy CountersShared")
    }

    template: RevactNode = {
        tag: "button",
        textValue: this.counter,
        listeners: {
            click: this.onClick
        }
    }
    constructor(private counter: Observer<number>) {
        super()
    }
}