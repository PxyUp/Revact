import { Component, ComponentsInputs, FastDomNode, createComponent, fdFor, fdObject, fdValue } from "../../src";

function createTodoItem(inputs: any) {
    return createComponent(TodoItem, inputs)
}

class TodoItem extends Component {

    get todoList() {
        return this.input.todoList
    }

    get index() {
        return this.input.index
    }
    
    get textValue() {
        return this.input.value
    }

    onClick = () => {
        this.todoList.value = this.todoList.value.filter((_: any, index: number) => index !== this.index)
    }

    template: FastDomNode = {
        tag: "div",
        children: [
            {
                tag: "span",
                textValue: this.textValue
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

    constructor(private input: ComponentsInputs) {
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
        this.todoList.value = [...this.todoList.value,  this.inputValue.value]
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
                    fdFor(this.todoList, createTodoItem, {
                        todoList: this.todoList,
                        index: (e: any, i: number) => i,
                        value: (e: number) => e 
                    }) 
                ]
            }
        ]
    }
}
