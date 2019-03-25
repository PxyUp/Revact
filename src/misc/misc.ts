import { Component } from '../generators/index';
import { FastDomNode } from '../interfaces/node';

export function setNodeAttrs(node: HTMLElement | Element, attrs: { [key: string]: string }) {
  Object.keys(attrs).forEach(key => {
    if (!attrs[key] && attrs[key] !== '') {
      node.removeAttribute(key);
      return;
    }
    node.setAttribute(key, attrs[key]);
  });
}

export function setProps(node: any, props: { [key: string]: string }) {
  Object.keys(props).forEach(key => {
    node[key] = props[key];
  });
}

export function addNodeListener(
  node: HTMLElement | Document,
  listeners: { [key: string]: any | Array<any> },
) {
  if (!listeners) {
    return;
  }
  Object.keys(listeners).forEach(event => {
    if (!Array.isArray(listeners[event])) {
      node.addEventListener(event, listeners[event]);
      return;
    }
    listeners[event].forEach((callback: any) => {
      node.addEventListener(event, callback);
    });
  });
}

export function removeNodeListener(
  node: HTMLElement | Document,
  listeners: { [key: string]: any | Array<any> },
) {
  if (!listeners) {
    return;
  }
  Object.keys(listeners).forEach(event => {
    if (!Array.isArray(listeners[event])) {
      node.removeEventListener(event, listeners[event]);
      return;
    }
    listeners[event].forEach((callback: any) => {
      node.removeEventListener(event, callback);
    });
  });
}

export function removeAllChild(node: HTMLElement) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function removeAllListenersComponent(fdNodes: FastDomNode) {
  if (fdNodes.listeners) {
    removeNodeListener(fdNodes.domNode as HTMLElement, fdNodes.listeners);
  }
  if (fdNodes.children) {
    fdNodes.children.forEach((item: FastDomNode) => {
      if (!item.instance && item.tag) {
        removeAllListenersComponent(item);
      }
    });
  }
}

export function callDeep(node: FastDomNode, method: string, direction: boolean, ...args: any) {
  if (direction) {
    if (node.children) {
      node.children.forEach((item: any) => {
        callDeep(item, method, direction, ...args);
      });
    }
    if (node.instance) {
      node.instance[method](...args);
    }
    return;
  }
  if (node.instance) {
    node.instance[method](...args);
  }
  if (node.children) {
    node.children.forEach((item: any) => {
      callDeep(item, method, direction, ...args);
    });
  }
  return;
}
