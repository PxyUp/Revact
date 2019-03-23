import { Component, FastDomNode, createComponent } from "../../src";

export function createCounters(inputs: any) {
    return createComponent(CountersShared, inputs);
}

class CountersShared extends Component {
    get counter() {
        return this.input.counter;
    }

    onClick = () => {
        this.counter.value += 1;
    }
    

    onInit() {
        console.log("init CountersShared")
    }

    onDestroy() {
        console.log("destroy CountersShared")
    }

    template: FastDomNode = {
        tag: "button",
        textValue: this.counter,
        listeners: {
            click: this.onClick
        }
    }
    constructor(private input: any) {
        super()
    }
}