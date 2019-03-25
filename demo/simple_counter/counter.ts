import { Component, FastDomNode, createComponent, fdValue } from "../../src";

export function createCounter() {
    return createComponent(Counter);
}

class Counter extends Component {
    reactive = {
        counter: fdValue(0)
    }

    get counter() {
        return this.reactive.counter;
    }

    onClick = () => {
        this.counter.value += 1;
    }

    template: FastDomNode = {
        tag: "button",
        textValue: this.counter,
        listeners: {
            click: this.onClick
        }
    }
}