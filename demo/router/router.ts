import { Component, FastDomNode, Router, createComponent, createRouter } from "../../src";

import { RouteParams } from "../../src/interfaces/router";
import { createCounter } from "../simple_counter/counter";
import { createIf } from "../simple_if/if";
import { createTimer } from "../timer/timer";
import { createTodo } from "../todo/todo";

export function createExampleRouter() {
    return createComponent(ExampleRouter)
}

export function createTextNode(inputs ={}) {
    return createComponent(TextNode,inputs)
}

class TextNode extends Component {

    template: FastDomNode = {
        tag: "textNode",
        textValue: this.inputs.id,
    }

    constructor(private inputs: any) {
        super();
    }
}

class ExampleRouter extends Component {

    goTextNodeBtn = () => {
        Router.goToUrl(`/textNode/${Math.random()* 500 | 0}`)  
    }

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
                textValue: "TextNode",
                listeners: {
                    click: this.goTextNodeBtn
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
                '/textNode/:id': {
                    component: createTextNode,
                    title: "Timer app",
                    resolver: (params: RouteParams) => Promise.resolve(params),
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