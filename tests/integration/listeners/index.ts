import { fdValue, generateNode } from '../../../src';

const counter = fdValue(0)

const element = generateNode({
    tag: "div",
    textValue: "Click",
    listeners: {
        click: () => {
            counter.value+=1
        }
    },
    children: [
        {
            tag: "span",
            textValue: counter
        }
    ]
})
document.body.appendChild(element);