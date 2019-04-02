import {
  callDeep,
  insertChildAtIndex,
  isPrimitive,
  removeAllChild,
  removeChildAtIndex,
} from './misc';

import { FastDomNode } from '../interfaces/node';
import { Observer } from '../observer/observer';
import { generateNode } from '../generators/node';

export function fdIf(value?: boolean) {
  return fdValue(value);
}

export function fdValue(value: any, force = false) {
  return new Observer(value, force);
}

function mapFn<F extends Array<any>>(
  item: any,
  itemFn: (...args: Array<any>) => FastDomNode | FastDomNode,
  inputs: F = [] as any,
  index: number,
  keyFn?: (item: any) => string,
) {
  let isPrim = false;
  let newItem: any;
  let skopedKeyFn: (iten: any) => any;
  if (keyFn) {
    skopedKeyFn = keyFn;
    newItem = item;
  } else {
    isPrim = isPrimitive(item);
    newItem = isPrim ? { id: index, value: item } : item;
    skopedKeyFn = () => newItem;
  }
  if (typeof itemFn === 'function') {
    return {
      ...itemFn(
        ...inputs.map(inputValue => {
          if (typeof inputValue === 'function') {
            return inputValue(isPrim ? newItem.value : item);
          }
          return inputValue;
        }),
        index,
      ),
      fdKey: skopedKeyFn(newItem),
    };
  }
  return {
    ...(itemFn as FastDomNode),
    textValue: (itemFn as any).textValue(isPrim ? newItem.value : item),
    fdKey: skopedKeyFn(newItem),
  };
}

export function fdFor<F extends any[]>(
  iteration: Observer<Array<any>> | Array<any>,
  itemFn: (...args: Array<any>) => FastDomNode | FastDomNode,
  inputs: F = [] as any,
  keyFn?: (e: any) => string,
) {
  if (Array.isArray(iteration)) {
    return iteration.map((item: any, index) => mapFn(item, itemFn, inputs, index, keyFn));
  }
  let responseArray = iteration.value.map((item: any, index) =>
    mapFn(item, itemFn, inputs, index, keyFn),
  );

  iteration.addSubscriber(value => {
    // @TODO create proper solution for for directive - need re-render just part
    const parent: HTMLElement = (responseArray as any)._parent;
    if (value.length === 0) {
      if (responseArray.length) {
        responseArray.forEach(item => {
          callDeep(item, 'destroy', true, true);
        });

        removeAllChild(parent);
      }
      responseArray = value;
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
    const arr = Array(responseArray.length).fill(false);
    const tempArr = newArr.map(item => [
      item,
      responseArray.findIndex(e => e.fdKey === item.fdKey),
    ]);
    tempArr.forEach((el, index) => {
      const oldIndex = el[1] as number;
      if (oldIndex > -1) {
        arr[oldIndex] = true;
      }
    });
    arr.forEach((item, index) => {
      if (!item) {
        callDeep(responseArray[index], 'destroy', true, true);
        parent.removeChild(responseArray[index].domNode);
      }
    });
    let increaseIndex = 0;
    tempArr.forEach((el, index) => {
      const item = el[0] as FastDomNode;
      const oldIndex = el[1] as number;
      if (oldIndex === -1) {
        parent.appendChild(generateNode(item));
        increaseIndex += 1;
        return;
      }
      if (responseArray[oldIndex].domNode !== parent.children[index + increaseIndex]) {
        parent.insertBefore(
          responseArray[oldIndex].domNode,
          parent.children[index + increaseIndex],
        );
        increaseIndex += 1;
      }
    });
    newArr.forEach((item, index) => {
      item.domNode = parent.children[index] as HTMLElement;
    });
    responseArray = newArr;
    (responseArray as any)._parent = parent;
  });
  return responseArray;
}
