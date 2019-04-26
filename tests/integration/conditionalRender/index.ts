import { generateNode, rValue } from '../../../src';

const counter = rValue(false)

const element = generateNode({
    tag: "div",
    textValue: "Click",
    listeners: {
        click: () => {
            counter.value=!counter.value
        }
    },
    children: [
        {
            tag: "span",
            textValue: "You see me",
            show: counter,
        }
    ]
})
document.body.appendChild(element);