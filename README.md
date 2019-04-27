# Revact ![npm](https://img.shields.io/npm/v/revact.svg) [![CircleCI](https://circleci.com/gh/PxyUp/Revact/tree/master.svg?style=svg)](https://circleci.com/gh/PxyUp/Revact/tree/master)

Lightweight replacement of React + MobX + React Router (I hope in future Angular/Vue), which does not use the virtual DOM comparison, but the re-render of only the changed parts. Abandon the HTML template in favor of their interpretation in JS, give to us tree-shaking is components/templates and the speed of work increases since the time to parse the template is zero.

The library allows you to create quick and responsive interfaces using only JS / TS. With this you will get the minimum application size, speed and ease of development.

**[OFFICIAL BENCHMARK RESULTS(old name faster-dom)](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html)**

## Usage
```sh
yarn add revact@0.0.3-beta
```

```typescript
import { bootstrap, rValue } from 'revact';

bootstrap('#app', () => {
  const counter = rValue(0)
    return {
      tag: "div",
      textValue: counter,
      listeners: {
        click: () => {
          counter.value +=1
        }
      }
    }
  }
)
```

**[📺 DEMO](https://pxyup.github.io/Revact/)**
**[📺 DEMO at StackBlitz](https://stackblitz.com/edit/typescript-wgjbzf)**

## Features
1. Size - **4.1 kB** or **1.38 kB** gzipped.
2. The library rewrites only changes and only when it is necessary.
3. Performance - **going to guarantee 60 fps**.
4. Names of imported functions and classes are not finally and *can be discussed*.
5. There is **a tree-shaking for components and templates !!!**. 
6. **Router + Resolver** support!   

## Performance

**[CODE OF THE TESTS](https://github.com/PxyUp/js-framework-benchmark/pull/1/files)**

**[OFFICIAL BENCHMARK RESULTS(old name faster-dom](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html)**

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
6. Supports router

### TODO (contributing is appreciated)
1. Html transpiler (https://github.com/RyuuGan/html2FastDom)

> Help me please if you are interested.
