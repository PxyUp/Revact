import { composite, generateNode, rValue } from '../../../src';

const first = rValue(0)
const second = rValue(0)

const element = generateNode({
    tag: "div",
    children: [
        {
            tag: "div",
            classList: "first",
            textValue: first,
            listeners: {
                click: () => {
                    first.value += 1
                }
            },
        },
        {
            tag: "div",
            classList: "second",
            textValue: second,
            listeners: {
                click: () => {
                    second.value += 1
                }
            },
        },
        {
            tag: "p",
            textValue: composite([first, second], (a, b) => a + b)
        }
    ]
})
document.body.appendChild(element);