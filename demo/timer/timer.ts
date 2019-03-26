import { Component, FastDomNode, createComponent, fdIf, fdObject, fdValue } from "../../src";

class Timer extends Component {
    private timer: number;
    
    reactive = {
        counter: fdValue(0),
        classOdd: fdIf(true),
    }

    fdObjects = {
        classList: new fdObject<boolean>({
            "odd": this.currentClass
        }),
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
        classList: this.fdObjects.classList,
        textValue: this.counter,
    }
}

export function createTimer() {
    return createComponent(Timer);
}

