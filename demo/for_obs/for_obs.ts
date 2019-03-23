import { Component, FastDomNode, createComponent, fdFor, fdReactiveValue } from "../../src";

import { createCounter } from "../simple_counter/counter";
import { createCounters } from "../simple_counters_one_input/counters";

function createDiv(inputs = {}) {
    return createComponent(DivBlock, inputs)
}

class DivBlock extends Component {

    get counter() {
        return this.inputs.value;
    }
    
    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "span",
                textValue: this.counter,
            },
            createCounters({ counter: this.counter})
        ]
    }

    constructor(private inputs: any) {
        super();
    }

    onInit() {
        console.log(`Init ${this.counter.value}`)
    }

    onDestroy() {
        console.log(`Destroy ${this.counter.value}`)
    }
}

const obs = fdReactiveValue([])

export function createObsFor() {
    return {
        tag: "div",
        children: [
            fdFor(obs, createDiv, { value: (e: any) => fdReactiveValue(e) })
        ]
    }
}

setTimeout(() => {
    obs.value = [1,2,3,4,5]
    setTimeout(() => {
        obs.value = [1]
    }, 3000)
}, 3000)