import { Component, RevactNode, createComponent, rList, rValue } from "../../src";

import { Observer } from "../../src/observer/observer";

function createTodoItem(todoList: Observer<Array<string>>, value: any) {
    return createComponent(TodoItem, todoList, value)
}

class TodoItem extends Component {
    onClick = () => {
        this.todoList.value = this.todoList.value.filter((item: any) => item !== this.value)
    }

    template: RevactNode = {
        tag: "div",
        children: [
            {
                tag: "span",
                textValue: this.value.label
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

    constructor(private todoList: Observer<Array<string>>, private value: any) {
        super();
    }
}

export function createTodo() {
    return createComponent(Todo)
}

class Todo extends Component {

    rValues = {
        inputProps: rValue({
            value: '',
        }),
        todoList: rValue([])
    }

    onInput = (e: any) => {
        this.rValues.inputProps.value = {
            value: e.target.value
        };
    }


    onClick = () => {
        if (!this.rValues.inputProps.value.value) {
            return;
        }
        this.rValues.todoList.value = [...this.rValues.todoList.value, { label: this.rValues.inputProps.value.value}]
        this.rValues.inputProps.value = {
            value: ''
        };
    }

    inputBlock = {
        tag: "input",
        attrs: {
            placeholder: "Write here",
        },
        props: this.rValues.inputProps,
        listeners: {
            input: this.onInput,
        }
    }

    template: RevactNode = {
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
                    rList(this.rValues.todoList, createTodoItem, [
                        this.rValues.todoList,
                        (e: any) => e
                    ])
                ]
            }
        ]
    }
}
