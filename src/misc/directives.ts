import { callDeep, removeAllChild } from './misc';

import { ComponentsInputs } from '../interfaces/component';
import { Observer } from '../observer/observer';
import { generateNode } from '../generators/node';

export function fdIf(value?: boolean) {
  return fdValue(value);
}

export function fdValue(value: any) {
  return new Observer(value);
}

const mapFn = (
  item: any,
  itemFn: ((e: any) => any) | object,
  inputs: ComponentsInputs = {},
  index: number,
) => {
  if (typeof itemFn === 'function') {
    const inputOverride = {} as any;
    Object.keys(inputs).forEach(key => {
      const value = inputs[key];
      if (typeof value === 'function') {
        inputOverride[key] = value(item);
      } else {
        inputOverride[key] = value;
      }
    });
    return itemFn({ ...inputOverride, index });
  }
  return { ...itemFn, textValue: (itemFn as any).textValue(item), index };
};

export function fdFor(
  iteration: Observer<Array<any>> | Array<any>,
  itemFn: ((e: any) => any) | object,
  inputs: ComponentsInputs = {},
) {
  if (Array.isArray(iteration)) {
    return iteration.map((item: any, index) => mapFn(item, itemFn, inputs, index));
  }
  let responseArray = iteration.value.map((item: any, index) => mapFn(item, itemFn, inputs, index));

  iteration.addSubscriber(value => {
    // @TODO create proper solution for for directive - need re-render just part
    let parent: HTMLElement = (responseArray as any)._parent;
    if (responseArray.length) {
      responseArray.forEach(item => {
        callDeep(item, 'destroy', true, true);
      });

      removeAllChild(parent);
    }
    if (!value.length) {
      return;
    }
    responseArray = value.map((item: any, index) => mapFn(item, itemFn, inputs, index));

    responseArray.forEach(item => {
      parent.appendChild(generateNode(item));
    });

    (responseArray as any)._parent = parent;
  });
  return responseArray;
}
