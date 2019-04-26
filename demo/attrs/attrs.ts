import { Component, RevactNode, composite, createComponent, rValue } from "../../src";

export function createExampleAttr() {
    return createComponent(DynamicAttr)
}

class DynamicAttr extends Component {
    imgAttrs = rValue({ src: "https://www.w3schools.com/html/pic_trulli.jpg" });
    btnAttrs = rValue({ disabled: false });

    rValues = {
        imgAttrs: this.imgAttrs,
        btnAttrs: this.btnAttrs,
        imgSrc: composite([this.imgAttrs], (attrs) => attrs.src),
        disabledValue: composite([this.btnAttrs], (attrs) => attrs.disabled),
    } as any;

    onClick = () => {
        this.rValues.imgAttrs.value = {
            src: "https://www.w3schools.com/html/img_girl.jpg"
        }
    }

    changeBtnClick = () => {
        this.rValues.btnAttrs.value = {
            disabled: !this.rValues.btnAttrs.value.disabled
        }
    }

    btnClick = () => {
        alert("hey")
    }

    template: RevactNode = {
        tag: "div",
        children: [
            {
                tag: "div",
                children: [
                    {
                        tag: "span",
                        textValue: "Current state:"
                    },
                    {
                        tag: "span",
                        textValue: this.rValues.disabledValue
                    },
                    {
                        tag: "button",
                        attrs: this.rValues.btnAttrs,
                        textValue: "I am button",
                        listeners: {
                            click: this.btnClick
                        }
                    },
                    {
                        tag: "button",
                        textValue: "Click me to change",
                        listeners: {
                            click: this.changeBtnClick
                        }
                    }
                ]
            },
            {
                tag: "button",
                textValue: "Click me",
                listeners: {
                    click: this.onClick
                }
            },
            {
                tag: "span",
                textValue: this.rValues.imgSrc
            },
            {
                tag: "div",
                children: [
                    {
                        tag: "img",
                        attrs: this.rValues.imgAttrs
                    }
                ]
            }
        ]
    }
}