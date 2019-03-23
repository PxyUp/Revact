import { addNodeListener, callDeep, removeNodeListener, setNodeAttrs } from "../misc/misc";

import { FastDomNode } from "../interfaces/node";
import { Observer } from "../observer/observer";
import { fdClasses } from "../observer/fdClasses";

const instance = Symbol("instance");

export function generateNode(node: FastDomNode): HTMLElement | Comment | null {
  if (node.skip === true) {
    return null;
  }

  const rootNode = document.createElement(node.tag);

  if (node.textValue) {
    if (typeof node.textValue === 'object') {
      const obs = node.textValue;
      obs.addSubscribers((value) => {
        rootNode.textContent = value;
      })
      rootNode.textContent = obs.value;
    } else {
      rootNode.textContent = node.textValue;
    }
  }
  let fdClassesNode: fdClasses;
  if (node.classList) {
    if(Array.isArray(node.classList)) {
      node.classList.forEach(item => {
        rootNode.classList.add(item);
      });
    } else {
      fdClassesNode = node.classList
      const clsObs = (node.classList.value as Observer<{[key: string]: boolean}>)
      Object.keys((clsObs.value)).forEach((key) => {
        const value = clsObs.value[key]
        return value ? rootNode.classList.add(key) : rootNode.classList.remove(key)
      })
      clsObs.addSubscribers((newClasses) => {
        Object.keys((newClasses)).forEach((key) => {
          const value = newClasses[key]
          return value ? rootNode.classList.add(key) : rootNode.classList.remove(key)
        })
      })
    }

  }

  if (node.attrs) {
    // @TODO create dynamic attribute
    setNodeAttrs(rootNode, node.attrs);
  }

  if (node.children) {
    node.children.forEach((item: any) => {
      if (!item) {
        return;
      }
      if (Array.isArray(item)) {
        item.forEach((el) => {
          if (!el.tag) {
            rootNode.appendChild(el as HTMLHtmlElement);
            return;
          }
          const child = generateNode({ ...el as FastDomNode, parent: rootNode as any });
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
      const child = generateNode({ ...item as FastDomNode, parent: rootNode as any });
      if (child) {
        rootNode.appendChild(child);
      }
    });
  }

  if (node.listeners) {
    addNodeListener(rootNode, node.listeners);
  }

  if (node.instance) {
    (rootNode as any)[instance] = node.instance;
    node.instance.onInit()
  }

  if (typeof node.skip === 'object') {
    const comment = document.createComment("")
    node.skip.addSubscribers((value) => {
      const parent = node.parent ? node.parent : null as HTMLElement;
      if (value) {
        if (parent) {
          parent.replaceChild(rootNode, comment)
          callDeep(node, 'reInit', false)
          if (fdClassesNode) {
            fdClassesNode.reInit();
          }
          addNodeListener(rootNode, node.listeners)
        }
      } else {
        if (parent) {
          removeNodeListener(rootNode, node.listeners);
          if (fdClassesNode) {
            fdClassesNode.destroy();
          }
          callDeep(node, 'destroy', true)
          parent.replaceChild(comment, rootNode)
        }
      }
    })

    if (node.skip.value) {
      return rootNode
    } else {
      return comment;
    }
  }

  return rootNode;
}