import { createCounter } from "../simple_counter/counter";
import { rList } from "../../src";

export function createSimpleForContainer() {
    return {
        tag: "div",
        children: [
            rList([1,2,3,4,5,6,7], createCounter)
        ]
    }
}