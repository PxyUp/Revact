import { Component, RevactNode, createComponent, rValue } from "../../src";

export function createCounter() {
    return createComponent(Counter);
}

class Counter extends Component {
    width = 100;

    rValues = {
        counter: rValue(0),
    }

    get counter() {
        return this.rValues.counter;
    }

    onClick = () => {
        this.counter.value += 1;
    }

    template: RevactNode = {
        tag: "button",
        textValue: this.counter,
        listeners: {
            click: this.onClick
        }
    }
}