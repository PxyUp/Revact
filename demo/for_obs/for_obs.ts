import { Component, FastDomNode, createComponent, fdFor, fdIf, fdValue, generateNode } from "../../src";

import { Observer } from "../../src/observer/observer";
import { createCounters } from "../simple_counters_one_input/counters";

function createDiv(counter: Observer<number>) {
    return createComponent(DivBlock, counter)
}

class DivBlock extends Component {

    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "span",
                textValue: this.counter,
            },
            createCounters(this.counter)
        ]
    }

    constructor(private counter: Observer<number>) {
        super();
    }

    onInit() {
        console.log(`Init ${this.counter.value}`)
    }

    onDestroy() {
        console.log(`Destroy ${this.counter.value}`)
    }
}

const obs = fdValue([])

export function createObsFor() {
    return {
        tag: "div",
        children: [
            // Here we will on each changes obs, create createDiv with inputs { value: ...}
            fdFor(obs, createDiv, [(e: any) => fdValue(e)], (item: any) => item) // we do map from obs to reactive value
        ]
    }
}

setTimeout(() => {
    obs.value = [1, 2, 3, 4, 5]
    setTimeout(() => {
        obs.value = [1]
    }, 3000)
}, 3000)