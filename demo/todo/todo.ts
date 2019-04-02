import { Component, FastDomNode, createComponent, fdFor, fdObject, fdValue } from "../../src";

import { Observer } from "../../src/observer/observer";

function createTodoItem(todoList: Observer<Array<string>>, value: string, index: number, ) {
    return createComponent<TodoItem, [Observer<Array<string>>,string, number]>(TodoItem, todoList, value, index)
}

class TodoItem extends Component {
    onClick = () => {
        this.todoList.value = this.todoList.value.filter((_: any, index: number) => index !== this.index)
    }

    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "span",
                textValue: this.value
            },
            {
                tag: "button",
                textValue: "remove",
                listeners: {
                    click: this.onClick,
                }
            }
        ]
    }

    constructor(private todoList: Observer<Array<string>>, private value: string, private index: number, ) {
        super();
    }
}

export function createTodo() {
    return createComponent(Todo)
}

class Todo extends Component {

    reactive = {
        inputValue: fdValue(''),
        todoList: fdValue([])
    }

    fdObjects = {
        inputValueProp: new fdObject({
            value: this.inputValue,
        }),
    }


    get inputValue() {
        return this.reactive.inputValue
    }

    get todoList() {
        return this.reactive.todoList
    }

    onInput = (e: any) => {
        this.inputValue.value = e.target.value;
    }


    onClick = () => {
        if (!this.inputValue.value) {
            return;
        }
        this.todoList.value = [...this.todoList.value, this.inputValue.value]
        this.inputValue.value = '';
    }

    inputBlock = {
        tag: "input",
        attrs: {
            placeholder: "Write here",
        },
        props: this.fdObjects.inputValueProp,
        listeners: {
            input: this.onInput,
        }
    }

    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "div",
                children: [
                    this.inputBlock,
                    {
                        tag: "button",
                        textValue: "add Todo",
                        listeners: {
                            click: this.onClick
                        }
                    }
                ],
            },
            {
                tag: "div",
                children: [
                    fdFor(this.todoList, createTodoItem, [
                        this.todoList,
                        (e: number) => e
                    ])
                ]
            }
        ]
    }
}
