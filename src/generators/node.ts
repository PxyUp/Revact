import {
  addNodeListener,
  callDeep,
  removeNodeListener,
  setNodeAttrs,
  setProps,
} from '../misc/misc';

import { FastDomNode } from '../interfaces/node';
import { Observer } from '../observer/observer';
import { fdObject } from '../observer/fdObject';

const instance = Symbol('instance');

export function generateNode(node: FastDomNode): HTMLElement | Comment | null {
  if (node.show === false) {
    return null;
  }

  const rootNode =
    node.tag !== 'textNode' ? document.createElement(node.tag) : document.createTextNode('');

  node.domNode = rootNode;

  if (node.textValue !== null || node.textValue !== undefined) {
    if (typeof node.textValue === 'object') {
      const obs = node.textValue;
      obs.addSubscribers(value => {
        rootNode.textContent = value;
      });
      rootNode.textContent = obs.value;
    } else {
      rootNode.textContent = node.textValue;
    }
  }
  let fdClassesNode: fdObject<boolean>;
  let fdAttrsNode: fdObject<any>;
  let fdPropsNode: fdObject<any>;
  if (node.tag !== 'textNode') {
    if (node.classList) {
      if (Array.isArray(node.classList)) {
        node.classList.forEach(item => {
          (rootNode as HTMLElement).classList.add(item);
        });
      } else {
        fdClassesNode = node.classList;
        const clsObs = node.classList.value as Observer<{ [key: string]: boolean }>;
        Object.keys(clsObs.value).forEach(key => {
          const value = clsObs.value[key];
          return value
            ? (rootNode as HTMLElement).classList.add(key)
            : (rootNode as HTMLElement).classList.remove(key);
        });
        clsObs.addSubscribers(newClasses => {
          Object.keys(newClasses).forEach(key => {
            const value = newClasses[key];
            return value
              ? (rootNode as HTMLElement).classList.add(key)
              : (rootNode as HTMLElement).classList.remove(key);
          });
        });
      }
    }

    if (node.props) {
      if (!(node.props instanceof fdObject)) {
        setProps(rootNode as HTMLElement, node.props);
      } else {
        fdPropsNode = node.props;
        const propsObs = node.props.value as Observer<{ [key: string]: any }>;
        setProps(rootNode as HTMLElement, propsObs.value);
        propsObs.addSubscribers(newProps => {
          setProps(rootNode as HTMLElement, newProps);
        });
      }
    }

    if (node.attrs) {
      if (!(node.attrs instanceof fdObject)) {
        setNodeAttrs(rootNode as HTMLElement, node.attrs);
      } else {
        fdAttrsNode = node.attrs;
        const attrsObs = node.attrs.value as Observer<{ [key: string]: any }>;
        setNodeAttrs(rootNode as HTMLElement, attrsObs.value);
        attrsObs.addSubscribers(newAttrs => {
          setNodeAttrs(rootNode as HTMLElement, newAttrs);
        });
      }
    }

    if (node.children) {
      node.children.forEach((item: any) => {
        if (!item) {
          return;
        }
        if (Array.isArray(item)) {
          item.forEach(el => {
            if (!el.tag) {
              rootNode.appendChild(el as HTMLHtmlElement);
              return;
            }
            const child = generateNode(Object.assign(el, { parent: rootNode as any }) as any);
            if (child) {
              rootNode.appendChild(child);
            }
          });
          (item as any)._parent = rootNode;
          return;
        }
        if (!item.tag) {
          rootNode.appendChild(item as HTMLHtmlElement);
          return;
        }
        const child = generateNode(Object.assign(item, { parent: rootNode as any }));
        if (child) {
          rootNode.appendChild(child);
        }
      });
    }

    if (node.listeners) {
      addNodeListener(rootNode as HTMLElement, node.listeners);
    }
  }

  if (node.instance) {
    (rootNode as any)[instance] = node.instance;
  }

  if (typeof node.show === 'object') {
    const comment = document.createComment('');
    node.show.addSubscribers(value => {
      const parent = node.parent ? node.parent : (null as HTMLElement);
      if (value) {
        if (parent) {
          if (comment.parentNode === parent) {
            parent.replaceChild(rootNode, comment);
          }
          callDeep(node, 'reInit', false);
          if (fdClassesNode) {
            fdClassesNode.reInit();
          }
          if (fdPropsNode) {
            fdPropsNode.reInit();
          }
          if (fdAttrsNode) {
            fdAttrsNode.reInit();
          }
          if (node.tag !== 'textNode') {
            addNodeListener(rootNode as HTMLElement, node.listeners);
          }
        }
      } else {
        if (parent) {
          if (node.tag !== 'textNode') {
            removeNodeListener(rootNode as HTMLElement, node.listeners);
          }
          if (fdAttrsNode) {
            fdAttrsNode.destroy();
          }
          if (fdPropsNode) {
            fdPropsNode.reInit();
          }
          if (fdClassesNode) {
            fdClassesNode.destroy();
          }
          callDeep(node, 'destroy', true);
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
      return comment;
    }
  }

  return rootNode;
}
