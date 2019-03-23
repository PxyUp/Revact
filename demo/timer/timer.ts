import { Component, FastDomNode, createComponent, fdReactiveValue } from "../../src";

export function createTimer() {
    return createComponent(Timer);
}

class Timer extends Component {
    private timer: number;
    reactive = {
        counter: fdReactiveValue(0)
    }

    get counter() {
        return this.reactive.counter;
    }

    onClick = () => {
        this.counter.value += 1;
    }

    onInit() {
        const timer = () => {
            this.timer = window.setTimeout(() => {
                this.counter.value +=1
                timer()
            }, 1000)
        } 
        timer();
    }

    onDestroy() {
        clearTimeout(this.timer)
    }

    template: FastDomNode = {
        tag: "div",
        textValue: this.counter,
    }
}