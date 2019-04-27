import { Component, RevactNode, createComponent, rValue } from "../../src";

class Timer extends Component {
    private timer: number;
    
    rValues = {
        counter: rValue(0),
        clsList: rValue({
            "odd": true
        })
    }
    
    onInit() {
        this.rValues.counter.value = 0;
        const timer = () => {
            this.timer = window.setTimeout(() => {
                this.rValues.counter.value +=1
                this.rValues.clsList.value = this.rValues.counter.value % 2 === 0 ? {
                    "odd": true
                } : {
                    "odd": false
                }
                timer()
            }, 1000)
        }
        timer();
    }

    onDestroy() {
        clearTimeout(this.timer)
    }

    template: RevactNode = {
        tag: "div",
        classList: this.rValues.clsList,
        textValue: this.rValues.counter,
    }
}

export function createTimer() {
    return createComponent(Timer);
}

