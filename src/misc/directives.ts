import { callDeep, removeAllChild } from "./misc";

import { Observer } from "../observer/observer";
import { generateNode } from "../generators/node";

export function fdIf(value?: boolean) {
    return new Observer(value)
}

export function fdReactiveValue(value: any) {
    return new Observer(value)
}

const mapFn = (item: any, itemFn: ((e: any) => any) | object, inputs: { [key: string]: any } = {}) => {
    if (typeof itemFn === 'function') {
        const inputOverride = {} as any
        Object.keys(inputs).forEach((key) => {
            const value = inputs[key];
            if (typeof value === 'function') {
                inputOverride[key] = value(item)
            } else {
                inputOverride[key] = value
            }
        })
        return itemFn(inputOverride)
    }
    return { ...itemFn, textValue: (itemFn as any).textValue(item) }
}

export function fdFor(iteration: Observer<Array<any>> | Array<any>, itemFn: ((e: any) => any) | object, inputs: { [key: string]: any } = {}) {
    if (Array.isArray(iteration)) {
        return iteration.map((item: any) => mapFn(item, itemFn, inputs))
    }
    let responseArray = iteration.value.map((item: any) => mapFn(item, itemFn, inputs));

    iteration.addSubscribers((value) => {
        let parent: HTMLElement = (responseArray as any)._parent;
        if (responseArray.length) {
            responseArray.forEach((item) => {
                callDeep(item, 'destroy', true)
            })
            removeAllChild(parent)
        }
        if (!value.length) {
            return;
        }
        responseArray = value.map((item: any) => mapFn(item, itemFn, inputs));

        responseArray.forEach((item) => {
            parent.appendChild(generateNode(item))
        });

        (responseArray as any)._parent = parent;

    })
    return responseArray;
}