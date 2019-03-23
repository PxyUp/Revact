import { createCounter } from "../simple_counter/counter";
import { fdFor } from "../../src";

export function createSimpleForContainer() {
    return {
        tag: "div",
        children: [
            fdFor([1,2,3,4,5,6,7], createCounter)
        ]
    }
}