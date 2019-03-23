# Faster Dom
Lightweight replacement of React (I hope in future Angular/Vue), which does not use the virtual DOM comparison, but the re-render of only the changed parts. Abandon the HTML template in favor of their interpretation in JS, give to us tree-shaking is components/templates and the speed of work increases since the time to parse the template is zero. Use `requestAnimationFrame` for change detection, which allows batch updates to do.

The library allows you to create quick and responsive interfaces using only JS / TS. With this you will get the minimum application size, speed and ease of development.

# How use
```bash
yarn add faster-dom@0.0.2-alpha
```

**[📺 DEMO](https://pxyup.github.io/FastDom/)**

*index.html*
```html
 <div id="timer">
 </div>
```
*index.ts*
```ts
import { generateNode } from 'faster-dom';
import { createTimer } from "./timer";

const timerContainer = document.getElementById("timer")
timerContainer.appendChild(generateNode(createTimer()))
```

*timer.ts*
```ts
import { Component, FastDomNode, createComponent, fdObject, fdIf, fdReactiveValue } from "faster-dom";

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
        classList: new fdObject({
            "odd": this.currentClass // will add class if obs have true/value
        }),
        textValue: this.counter,
    }
}
```

# About library
1. Size - **1.38 kB**  gzip, **4.1 kB** no gzip
2. The library rewrites only the changes and only where necessary, as a virtual house, only there is no comparison process
3. Speed - **Trying to guarantee 60 fps**
4. Import naming of function/classes not finally *can be discussed*
5. **Tree-shaking in components and in template !!!**

# How it work


# Motivation
1. Speed of user interactive/Interface speed
2. The large size of the Angular / React / VueJs
3. Make a component approach to creating interfaces with optimal speed, and with the least number of possible hacks
4. Supports tree-shaking in component template
5. Component must/can be splited by file (template/reactive/listeners)

# Current Status
1. Event supports
2. Life cycle(OnInit, OnDestroy)
3. Inputs supports
4. If conditions/ For directive
5. Class dynamic/ Attribute binding
6. Outputs
 
# Future (you can help)
1. Dynamic props
2. Routing

## Help me please if interesting
