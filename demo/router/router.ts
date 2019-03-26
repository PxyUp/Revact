import { Component, FastDomNode, Router, createComponent, createRouter } from "../../src";

import { createCounter } from "../simple_counter/counter";
import { createIf } from "../simple_if/if";
import { createTimer } from "../timer/timer";
import { createTodo } from "../todo/todo";

export function createExampleRouter() {
    return createComponent(ExampleRouter)
}

class ExampleRouter extends Component {

    homeBtn = () => {
        Router.goToUrl('/')
    }

    timerClick = () => {
        Router.goToUrl('/timer')
    }

    todoClick = () => {
        Router.goToUrl('/todo')
    }

    ifClick = () => {
        Router.goToUrl('/if')
    }

    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "button",
                textValue: "Home",
                listeners: {
                    click: this.homeBtn
                }
            },
            {
                tag: "button",
                textValue: "Timer",
                listeners: {
                    click: this.timerClick
                }
            },
            {
                tag: "button",
                textValue: "Todo",
                listeners: {
                    click: this.todoClick
                }
            },
            {
                tag: "button",
                textValue: "If",
                listeners: {
                    click: this.ifClick
                }
            },
            createRouter({
                '/': {
                    component: createCounter,
                    title: "Home app",
                },
                '/timer': {
                    component: createTimer,
                    title: "Timer app",
                },
                '/todo': {
                    component: createTodo,
                    title: "Todo app",
                },
                '/if': {
                    component: createIf,
                    title: "If conditions",
                }
            }),
        ]
    }
}