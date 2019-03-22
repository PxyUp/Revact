import { Observer } from "../observer/observer";

export function fdIf(value?: boolean) {
    return new Observer(value)
}

export function fdReactiveValue(value: any) {
    return new Observer(value)
}

export function fdFor(arr: Array<any>, itemFn: ((e: any) => any) | object, inputs: {[key: string]: any} = {}, getter: (e: any) => any = (e) => e) {
    return arr.map((item: any) => {
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
        return {...itemFn, textValue: (itemFn as any).textValue(item)}
    })
}