import { Component, FastDomNode, Router, createComponent, createRouter } from "../../src";

import { createCounter } from "../simple_counter/counter";
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
            createRouter({
                '/': {
                    component: createCounter,
                },
                '/timer': {
                    component: createTimer,
                },
                '/todo': {
                    component: createTodo
                }
            }),
        ]
    }
}