import { Component, RevactNode, createComponent, rValue } from "../../src";

export function createStyles() {
    return createComponent(StylesComponent)
}

class StylesComponent extends Component {

    rValues = {
        divFirstStyle: rValue({
            'background-color': "#" + ((1 << 24) * Math.random() | 0).toString(16),
            'user-select': 'none',
        }),
        divSecondStyle: rValue("background-color: #" + ((1 << 24) * Math.random() | 0).toString(16) + ";user-select: none;")
    }

    onClick = () => {
        this.rValues.divFirstStyle.value = {
            ...this.rValues.divFirstStyle.value,
            'background-color': "#" + ((1 << 24) * Math.random() | 0).toString(16)
        }
    }

    onClickSecond = () => {
        this.rValues.divSecondStyle.value = "background-color: #"  + ((1 << 24) * Math.random() | 0).toString(16) + ";user-select: none;";
    }

    template: RevactNode = {
        tag: "div",
        children: [
            {
                tag: "div",
                styles: this.rValues.divFirstStyle,
                textValue: "Click me(change styles  object)",
                listeners: {
                    click: this.onClick
                }
            },
            {
                tag: "div",
                styles: this.rValues.divSecondStyle,
                textValue: "Click me(change css string)",
                listeners: {
                    click: this.onClickSecond
                },
            }
        ]
    }
}