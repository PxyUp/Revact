import { Component, RevactNode, Router, createComponent, createRouter, rList, rValue, } from "../../src";

import { RouteParams } from "../../src/interfaces/router";
import { createCounter } from "../simple_counter/counter";
import { createIf } from "../simple_if/if";
import { createStyles } from "../styles/styles";
import { createTimer } from "../timer/timer";
import { createTodo } from "../todo/todo";

export function createExampleRouter() {
    return createComponent(ExampleRouter)
}

export function createTextNode(inputs = {}) {
    return createComponent(TextNode, inputs)
}

class TextNode extends Component {

    template: RevactNode = {
        tag: "textNode",
        textValue: this.inputs.id,
    }

    constructor(private inputs: any) {
        super();
    }
}

class ExampleRouter extends Component {

    list = [
        {
            name: 'Home',
            path: '/',
            click: () => {
                Router.goToUrl('/')
            }
        },
        {
            name: 'Timer',
            path: '/timer',
            click: () => {
                Router.goToUrl('/timer')
            }
        },
        {
            name: 'Todo',
            path: '/todo',
            click: () => {
                Router.goToUrl('/todo')
            }
        },
        {
            name: 'If',
            path: '/if',
            click: () => {
                Router.goToUrl('/if')
            }
        },
        {
            name: 'TextNode',
            path: `/textNode/*`,
            click: () => {
                Router.goToUrl(`/textNode/${Math.random() * 500 | 0}`)
            }
        },
        {
            name: 'Styles',
            path: `/styles`,
            click: () => {
                Router.goToUrl('/styles')
            }
        },
    ];

    template: RevactNode = {
        tag: "div",
        children: [
            rList(this.list, (item) => {
                const obs = rValue({
                    current: false
                });
                Router.getCurrentRoute().addSubscriber((value) => {
                    obs.value = { current: Router.isCurrentRoute(item.path) };
                })
                return {
                    tag: "button",
                    textValue: item.name,
                    classList: obs,
                    listeners: {
                        click: () => item.click()
                    }
                }
            }, [(e: any) => e]),
            createRouter({
                '/': {
                    component: createCounter,
                    title: "Home",
                },
                '/textNode/:id': {
                    component: createTextNode,
                    resolver: (params: RouteParams) => Promise.resolve({ ...params, title: `Route title ${params.id}` }),
                    title: (params: any) => `TextNode with ${params.title}`,
                },
                '/timer': {
                    component: createTimer,
                    title: "Timer",
                },
                '/todo': {
                    component: createTodo,
                    title: "Todo",
                },
                '/if': {
                    component: createIf,
                    title: "If",
                },
                '/styles': {
                    component: createStyles,
                    title: 'Styles'
                }
            }),
        ]
    }
}