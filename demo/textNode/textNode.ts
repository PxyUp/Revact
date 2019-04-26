import { Component, RevactNode, createComponent, rValue } from "../../src";

class TextComponent extends Component {
    rValues = {
        counter: rValue(-10),
    }

    get counter() {
        return this.rValues.counter;
    }

    onClick = () => {
        this.counter.value += 1
    }

    template: RevactNode = {
        tag: "div",
        children: [
            {
                tag: "button",
                textValue: "Click me",
                listeners: {
                    click: this.onClick
                },
            },
            {
                tag: "textNode",
                textValue: this.counter
            }
        ]
    }
}

export function createTextNode() {
    return createComponent(TextComponent)
}