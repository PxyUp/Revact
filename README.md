# Faster Dom ![npm](https://img.shields.io/npm/v/faster-dom.svg)

Lightweight replacement of React + MobX + React Router (I hope in future Angular/Vue), which does not use the virtual DOM comparison, but the re-render of only the changed parts. Abandon the HTML template in favor of their interpretation in JS, give to us tree-shaking is components/templates and the speed of work increases since the time to parse the template is zero. Use `requestAnimationFrame` for change detection, which allows batch updates to do.

The library allows you to create quick and responsive interfaces using only JS / TS. With this you will get the minimum application size, speed and ease of development.

## Usage
```sh
yarn add faster-dom@0.0.18-alpha
```

*index.html*
```html
<div id="timer"></div>
```

*timer.ts*
```ts
import {
    Component,
    FastDomNode,
    createComponent,
    fdObject,
    fdIf,
    fdValue,
} from 'faster-dom';
// Extends your class from Component
class Timer extends Component {
    private timer: number;

    // Put here all reactive values, when component will be destroyed
    // They will be destroy automatically
    protected reactive = {
        // create reactive value
        // if you provide here object/array, you on change need always return new one, not link on previous
        counter: fdValue(0),
        // create reactive for true/false
        classOdd: fdIf(true),
    }
    // All fdObjects(for attrs/prop/classList binding) must be here for auto destroy
    fdObjects = {
        classList: new fdObject<boolean>({
            "odd": this.currentClass
        }),
    }

    // Create shortcuts, not required
    get counter () {
        return this.reactive.counter;
    }
    // Create shortcuts, not required
    get currentClass () {
        return this.reactive.classOdd;
    }

    onInit () {
        const timer = () => {
            this.timer = window.setTimeout(() => {
                this.counter.value += 1; // increase counter on '1'
                // If counter value odd then 'true'
                this.currentClass.value = this.counter.value % 2 === 0 ? true : false;
                timer();
            }, 1000);
        }

        timer();
    }

    onDestroy () {
        // Use destroy hook for clear timeout
        clearTimeout(this.timer);
    }
    // Provide template
    template: FastDomNode = {
        tag: 'div',
        // Create reactive class
        classList: this.fdObjects.classList,
        // Create reactive textValue
        textValue: this.counter,
    }
}

export function createTimer() {
    return createComponent(Timer);
}
```

*index.ts*
```ts
import { generateNode } from 'faster-dom';
import { createTimer } from './timer';

const timerContainer = document.getElementById('timer');
// create real node element from component
timerContainer.appendChild(generateNode(createTimer()));
```

**[📺 DEMO](https://pxyup.github.io/FastDom/)**
**[📺 DEMO at StackBlitz](https://stackblitz.com/edit/typescript-wgjbzf)**

## Features
1. Size - **4.1 kB** or **1.38 kB** gzipped.
2. The library rewrites only changes and only when it is necessary.
3. Performance - **going to guarantee 60 fps**.
4. Names of imported functions and classes are not finally and *can be discussed*.
5. There is **a tree-shaking for components and templates !!!**. 
6. **Router** support!   

## How it works
> Here will be good api

### Motivation

1. The performance of user interaction and interface speed.
2. The large size of top frameworks (Angular / React / VueJs).
3. Implements the component approach of creating interfaces with optimal speed, and the least number of a possible hacks.
4. The ability of support a tree-shaking in a component's templates.
5. Component should be splited by a file (template/reactive/listeners).

### Current Status

1. The support of events.
2. Lifecycle hooks `onInit` and `onDestroy`.
3. The support of inputs.
4. `if` condition and `for` directive.
5. Reactive classes and attributes bindings.


### TODO (contributing is appreciated)
1. Reactive styles.
2. Proper types annotation
3. Proper routing supports.

> Help me please if you are interested.
