import { Component, FastDomNode, createComponent, fdIf, fdObject, fdReactiveValue } from "../../src";

export function createExampleAttr() {
    return createComponent(DynamicAttr)
}

class DynamicAttr extends Component {

    reactive = {
        src: fdReactiveValue("https://www.w3schools.com/html/pic_trulli.jpg")
    }

    get src() {
        return this.reactive.src
    }

    onClick = () => {
        this.src.value = "https://www.w3schools.com/html/img_girl.jpg"
    }

    btnClick = () => {
        alert("hey")
    }

    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "button",
                textValue: "Click me",
                listeners: {
                    click: this.onClick
                }
            },
            {
                tag: "span",
                textValue: this.src
            },
            {
                tag: "img",
                attrs: new fdObject({
                    src: this.src
                })
            }
        ]
    }
}