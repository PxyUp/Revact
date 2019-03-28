import { Component, FastDomNode, Router, createComponent, createRouter, fdFor, fdIf, fdObject, matchRoute } from "../../src";

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

    template: FastDomNode = {
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

    template: FastDomNode = {
        tag: "div",
        children: [
            fdFor(this.list, (el) => {
                const obs = fdIf(false);
                Router.getCurrentRoute().addSubscriber((value) => {
                    obs.value = Router.isCurrentRoute(el.item.path);
                })
                return {
                    tag: "button",
                    textValue:  el.item.name,
                    classList: new fdObject({
                        current: obs,
                    }),
                    listeners: {
                        click: () => el.item.click()
                    }
                }
            }, {
                item: (e: any) => e
            }),
            createRouter({
                '/': {
                    component: createCounter,
                    title: "Home",
                },
                '/textNode/:id': {
                    component: createTextNode,
                    title: "TextNode with router param",
                    resolver: (params: RouteParams) => Promise.resolve(params),
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