import { fdFor } from "../../src";

export function createSimpleFor() {
    return {
        tag: "div",
        children: [
            ...fdFor([1,2,3,4,5,6,7], {
                tag: "div",
                textValue: (e: any) => e,
            })
        ]
    }
}