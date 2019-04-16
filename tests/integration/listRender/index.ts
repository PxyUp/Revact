import { fdFor, generateNode, Component, FastDomNode, Observer, fdValue, createComponent } from '../../../src';

const element = generateNode({
    tag: "div",
    children: [
        fdFor([1,2,3,4,5,6,7], {
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

    template: FastDomNode = {
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

const obs = fdValue([])
const obsFn = fdValue([])

export function createObsFor() {
    return {
        tag: "div",
        classList: 'list',
        children: [
            // Here we will on each changes obs, create createDiv with inputs { value: ...}
            fdFor(obs, createCounters, [(e: any) => fdValue(e)]) // we do map from obs to reactive value
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
            fdFor(obs, createCounters, [(e: any) => fdValue(e)], (item: any) => item) // we do map from obs to reactive value
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