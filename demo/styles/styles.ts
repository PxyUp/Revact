import { Component, FastDomNode, createComponent, fdObject, fdValue } from "../../src";

export function createStyles() {
    return createComponent(StylesComponent)
}

class StylesComponent extends Component {

    reactive = {
        bgFirstColor: fdValue("#" + ((1 << 24) * Math.random() | 0).toString(16)),
        bgSecondColor: fdValue("background-color: #" + ((1 << 24) * Math.random() | 0).toString(16) + ";user-select: none;")
    }

    fdStyles = {
        divFirstStyle: new fdObject({
            'background-color': this.reactive.bgFirstColor,
            'user-select': 'none',
        }),
        divSecondStyle: this.reactive.bgSecondColor,
    }

    onClick = () => {
        this.reactive.bgFirstColor.value = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }

    onClickSecond = () => {
        this.reactive.bgSecondColor.value = "background-color: #"  + ((1 << 24) * Math.random() | 0).toString(16) + ";user-select: none;";
    }

    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "div",
                styles: this.fdStyles.divFirstStyle,
                textValue: "Click me(change styles  object)",
                listeners: {
                    click: this.onClick
                }
            },
            {
                tag: "div",
                styles: this.fdStyles.divSecondStyle,
                textValue: "Click me(change css string)",
                listeners: {
                    click: this.onClickSecond
                },
            }
        ]
    }
}