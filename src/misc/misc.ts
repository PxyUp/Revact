import { FastDomNode } from "../interfaces/node";

export function setNodeAttrs(
    node: HTMLElement | Element,
    attrs: { [key: string]: string },
  ) {
    Object.keys(attrs).forEach(key => {
      if (!attrs[key]) {
        node.removeAttribute(key)
        return;
      }
      node.setAttribute(key, attrs[key]);
    });
  }

  export function addNodeListener(
    node: HTMLElement | Document,
    listeners: { [key: string]: any | Array<any> },
  ) {
    if(!listeners) {
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
    if(!listeners) {
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

  export function callDeep(node: FastDomNode, method: string, direction:  boolean) {
    if (direction) {
      if(node.children) {
        node.children.forEach((item: any) => {
          callDeep(item, method, direction)
        })
      }
      if (node.instance) {
        node.instance[method]();
      }
      return;
    }
    if (node.instance) {
      node.instance[method]();
    }
    if(node.children) {
      node.children.forEach((item: any) => {
        callDeep(item, method, direction)
      })
    }
    return;
  }