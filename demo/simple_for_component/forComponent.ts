import { nodeWrapper, rList } from "../../src";

import { createCounter } from "../simple_counter/counter";

export function createSimpleForContainer() {
    return nodeWrapper(rList([1, 2, 3, 4, 5, 6, 7], createCounter))
}