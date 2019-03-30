import { bootstrap, fdValue } from "../src";

import { createCounter } from "./simple_counter/counter";
import { createCounters } from "./simple_counters_one_input/counters";
import { createExampleAttr } from "./attrs/attrs";
import { createExampleRouter } from "./router/router";
import { createIf } from "./simple_if/if";
import { createObsFor } from "./for_obs/for_obs";
import { createSimpleFor } from "./simple_for/for";
import { createSimpleForContainer } from "./simple_for_component/forComponent";
import { createStyles } from "./styles/styles";
import { createTextNode } from "./textNode/textNode";
import { createTimer } from "./timer/timer";
import { createTodo } from "./todo/todo";
import { Observer } from "../src/observer/observer";

// Simple Styles
bootstrap('#styles', createStyles);

// Simple Todo
bootstrap('#todo', createTodo);

// Simple timer
bootstrap('#timer', createTimer);

// Simple Counter
bootstrap('#counter', createCounter);
bootstrap('#counter', createCounter);

// Simple counters with one input
const sharedValue = fdValue(0);
interface SimpleCounter {
  counter: Observer<number>;
}
bootstrap<SimpleCounter>('#counter_input', createCounters, { counter: sharedValue });
bootstrap<SimpleCounter>('#counter_input', createCounters, { counter: sharedValue });
bootstrap<SimpleCounter>('#counter_input', createCounters, { counter: sharedValue });

// Simple If
bootstrap('#simple_if', createIf);

// Simple For
bootstrap('#simple_for', createSimpleFor);

// Simple For Component
// const simpleForComponentConainer = document.getElementById("simple_for_component")
// simpleForComponentConainer.appendChild(generateNode(createSimpleForContainer()))
bootstrap('#simple_for_component', createSimpleForContainer);

// Simple For Observer
bootstrap('#simple_for_obs', createObsFor);

// Simple Attr
bootstrap('#attrs', createExampleAttr);

// Simple Text Node
bootstrap('#text_node', createTextNode);

// Simple Router
bootstrap('#router', createExampleRouter);
