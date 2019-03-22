import { Component, FastDomNode, createComponent, fdReactiveValue } from "../../src";

export function createCounter() {
    return createComponent(Counter);
}

class Counter extends Component {
    reactive = {
        counter: fdReactiveValue(0)
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