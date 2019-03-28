import { callDeep, insertChildAtIndex, removeAllChild, removeChildAtIndex } from './misc';

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
  keyFn?: (item: any) => string,
) => {
  const skopedKeyFn = typeof keyFn === 'function' ? keyFn : () => index;
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
    return { ...itemFn({ ...inputOverride, index }), fdKey: skopedKeyFn(item) };
  }
  return { ...itemFn, textValue: (itemFn as any).textValue(item), fdKey: skopedKeyFn(item) };
};

export function fdFor(
  iteration: Observer<Array<any>> | Array<any>,
  itemFn: ((e: any) => any) | object,
  inputs: ComponentsInputs = {},
  keyFn?: (e: any) => string,
) {
  if (Array.isArray(iteration)) {
    return iteration.map((item: any, index) => mapFn(item, itemFn, inputs, index));
  }
  let responseArray = iteration.value.map((item: any, index) =>
    mapFn(item, itemFn, inputs, index, keyFn),
  );

  iteration.addSubscriber(value => {
    // @TODO create proper solution for for directive - need re-render just part
    let parent: HTMLElement = (responseArray as any)._parent;
    if (value.length === 0) {
      if (responseArray.length) {
        responseArray.forEach(item => {
          callDeep(item, 'destroy', true, true);
        });

        removeAllChild(parent);
      }
      (responseArray as any)._parent = parent;
      return;
    }
    if (responseArray.length === 0) {
      responseArray = value.map((item: any, index) => mapFn(item, itemFn, inputs, index, keyFn));
      responseArray.forEach(item => {
        parent.appendChild(generateNode(item));
      });

      (responseArray as any)._parent = parent;
      return;
    }
    const newArr = value.map((item: any, index) => mapFn(item, itemFn, inputs, index, keyFn));
    let removeCount = 0;
    responseArray.forEach((item, index) => {
      if (newArr.length <= index) {
        callDeep(item, 'destroy', true, true);
        removeChildAtIndex(parent, index - removeCount);
        removeCount += 1;
        return;
      }
      if (newArr[index].fdKey !== item.fdKey) {
        callDeep(item, 'destroy', true, true);
        removeChildAtIndex(parent, index - removeCount);
        removeCount += 1;
      }
    });
    newArr.forEach((item, index) => {
      if (responseArray.length <= index) {
        parent.appendChild(generateNode(item));
        return;
      }
      if (responseArray[index].fdKey !== item.fdKey) {
        insertChildAtIndex(parent, index, generateNode(item) as HTMLElement);
      }
    });
    responseArray = newArr;
    (responseArray as any)._parent = parent;
  });
  return responseArray;
}
