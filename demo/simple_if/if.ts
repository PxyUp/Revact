import { Component, FastDomNode, createComponent, fdIf, fdReactiveValue } from "../../src";

export function createIf() {
    return createComponent(IfWithChild);
}

class IfWithChild extends Component {
    reactive = {
        show: fdIf(true)
    }

    get show() {
        return this.reactive.show;
    }

    onClick = () => {
        this.show.value = !this.show.value;
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
                   }
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
            }
       ]
    }
}