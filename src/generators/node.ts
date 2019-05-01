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
import { rList } from '../directives/rList';

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

  let textNodeSubscriber: (e: any) => void;
  let styleSubscriber: (e: any) => void;
  let classListSubscriber: (e: any) => void;
  let propsSubscriber: (e: any) => void;
  let attrsSubscriber: (e: any) => void;

  if (node.textValue) {
    if (node.textValue instanceof Observer) {
      textNodeSubscriber = newTextValue => {
        setTextContent(rootNode as HTMLElement, newTextValue);
      };
      node.textValue.addSubscriber(textNodeSubscriber);
    } else {
      setTextContent(rootNode as HTMLElement, node.textValue);
    }
  }

  if (node.tag !== 'textNode') {
    if (node.classList) {
      if (node.classList instanceof Observer) {
        classListSubscriber = newClassListValue => {
          setClassList(rootNode as HTMLElement, newClassListValue);
        };
        node.classList.addSubscriber(classListSubscriber);
      } else {
        setClassList(rootNode as HTMLElement, node.classList);
      }
    }

    if (node.props) {
      if (node.props instanceof Observer) {
        propsSubscriber = newPropsValue => {
          setProps(rootNode as HTMLElement, newPropsValue);
        };
        node.props.addSubscriber(propsSubscriber);
      } else {
        setProps(rootNode as HTMLElement, node.props);
      }
    }

    if (node.styles) {
      if (node.styles instanceof Observer) {
        styleSubscriber = newStylesValue => {
          setNodeStyle(rootNode as HTMLElement, newStylesValue);
        };
        node.styles.addSubscriber(styleSubscriber);
      } else {
        setNodeStyle(rootNode as HTMLElement, node.styles);
      }
    }

    if (node.attrs) {
      if (node.attrs instanceof Observer) {
        attrsSubscriber = newAttrsValue => {
          setNodeAttrs(rootNode as HTMLElement, newAttrsValue);
        };
        node.attrs.addSubscriber(attrsSubscriber);
      } else {
        setNodeAttrs(rootNode as HTMLElement, node.attrs);
      }
    }

    if (node.children) {
      const tempArr = [] as Array<HTMLElement | DocumentFragment | Comment | Array<any>>;
      node.children.forEach((item: any) => {
        if (!item) {
          return;
        }

        if (item instanceof rList) {
          item.setParent(rootNode as HTMLElement);
          return;
        }

        if (!item.tag) {
          tempArr.push(item as HTMLHtmlElement);
        }
        const arrChild = generateNode(Object.assign(item, { parent: rootNode as any }) as any);
        if (arrChild) {
          tempArr.push(arrChild);
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
    callDeep(node, 'destroy', true);

    if (node.tag !== 'textNode') {
      removeNodeListener(rootNode as HTMLElement, node.listeners);
    }

    if (textNodeSubscriber) {
      (node.textValue as Observer<any>).removeSubscriber(textNodeSubscriber);
    }

    if (attrsSubscriber) {
      (node.attrs as Observer<any>).removeSubscriber(attrsSubscriber);
    }

    if (propsSubscriber) {
      (node.props as Observer<any>).removeSubscriber(propsSubscriber);
    }

    if (classListSubscriber) {
      (node.classList as Observer<any>).removeSubscriber(classListSubscriber);
    }

    if (styleSubscriber) {
      (node.styles as Observer<any>).removeSubscriber(styleSubscriber);
    }
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

          if (styleSubscriber) {
            (node.styles as Observer<any>).addSubscriber(styleSubscriber);
          }
          if (classListSubscriber) {
            (node.classList as Observer<any>).addSubscriber(classListSubscriber);
          }
          if (propsSubscriber) {
            (node.props as Observer<any>).addSubscriber(propsSubscriber);
          }
          if (attrsSubscriber) {
            (node.attrs as Observer<any>).addSubscriber(attrsSubscriber);
          }
          if (textNodeSubscriber) {
            (node.textValue as Observer<any>).addSubscriber(textNodeSubscriber);
          }
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
