import { Component, RevactNode, createComponent, rList, rValue } from "../../src";

import { Observer } from "../../src/observer/observer";
import { createCounters } from "../simple_counters_one_input/counters";

function createDiv(counter: Observer<number>) {
    return createComponent(DivBlock, counter)
}

class DivBlock extends Component {

    template: RevactNode = {
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

const obs = rValue([])

export function createObsFor() {
    return {
        tag: "div",
        children: [
            // Here we will on each changes obs, create createDiv with inputs { value: ...}
            rList(obs, createDiv, [(e: any) => rValue(e)], (item: any) => item) // we do map from obs to rValues value
        ]
    }
}

setTimeout(() => {
    obs.value = [1, 2, 3, 4, 5]
    setTimeout(() => {
        obs.value = [1]
    }, 3000)
}, 3000)