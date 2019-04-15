import { generateNode } from '../../../src';

const element = generateNode({
    tag: "textNode",
    textValue: "Test"
})
document.body.appendChild(element);