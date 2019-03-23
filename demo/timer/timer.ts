import { Component, FastDomNode, createComponent, fdClasses, fdIf, fdReactiveValue } from "../../src";

export function createTimer() {
    return createComponent(Timer);
}

class Timer extends Component {
    private timer: number;
    
    reactive = {
        counter: fdReactiveValue(0),
        classOdd: fdIf(true),
    }

    get counter() {
        return this.reactive.counter;
    }

    get currentClass(){
        return this.reactive.classOdd
    }

    onInit() {
        const timer = () => {
            this.timer = window.setTimeout(() => {
                this.counter.value +=1
                this.currentClass.value = this.counter.value % 2 === 0 ? true : false 
                timer()
            }, 1000)
        } 
        timer();
    }

    onDestroy() {
        clearTimeout(this.timer)
    }

    template: FastDomNode = {
        tag: "div",
        classList: new fdClasses({
            "odd": this.currentClass
        }),
        textValue: this.counter,
    }
}