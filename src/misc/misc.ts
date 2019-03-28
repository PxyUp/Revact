import { FastDomNode } from '../interfaces/node';
import { Observer } from '../observer/observer';
import { Router } from '../generators/index';
import { RouterPath } from '../interfaces/router';

// Thank you, very much https://github.com/krasimir/navigo
const PARAMETER_REGEXP = /([:*])(\w+)/g;
const WILDCARD_REGEXP = /\*/g;
const REPLACE_VARIABLE_REGEXP = '([^/]+)';
const REPLACE_WILDCARD = '(?:.*)';
const FOLLOWED_BY_SLASH_REGEXP = '(?:/$|$)';
const MATCH_REGEXP_FLAGS = '';

const isPushStateAvailable = !!(
  typeof window !== 'undefined' &&
  window.history &&
  window.history.pushState
);

export function setNodeStyle(node: HTMLElement, styles: { [key: string]: string } | string) {
  if (typeof styles === 'string') {
    (node as HTMLElement).style.cssText = styles;
    return;
  }
  Object.keys(styles).forEach((key: string) => {
    (node as HTMLElement).style.setProperty(key, (styles as any)[key]);
  });
}

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
  if (!node || !listeners) {
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
  if (!node || !listeners) {
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

export function removeChildAtIndex(node: HTMLElement, index: number) {
  if (!node) {
    return;
  }
  if (node.children[index]) {
    node.children[index].remove();
  }
}

export function insertChildAtIndex(parent: HTMLElement, index: number, newNode: HTMLElement) {
  if (!parent || !newNode) {
    return;
  }
  parent.insertBefore(newNode, parent.children[index]);
}

export function removeAllChild(node: HTMLElement) {
  if (!node) {
    return;
  }
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
  if (!node) {
    return;
  }
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

// Thank you, very much https://github.com/krasimir/navigo
export function getOnlyURL(url: string, useHash = false, hash = '#') {
  let onlyURL = url;
  let split;
  const cleanGETParam = (str: string) => str.split(/\?(.*)?$/)[0];

  if (typeof hash === 'undefined') {
    // To preserve BC
    hash = '#';
  }

  if (isPushStateAvailable && !useHash) {
    onlyURL = cleanGETParam(url).split(hash)[0];
  } else {
    split = url.split(hash);
    onlyURL = split.length > 1 ? cleanGETParam(split[1]) : cleanGETParam(split[0]);
  }

  return onlyURL;
}

// Thank you, very much https://github.com/krasimir/navigo
export function regExpResultToParams(match: Array<any>, names: Array<string>) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match.slice(1, match.length).reduce((params: any, value: any, index: number) => {
    if (params === null) params = {};
    params[names[index]] = decodeURIComponent(value);
    return params;
  }, null);
}

// Thank you, very much https://github.com/krasimir/navigo
export function clean(s: RegExp | string): RegExp | string {
  if (s instanceof RegExp) return s;
  return s.replace(/\/+$/, '').replace(/^\/+/, '^/');
}

// Thank you, very much https://github.com/krasimir/navigo
export function findMatchedRoutes(url: string, routes: Array<RouterPath> = []) {
  return routes
    .map(route => {
      const { regexp, paramNames } = replaceDynamicURLParts(clean(route.path));
      const match = url.match(regexp);
      const params = regExpResultToParams(match, paramNames);

      return match ? { match, route, params } : false;
    })
    .filter(m => m);
}

// Thank you, very much https://github.com/krasimir/navigo
export function matchRoute(url: string, routes: Array<RouterPath> = []) {
  return findMatchedRoutes(getOnlyURL(url), routes)[0] || false;
}

// Thank you, very much https://github.com/krasimir/navigo
export function replaceDynamicURLParts(route: RegExp | string) {
  const paramNames: Array<any> = [];
  let regexp;

  if (route instanceof RegExp) {
    regexp = route;
  } else {
    regexp = new RegExp(
      route
        .replace(PARAMETER_REGEXP, function(full, dots, name) {
          paramNames.push(name);
          return REPLACE_VARIABLE_REGEXP;
        })
        .replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP,
      MATCH_REGEXP_FLAGS,
    );
  }
  return { regexp, paramNames };
}
