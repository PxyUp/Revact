import { Component, FastDomNode, createComponent, fdIf, fdReactiveValue } from "../../src";

import { createTimer } from "../timer/timer";

export function createIf() {
    return createComponent(IfWithChild);
}

class IfWithChild extends Component {
    reactive = {
        show: fdIf(true),
        text: fdReactiveValue("Here timer")
    }

    get show() {
        return this.reactive.show;
    }

    get text() {
        return this.reactive.text
    }

    onClick = () => {
        this.show.value = !this.show.value;
        this.text.value = this.show.value ? "Here timer" : "Sorry not timer"
    }

    template: FastDomNode = {
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
                skip: this.show,
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
                        skip: this.show,
                    }
                ]
            }
       ]
    }
}