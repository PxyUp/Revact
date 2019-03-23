import { Observer } from "../observer/observer";
import { generateNode } from "../generators/node";
import { removeAllChild } from "./misc";

export function fdIf(value?: boolean) {
    return new Observer(value)
}

export function fdReactiveValue(value: any) {
    return new Observer(value)
}

export function fdFor(iteration: Observer<Array<any>> | Array<any>, itemFn: ((e: any) => any) | object, inputs: { [key: string]: any } = {}, getter: (e: any) => any = (e) => e) {
    if (Array.isArray(iteration)) {
        return iteration.map((item: any) => {
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
        })
    }
    let responseArray = iteration.value.map((item: any) => {
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
    })
    
    iteration.addSubscribers((value) => {
        let parent: HTMLElement = (responseArray as any)._parent;
        if(responseArray.length) {
            responseArray.forEach((item) => {
                if (item.instance) {
                    item.instance.destroy();
                }
            })
            removeAllChild(parent)
        }
        if (!value.length) {
            return;
        }
        responseArray = value.map((item: any) => {
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
        })
        
        responseArray.forEach((item) => {
            parent.appendChild(generateNode(item))
        });

        (responseArray as any)._parent = parent; 

    })
    return responseArray;
}