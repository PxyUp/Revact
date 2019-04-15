import { fdFor, generateNode } from '../../../src';

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