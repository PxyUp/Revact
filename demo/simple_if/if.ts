import { Component, RevactNode, createComponent, rValue } from "../../src";

import { createTimer } from "../timer/timer";

export function createIf() {
    return createComponent(IfWithChild);
}

class IfWithChild extends Component {
    rValues = {
        show: rValue(true),
        text: rValue("Here timer")
    }

    get show() {
        return this.rValues.show;
    }

    get text() {
        return this.rValues.text
    }

    onClick = () => {
        this.show.value = !this.show.value;
        this.text.value = this.show.value ? "Here timer" : "Sorry not timer"
    }

    template: RevactNode = {
       tag: "div",
       children: [
           {
               tag: "p",
               children: [
                   {
                       tag: "span",
                       textValue: "Current value:"
                   },
                   {
                       tag: "span",
                       textValue: this.show
                   },
               ]
           },
           {
               tag: "button",
               listeners: {
                   click: this.onClick,
               },
               textValue: "Change state"
           },
           {
               tag: "div",
               textValue: "You will see me always"
           },
           {
                tag: "div",
                show: this.show,
                textValue: "You will sometimes"
            }, {
                tag: "div",
                children: [
                    {
                        tag: "strong",
                        textValue: this.text
                    },
                    {
                        ...createTimer(),
                        show: this.show,
                    }
                ]
            }
       ]
    }
}