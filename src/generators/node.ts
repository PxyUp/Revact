import {
  addNodeListener,
  callDeep,
  removeNodeListener,
  renderList,
  setClassList,
  setNodeAttrs,
  setNodeStyle,
  setProps,
  setTextContent,
} from '../misc/misc';

import { Observer } from '../observer/observer';
import { RevactNode } from '../interfaces/node';

const instance = 'instance';

export function nodeWrapper(...args: any[]): RevactNode {
  return {
    tag: 'fragment',
    children: args,
  };
}

export function generateNode(node: RevactNode): HTMLElement | DocumentFragment | Comment | null {
  if (node.show === false) {
    return null;
  }
  let rootNode: HTMLElement | Text | DocumentFragment;

  if (node.tag !== 'textNode' && node.tag !== 'fragment') {
    rootNode = document.createElement(node.tag);
  } else {
    if (node.tag === 'textNode') {
      rootNode = document.createTextNode('');
    } else {
      rootNode = document.createDocumentFragment();
    }
  }

  node.domNode = rootNode;

  const listSharedFn = {
    textValue: setTextContent,
  } as { [key: string]: (node: HTMLElement, value: any) => void };

  const listSharedObservers = {
    textValue: null,
  } as { [key: string]: null | Observer<any> };

  const listNodeFn = {
    styles: setNodeStyle,
    classList: setClassList,
    props: setProps,
    attrs: setNodeAttrs,
  } as { [key: string]: (node: HTMLElement, value: any) => void };

  const listNodeObservers = {
    styles: null,
    classList: null,
    props: null,
    attrs: null,
  } as { [key: string]: null | Observer<any> };
  // That can be apply for all type
  Object.keys(listSharedObservers).forEach((key: string) => {
    if ((node as any)[key]) {
      if ((node as any)[key] instanceof Observer) {
        const obs = (node as any)[key] as Observer<any>;
        listSharedFn[key](rootNode as HTMLElement, obs.value);
        obs.addSubscriber(newValue => {
          listSharedFn[key](rootNode as HTMLElement, newValue);
        });
        listSharedObservers[key] = obs;
        return;
      }
      listSharedFn[key](rootNode as HTMLElement, (node as any)[key]);
    }
  });

  if (node.tag !== 'textNode') {
    Object.keys(listNodeObservers).forEach((key: string) => {
      if ((node as any)[key]) {
        if ((node as any)[key] instanceof Observer) {
          const obs = (node as any)[key] as Observer<any>;
          listNodeFn[key](rootNode as HTMLElement, obs.value);
          obs.addSubscriber(newValue => {
            listNodeFn[key](rootNode as HTMLElement, newValue);
          });
          listNodeObservers[key] = obs;
          return;
        }
        listNodeFn[key](rootNode as HTMLElement, (node as any)[key]);
      }
    });

    if (node.children) {
      const tempArr = [] as Array<HTMLElement | DocumentFragment | Comment | Array<any>>;
      node.children.forEach((item: any) => {
        if (!item) {
          return;
        }
        if (Array.isArray(item)) {
          const tempSubArr = [] as Array<HTMLElement | Comment | DocumentFragment>;
          item.forEach(el => {
            if (!el.tag) {
              tempSubArr.push(el as HTMLHtmlElement);
              return;
            }
            const arrChild = generateNode(Object.assign(el, { parent: rootNode as any }) as any);
            if (arrChild) {
              tempSubArr.push(arrChild);
            }
          });
          (item as any)._parent = rootNode;
          tempArr.push(tempSubArr);
          return;
        }
        if (!item.tag) {
          tempArr.push(item);
          return;
        }
        const child = generateNode(Object.assign(item, { parent: rootNode as any }));
        if (child) {
          tempArr.push(child);
        }
      });
      renderList(rootNode as HTMLElement, tempArr);
    }

    if (node.listeners) {
      addNodeListener(rootNode as HTMLElement, node.listeners);
    }
  }

  if (node.instance) {
    (rootNode as any)[instance] = node.instance;
  }

  const fakeDestroy = () => {
    if (node.tag !== 'textNode') {
      removeNodeListener(rootNode as HTMLElement, node.listeners);
    }

    Object.keys(listSharedObservers).forEach(key => {
      if (listSharedObservers[key]) {
        listSharedObservers[key].destroy();
      }
    });

    Object.keys(listNodeObservers).forEach(key => {
      if (listNodeObservers[key]) {
        listNodeObservers[key].destroy();
      }
    });
    callDeep(node, 'destroy', true);
  };

  if (typeof node.show === 'object') {
    const comment = document.createComment('');
    node.show.addSubscriber(value => {
      const parent = node.parent ? node.parent : (null as HTMLElement);
      if (value) {
        if (parent) {
          if (comment.parentNode === parent) {
            parent.replaceChild(rootNode, comment);
          }
          callDeep(node, 'reInit', false);
          // List for observer textValue
          Object.keys(listSharedObservers).forEach(key => {
            if (listSharedObservers[key]) {
              listSharedObservers[key].reInit();
            }
          });
          // List for observer for node
          Object.keys(listNodeObservers).forEach(key => {
            if (listNodeObservers[key]) {
              listNodeObservers[key].reInit();
            }
          });
          if (node.tag !== 'textNode') {
            addNodeListener(rootNode as HTMLElement, node.listeners);
          }
        }
      } else {
        if (parent) {
          fakeDestroy();
          if (rootNode.parentNode === parent) {
            parent.replaceChild(comment, rootNode);
          }
        }
      }
    });

    if (node.show.value) {
      if (node.instance) {
        node.instance.onInit();
      }
      return rootNode;
    } else {
      fakeDestroy();
      return comment;
    }
  }

  if (node.instance) {
    node.instance.onInit();
  }

  return rootNode;
}
