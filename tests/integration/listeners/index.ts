import { generateNode, rValue } from '../../../src';

const counter = rValue(0)

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