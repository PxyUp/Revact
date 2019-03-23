import { Component, FastDomNode, createComponent, fdFor, fdReactiveValue } from "../../src";

function createDiv(inputs = {}) {
    return createComponent(DivBlock, inputs)
}

class DivBlock extends Component {
    
    template: FastDomNode = {
        tag: "div",
        textValue: this.inputs.value
    }

    constructor(private inputs: any) {
        super();
    }

    onInit() {
        console.log(`Init ${this.inputs.value}`)
    }

    onDestroy() {
        console.log(`Destroy ${this.inputs.value}`)
    }
}

const obs = fdReactiveValue([])

export function createObsFor() {
    return {
        tag: "div",
        children: [
            fdFor(obs, createDiv, { value: (e: any) => e })
        ]
    }
}

setTimeout(() => {
    obs.value = [1,2,3,4,5]
    setTimeout(() => {
        obs.value = [1]
    }, 3000)
}, 3000)