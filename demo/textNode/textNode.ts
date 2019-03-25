import { Component, FastDomNode, createComponent, fdValue } from "../../src";

class TextComponent extends Component {
    reactive = {
        counter: fdValue(-10),
    }

    get counter() {
        return this.reactive.counter;
    }

    onClick = () => {
        this.counter.value += 1
    }

    template: FastDomNode = {
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