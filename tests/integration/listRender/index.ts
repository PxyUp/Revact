import { Component, Observer, RevactNode, createComponent, generateNode, rList, rValue } from '../../../src';

const element = generateNode({
    tag: "div",
    children: [
        rList([1,2,3,4,5,6,7], {
            tag: "span",
            textValue: (e: any) => e,
        } as any)
    ]
})
document.body.appendChild(element);

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

const obs = rValue([])
const obsFn = rValue([])

export function createObsFor() {
    return {
        tag: "div",
        classList: 'list',
        children: [
            // Here we will on each changes obs, create createDiv with inputs { value: ...}
            rList(obs, createCounters, [(e: any) => rValue(e)]) // we do map from obs to reactive value
        ]
    };
}

document.body.appendChild(generateNode(createObsFor()));

export function createkeyFnObsFor() {
    return {
        tag: "div",
        classList: 'list_fn',
        children: [
            // Here we will on each changes obs, create createDiv with inputs { value: ...}
            rList(obs, createCounters, [(e: any) => rValue(e)], (item: any) => item) // we do map from obs to reactive value
        ]
    };
}

document.body.appendChild(generateNode(createkeyFnObsFor()));

setTimeout(() => {
    obs.value = [1, 2, 3, 4, 5]
    setTimeout(() => {
        obs.value = [1]
    }, 3000)
}, 3000)


setTimeout(() => {
    obsFn.value = [1, 2, 3, 4, 5]
    setTimeout(() => {
        obsFn.value = [1]
    }, 3000)
}, 3000)