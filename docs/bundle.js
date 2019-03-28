(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  // Thank you, very much https://github.com/krasimir/navigo
  const PARAMETER_REGEXP = /([:*])(\w+)/g;
  const WILDCARD_REGEXP = /\*/g;
  const REPLACE_VARIABLE_REGEXP = '([^/]+)';
  const REPLACE_WILDCARD = '(?:.*)';
  const FOLLOWED_BY_SLASH_REGEXP = '(?:/$|$)';
  const MATCH_REGEXP_FLAGS = '';
  const isPushStateAvailable = !!(typeof window !== 'undefined' &&
      window.history &&
      window.history.pushState);
  function setNodeStyle(node, styles) {
      if (typeof styles === 'string') {
          node.style.cssText = styles;
          return;
      }
      Object.keys(styles).forEach((key) => {
          node.style.setProperty(key, styles[key]);
      });
  }
  function setNodeAttrs(node, attrs) {
      Object.keys(attrs).forEach(key => {
          if (!attrs[key] && attrs[key] !== '') {
              node.removeAttribute(key);
              return;
          }
          node.setAttribute(key, attrs[key]);
      });
  }
  function setProps(node, props) {
      Object.keys(props).forEach(key => {
          node[key] = props[key];
      });
  }
  function addNodeListener(node, listeners) {
      if (!node || !listeners) {
          return;
      }
      Object.keys(listeners).forEach(event => {
          if (!Array.isArray(listeners[event])) {
              node.addEventListener(event, listeners[event]);
              return;
          }
          listeners[event].forEach((callback) => {
              node.addEventListener(event, callback);
          });
      });
  }
  function removeNodeListener(node, listeners) {
      if (!node || !listeners) {
          return;
      }
      Object.keys(listeners).forEach(event => {
          if (!Array.isArray(listeners[event])) {
              node.removeEventListener(event, listeners[event]);
              return;
          }
          listeners[event].forEach((callback) => {
              node.removeEventListener(event, callback);
          });
      });
  }
  function removeChildAtIndex(node, index) {
      if (!node) {
          return;
      }
      if (node.children[index]) {
          node.children[index].remove();
      }
  }
  function insertChildAtIndex(parent, index, newNode) {
      if (!parent || !newNode) {
          return;
      }
      parent.insertBefore(newNode, parent.children[index]);
  }
  function removeAllChild(node) {
      if (!node) {
          return;
      }
      while (node.firstChild) {
          node.removeChild(node.firstChild);
      }
  }
  function removeAllListenersComponent(fdNodes) {
      if (fdNodes.listeners) {
          removeNodeListener(fdNodes.domNode, fdNodes.listeners);
      }
      if (fdNodes.children) {
          fdNodes.children.forEach((item) => {
              if (!item.instance && item.tag) {
                  removeAllListenersComponent(item);
              }
          });
      }
  }
  function callDeep(node, method, direction, ...args) {
      if (!node) {
          return;
      }
      if (direction) {
          if (node.children) {
              node.children.forEach((item) => {
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
          node.children.forEach((item) => {
              callDeep(item, method, direction, ...args);
          });
      }
      return;
  }
  // Thank you, very much https://github.com/krasimir/navigo
  function getOnlyURL(url, useHash = false, hash = '#') {
      let onlyURL = url;
      let split;
      const cleanGETParam = (str) => str.split(/\?(.*)?$/)[0];
      if (typeof hash === 'undefined') {
          // To preserve BC
          hash = '#';
      }
      if (isPushStateAvailable && !useHash) {
          onlyURL = cleanGETParam(url).split(hash)[0];
      }
      else {
          split = url.split(hash);
          onlyURL = split.length > 1 ? cleanGETParam(split[1]) : cleanGETParam(split[0]);
      }
      return onlyURL;
  }
  // Thank you, very much https://github.com/krasimir/navigo
  function regExpResultToParams(match, names) {
      if (names.length === 0)
          return null;
      if (!match)
          return null;
      return match.slice(1, match.length).reduce((params, value, index) => {
          if (params === null)
              params = {};
          params[names[index]] = decodeURIComponent(value);
          return params;
      }, null);
  }
  // Thank you, very much https://github.com/krasimir/navigo
  function clean(s) {
      if (s instanceof RegExp)
          return s;
      return s.replace(/\/+$/, '').replace(/^\/+/, '^/');
  }
  // Thank you, very much https://github.com/krasimir/navigo
  function findMatchedRoutes(url, routes = []) {
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
  function matchRoute(url, routes = []) {
      return findMatchedRoutes(getOnlyURL(url), routes)[0] || false;
  }
  // Thank you, very much https://github.com/krasimir/navigo
  function replaceDynamicURLParts(route) {
      const paramNames = [];
      let regexp;
      if (route instanceof RegExp) {
          regexp = route;
      }
      else {
          regexp = new RegExp(route
              .replace(PARAMETER_REGEXP, function (full, dots, name) {
              paramNames.push(name);
              return REPLACE_VARIABLE_REGEXP;
          })
              .replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP, MATCH_REGEXP_FLAGS);
      }
      return { regexp, paramNames };
  }

  class Observer {
      constructor(_value, forces = false) {
          this._value = _value;
          this.forces = forces;
          this.subscribers = [];
          this.isDestroy = false;
          this.firstState = _value;
      }
      get value() {
          return this._value;
      }
      destroy(force = false) {
          if (this.isDestroy) {
              return;
          }
          if (force) {
              this.subscribers = [];
          }
          this.isDestroy = true;
      }
      reInit() {
          this.isDestroy = false;
          this.value = this.firstState;
      }
      addSubscriber(subscriber) {
          if (this.isDestroy) {
              return;
          }
          this.subscribers.push(subscriber);
      }
      removeSubscriber(subscriber) {
          const index = this.subscribers.indexOf(subscriber);
          if (index > -1) {
              this.subscribers.splice(index, 1);
          }
      }
      set value(value) {
          if (this.isDestroy) {
              return;
          }
          if (this._value === value && !this.forces) {
              return;
          }
          this._value = value;
          if (this.subscribers.length) {
              this.subscribers.forEach(sub => {
                  sub(value);
              });
          }
      }
  }

  class fdObject {
      constructor(dict = {}) {
          this.obsArr = [];
          this.values = {};
          this.obs = new Observer(this.values, true);
          this.isDestroyed = false;
          Object.keys(dict).forEach(key => {
              const item = dict[key];
              if (typeof item !== 'object') {
                  this.values[key] = item;
                  return;
              }
              this.obsArr.push(item);
              this.values[key] = item.value;
              item.addSubscriber(value => {
                  this.values[key] = value;
                  this.obs.value = this.values;
              });
          });
      }
      get value() {
          return this.obs;
      }
      reInit() {
          this.isDestroyed = false;
          this.obs.reInit();
          this.obsArr.forEach(item => {
              item.reInit();
          });
      }
      destroy(force = false) {
          if (this.isDestroyed) {
              return;
          }
          this.obs.destroy(force);
          this.obsArr.forEach(item => {
              item.destroy(force);
          });
          this.isDestroyed = true;
      }
  }

  const instance = Symbol('instance');
  function generateNode(node) {
      if (node.show === false) {
          return null;
      }
      const rootNode = node.tag !== 'textNode' ? document.createElement(node.tag) : document.createTextNode('');
      node.domNode = rootNode;
      if (node.textValue !== null || node.textValue !== undefined) {
          if (typeof node.textValue === 'object') {
              const obs = node.textValue;
              obs.addSubscriber(value => {
                  rootNode.textContent = value;
              });
              rootNode.textContent = obs.value;
          }
          else {
              rootNode.textContent = node.textValue;
          }
      }
      let fdClassesNode;
      let fdAttrsNode;
      let fdPropsNode;
      let fdStyleNode;
      if (node.tag !== 'textNode') {
          if (node.classList) {
              if (Array.isArray(node.classList)) {
                  node.classList.forEach(item => {
                      rootNode.classList.add(item);
                  });
              }
              else {
                  fdClassesNode = node.classList;
                  const clsObs = node.classList.value;
                  Object.keys(clsObs.value).forEach(key => {
                      const value = clsObs.value[key];
                      return value
                          ? rootNode.classList.add(key)
                          : rootNode.classList.remove(key);
                  });
                  clsObs.addSubscriber(newClasses => {
                      Object.keys(newClasses).forEach(key => {
                          const value = newClasses[key];
                          return value
                              ? rootNode.classList.add(key)
                              : rootNode.classList.remove(key);
                      });
                  });
              }
          }
          if (node.props) {
              if (!(node.props instanceof fdObject)) {
                  setProps(rootNode, node.props);
              }
              else {
                  fdPropsNode = node.props;
                  const propsObs = node.props.value;
                  setProps(rootNode, propsObs.value);
                  propsObs.addSubscriber(newProps => {
                      setProps(rootNode, newProps);
                  });
              }
          }
          if (node.styles) {
              if (!(node.styles instanceof fdObject)) {
                  if (node.styles instanceof Observer) {
                      fdStyleNode = node.styles;
                      setNodeStyle(rootNode, fdStyleNode.value);
                      fdStyleNode.addSubscriber(newStyles => {
                          setNodeStyle(rootNode, newStyles);
                      });
                  }
                  else {
                      setNodeStyle(rootNode, node.styles);
                  }
              }
              else {
                  fdStyleNode = node.styles;
                  const styleObs = fdStyleNode.value;
                  setNodeStyle(rootNode, styleObs.value);
                  styleObs.addSubscriber(newStyles => {
                      setNodeStyle(rootNode, newStyles);
                  });
              }
          }
          if (node.attrs) {
              if (!(node.attrs instanceof fdObject)) {
                  setNodeAttrs(rootNode, node.attrs);
              }
              else {
                  fdAttrsNode = node.attrs;
                  const attrsObs = node.attrs.value;
                  setNodeAttrs(rootNode, attrsObs.value);
                  attrsObs.addSubscriber(newAttrs => {
                      setNodeAttrs(rootNode, newAttrs);
                  });
              }
          }
          if (node.children) {
              node.children.forEach((item) => {
                  if (!item) {
                      return;
                  }
                  if (Array.isArray(item)) {
                      item.forEach(el => {
                          if (!el.tag) {
                              rootNode.appendChild(el);
                              return;
                          }
                          const child = generateNode(Object.assign(el, { parent: rootNode }));
                          if (child) {
                              rootNode.appendChild(child);
                          }
                      });
                      item._parent = rootNode;
                      return;
                  }
                  if (!item.tag) {
                      rootNode.appendChild(item);
                      return;
                  }
                  const child = generateNode(Object.assign(item, { parent: rootNode }));
                  if (child) {
                      rootNode.appendChild(child);
                  }
              });
          }
          if (node.listeners) {
              addNodeListener(rootNode, node.listeners);
          }
      }
      if (node.instance) {
          rootNode[instance] = node.instance;
          node.instance.onInit();
      }
      if (typeof node.show === 'object') {
          const comment = document.createComment('');
          node.show.addSubscriber(value => {
              const parent = node.parent ? node.parent : null;
              if (value) {
                  if (parent) {
                      if (comment.parentNode === parent) {
                          parent.replaceChild(rootNode, comment);
                      }
                      callDeep(node, 'reInit', false);
                      if (fdStyleNode) {
                          fdClassesNode.reInit();
                      }
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
                          addNodeListener(rootNode, node.listeners);
                      }
                  }
              }
              else {
                  if (parent) {
                      if (node.tag !== 'textNode') {
                          removeNodeListener(rootNode, node.listeners);
                      }
                      if (fdAttrsNode) {
                          fdAttrsNode.destroy();
                      }
                      if (fdPropsNode) {
                          fdPropsNode.destroy();
                      }
                      if (fdClassesNode) {
                          fdClassesNode.destroy();
                      }
                      if (fdStyleNode) {
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
              return rootNode;
          }
          else {
              return comment;
          }
      }
      return rootNode;
  }

  function createComponent(classProvider, inputs = {}) {
      const instance = new classProvider(inputs);
      instance.template.instance = instance;
      return instance.template;
  }
  class Component {
      constructor() {
          this.reactive = {};
          this.fdObjects = {};
          this.fdStyles = {};
      }
      onDestroy() { }
      onInit() { }
      reInit() {
          Object.keys(this.fdStyles).forEach(key => {
              this.fdStyles[key].reInit();
          });
          Object.keys(this.fdObjects).forEach(key => {
              this.fdObjects[key].reInit();
          });
          Object.keys(this.reactive).forEach(key => {
              this.reactive[key].reInit();
          });
          this.onInit();
      }
      destroy(...args) {
          const force = args[0];
          if (force === true) {
              removeAllListenersComponent(this.template);
          }
          Object.keys(this.fdObjects).forEach(key => {
              this.fdObjects[key].destroy(...args);
          });
          Object.keys(this.reactive).forEach(key => {
              this.reactive[key].destroy(...args);
          });
          Object.keys(this.fdStyles).forEach(key => {
              this.fdStyles[key].destroy(...args);
          });
          this.onDestroy();
      }
  }

  function fdIf(value) {
      return fdValue(value);
  }
  function fdValue(value) {
      return new Observer(value);
  }
  const mapFn = (item, itemFn, inputs = {}, index, keyFn) => {
      const skopedKeyFn = typeof keyFn === 'function' ? keyFn : () => index;
      if (typeof itemFn === 'function') {
          const inputOverride = {};
          Object.keys(inputs).forEach(key => {
              const value = inputs[key];
              if (typeof value === 'function') {
                  inputOverride[key] = value(item);
              }
              else {
                  inputOverride[key] = value;
              }
          });
          return Object.assign({}, itemFn(Object.assign({}, inputOverride, { index })), { fdKey: skopedKeyFn(item) });
      }
      return Object.assign({}, itemFn, { textValue: itemFn.textValue(item), fdKey: skopedKeyFn(item) });
  };
  function fdFor(iteration, itemFn, inputs = {}, keyFn) {
      if (Array.isArray(iteration)) {
          return iteration.map((item, index) => mapFn(item, itemFn, inputs, index));
      }
      let responseArray = iteration.value.map((item, index) => mapFn(item, itemFn, inputs, index, keyFn));
      iteration.addSubscriber(value => {
          // @TODO create proper solution for for directive - need re-render just part
          let parent = responseArray._parent;
          if (value.length === 0) {
              if (responseArray.length) {
                  responseArray.forEach(item => {
                      callDeep(item, 'destroy', true, true);
                  });
                  removeAllChild(parent);
              }
              responseArray._parent = parent;
              return;
          }
          if (responseArray.length === 0) {
              responseArray = value.map((item, index) => mapFn(item, itemFn, inputs, index, keyFn));
              responseArray.forEach(item => {
                  parent.appendChild(generateNode(item));
              });
              responseArray._parent = parent;
              return;
          }
          const newArr = value.map((item, index) => mapFn(item, itemFn, inputs, index, keyFn));
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
                  insertChildAtIndex(parent, index, generateNode(item));
              }
          });
          responseArray = newArr;
          responseArray._parent = parent;
      });
      return responseArray;
  }

  function getUrlDepth(url) {
      return url.replace(/\/$/, '').split('/').length;
  }
  function compareUrlDepth(urlA, urlB) {
      return getUrlDepth(urlB.path) - getUrlDepth(urlA.path);
  }
  class ModuleRouter extends Component {
      constructor(baseHref) {
          super();
          this.baseHref = baseHref;
          this._arrPaths = [];
          this._cUrl = fdValue('');
          this._cState = fdValue('');
          this._currentComp = null;
          this.template = {
              tag: 'div',
              classList: ['router-view'],
          };
          this.onPopState = (e) => {
              this.applyUrl((e.isTrusted ? e.state : this.baseHref + e.state).replace(/[\\\\/]+/g, '/'));
          };
          this.applyUrl = (url) => {
              const foundRoute = matchRoute(url, this._arrPaths);
              if (!foundRoute) {
                  return;
              }
              const pathItem = foundRoute.route;
              if (this._currentComp) {
                  callDeep(this._currentComp, 'destroy', true, true);
              }
              this._cState.value = pathItem.path;
              this._cUrl.value = url;
              removeAllChild(this.template.domNode);
              if (pathItem.resolver) {
                  const resolver = pathItem.resolver(foundRoute.params);
                  resolver.then((params) => {
                      this.createComponent(url, pathItem, params);
                  });
                  return;
              }
              this.createComponent(url, pathItem);
          };
          window.addEventListener('popstate', this.onPopState);
      }
      setPaths(paths = {}) {
          Object.keys(paths).forEach(path => {
              this._arrPaths.push({
                  component: paths[path].component,
                  title: paths[path].title,
                  path: clean((this.baseHref + path).replace(/[\\\\/]+/g, '/')),
                  resolver: paths[path].resolver,
              });
          });
          this._arrPaths.sort(compareUrlDepth);
          this.goToUrl('/');
      }
      createComponent(url, pathItem, params) {
          if (pathItem.title) {
              document.title = pathItem.title;
          }
          window.history.pushState(this._cUrl.value, document.title, this._cUrl.value);
          const component = pathItem.component(params);
          this._currentComp = component;
          Promise.resolve().then(() => {
              this.template.domNode.appendChild(generateNode(component));
          });
      }
      onDestroy() {
          window.removeEventListener('popstate', this.onPopState);
      }
      goToUrl(path) {
          if (this._cUrl.value === (this.baseHref + path).replace(/[\\\\/]+/g, '/')) {
              return;
          }
          dispatchEvent(new PopStateEvent('popstate', {
              state: path,
          }));
      }
      isCurrentRoute(url) {
          const item = matchRoute((this.baseHref + url).replace(/[\\\\/]+/g, '/'), [
              {
                  path: this._cState.value,
              },
          ]);
          if (!item) {
              return false;
          }
          return item.match[0] !== '' ? true : false;
      }
      getCurrentRoute() {
          return this._cUrl;
      }
      getCurrentState() {
          return this._cState;
      }
  }
  const Router = new ModuleRouter(window.location.pathname);
  function createRouter(paths) {
      Router.setPaths(paths);
      return Router.template;
  }

  function createCounter() {
      return createComponent(Counter);
  }
  class Counter extends Component {
      constructor() {
          super(...arguments);
          this.width = 100;
          this.reactive = {
              counter: fdValue(0),
          };
          this.onClick = () => {
              this.counter.value += 1;
          };
          this.template = {
              tag: "button",
              textValue: this.counter,
              listeners: {
                  click: this.onClick
              }
          };
      }
      get counter() {
          return this.reactive.counter;
      }
  }

  function createCounters(inputs) {
      return createComponent(CountersShared, inputs);
  }
  class CountersShared extends Component {
      constructor(input) {
          super();
          this.input = input;
          this.onClick = () => {
              this.counter.value += 1;
          };
          this.template = {
              tag: "button",
              textValue: this.counter,
              listeners: {
                  click: this.onClick
              }
          };
      }
      get counter() {
          return this.input.counter;
      }
      onInit() {
          console.log("init CountersShared");
      }
      onDestroy() {
          console.log("destroy CountersShared");
      }
  }

  function createExampleAttr() {
      return createComponent(DynamicAttr);
  }
  class DynamicAttr extends Component {
      constructor() {
          super(...arguments);
          this.reactive = {
              src: fdValue("https://www.w3schools.com/html/pic_trulli.jpg"),
              disabled: fdIf(false),
          };
          this.fdObjects = {
              imgAttrs: new fdObject({
                  src: this.src
              }),
              btnAttrs: new fdObject({
                  disabled: this.disabled
              }),
          };
          this.onClick = () => {
              this.src.value = "https://www.w3schools.com/html/img_girl.jpg";
          };
          this.changeBtnClick = () => {
              this.disabled.value = !this.disabled.value;
          };
          this.btnClick = () => {
              alert("hey");
          };
          this.template = {
              tag: "div",
              children: [
                  {
                      tag: "div",
                      children: [
                          {
                              tag: "span",
                              textValue: "Current state:"
                          },
                          {
                              tag: "span",
                              textValue: this.disabled
                          },
                          {
                              tag: "button",
                              attrs: this.fdObjects.btnAttrs,
                              textValue: "I am button",
                              listeners: {
                                  click: this.btnClick
                              }
                          },
                          {
                              tag: "button",
                              textValue: "Click me to change",
                              listeners: {
                                  click: this.changeBtnClick
                              }
                          }
                      ]
                  },
                  {
                      tag: "button",
                      textValue: "Click me",
                      listeners: {
                          click: this.onClick
                      }
                  },
                  {
                      tag: "span",
                      textValue: this.src
                  },
                  {
                      tag: "div",
                      children: [
                          {
                              tag: "img",
                              attrs: this.fdObjects.imgAttrs
                          }
                      ]
                  }
              ]
          };
      }
      get src() {
          return this.reactive.src;
      }
      get disabled() {
          return this.reactive.disabled;
      }
  }

  class Timer extends Component {
      constructor() {
          super(...arguments);
          this.reactive = {
              counter: fdValue(0),
              classOdd: fdIf(true),
          };
          this.fdObjects = {
              classList: new fdObject({
                  "odd": this.currentClass
              }),
          };
          this.template = {
              tag: "div",
              classList: this.fdObjects.classList,
              textValue: this.counter,
          };
      }
      get counter() {
          return this.reactive.counter;
      }
      get currentClass() {
          return this.reactive.classOdd;
      }
      onInit() {
          const timer = () => {
              this.timer = window.setTimeout(() => {
                  this.counter.value += 1;
                  this.currentClass.value = this.counter.value % 2 === 0 ? true : false;
                  timer();
              }, 1000);
          };
          timer();
      }
      onDestroy() {
          clearTimeout(this.timer);
      }
  }
  function createTimer() {
      return createComponent(Timer);
  }

  function createIf() {
      return createComponent(IfWithChild);
  }
  class IfWithChild extends Component {
      constructor() {
          super(...arguments);
          this.reactive = {
              show: fdIf(true),
              text: fdValue("Here timer")
          };
          this.onClick = () => {
              this.show.value = !this.show.value;
              this.text.value = this.show.value ? "Here timer" : "Sorry not timer";
          };
          this.template = {
              tag: "div",
              children: [
                  {
                      tag: "p",
                      children: [
                          {
                              tag: "span",
                              textValue: "Current value:"
                          },
                          {
                              tag: "span",
                              textValue: this.show
                          },
                      ]
                  },
                  {
                      tag: "button",
                      listeners: {
                          click: this.onClick,
                      },
                      textValue: "Change state"
                  },
                  {
                      tag: "div",
                      textValue: "You will see me always"
                  },
                  {
                      tag: "div",
                      show: this.show,
                      textValue: "You will sometimes"
                  }, {
                      tag: "div",
                      children: [
                          {
                              tag: "strong",
                              textValue: this.text
                          },
                          Object.assign({}, createTimer(), { show: this.show })
                      ]
                  }
              ]
          };
      }
      get show() {
          return this.reactive.show;
      }
      get text() {
          return this.reactive.text;
      }
  }

  function createStyles() {
      return createComponent(StylesComponent);
  }
  class StylesComponent extends Component {
      constructor() {
          super(...arguments);
          this.reactive = {
              bgFirstColor: fdValue("#" + ((1 << 24) * Math.random() | 0).toString(16)),
              bgSecondColor: fdValue("background-color: #" + ((1 << 24) * Math.random() | 0).toString(16) + ";user-select: none;")
          };
          this.fdStyles = {
              divFirstStyle: new fdObject({
                  'background-color': this.reactive.bgFirstColor,
                  'user-select': 'none',
              }),
              divSecondStyle: this.reactive.bgSecondColor,
          };
          this.onClick = () => {
              this.reactive.bgFirstColor.value = "#" + ((1 << 24) * Math.random() | 0).toString(16);
          };
          this.onClickSecond = () => {
              this.reactive.bgSecondColor.value = "background-color: #" + ((1 << 24) * Math.random() | 0).toString(16) + ";user-select: none;";
          };
          this.template = {
              tag: "div",
              children: [
                  {
                      tag: "div",
                      styles: this.fdStyles.divFirstStyle,
                      textValue: "Click me(change styles  object)",
                      listeners: {
                          click: this.onClick
                      }
                  },
                  {
                      tag: "div",
                      styles: this.fdStyles.divSecondStyle,
                      textValue: "Click me(change css string)",
                      listeners: {
                          click: this.onClickSecond
                      },
                  }
              ]
          };
      }
  }

  function createTodoItem(inputs) {
      return createComponent(TodoItem, inputs);
  }
  class TodoItem extends Component {
      constructor(input) {
          super();
          this.input = input;
          this.onClick = () => {
              this.todoList.value = this.todoList.value.filter((_, index) => index !== this.index);
          };
          this.template = {
              tag: "div",
              children: [
                  {
                      tag: "span",
                      textValue: this.textValue
                  },
                  {
                      tag: "button",
                      textValue: "remove",
                      listeners: {
                          click: this.onClick,
                      }
                  }
              ]
          };
      }
      get todoList() {
          return this.input.todoList;
      }
      get index() {
          return this.input.index;
      }
      get textValue() {
          return this.input.value;
      }
  }
  function createTodo() {
      return createComponent(Todo);
  }
  class Todo extends Component {
      constructor() {
          super(...arguments);
          this.reactive = {
              inputValue: fdValue(''),
              todoList: fdValue([])
          };
          this.fdObjects = {
              inputValueProp: new fdObject({
                  value: this.inputValue,
              }),
          };
          this.onInput = (e) => {
              this.inputValue.value = e.target.value;
          };
          this.onClick = () => {
              if (!this.inputValue.value) {
                  return;
              }
              this.todoList.value = [...this.todoList.value, this.inputValue.value];
              this.inputValue.value = '';
          };
          this.inputBlock = {
              tag: "input",
              attrs: {
                  placeholder: "Write here",
              },
              props: this.fdObjects.inputValueProp,
              listeners: {
                  input: this.onInput,
              }
          };
          this.template = {
              tag: "div",
              children: [
                  {
                      tag: "div",
                      children: [
                          this.inputBlock,
                          {
                              tag: "button",
                              textValue: "add Todo",
                              listeners: {
                                  click: this.onClick
                              }
                          }
                      ],
                  },
                  {
                      tag: "div",
                      children: [
                          fdFor(this.todoList, createTodoItem, {
                              todoList: this.todoList,
                              index: (e, i) => i,
                              value: (e) => e
                          })
                      ]
                  }
              ]
          };
      }
      get inputValue() {
          return this.reactive.inputValue;
      }
      get todoList() {
          return this.reactive.todoList;
      }
  }

  function createExampleRouter() {
      return createComponent(ExampleRouter);
  }
  function createTextNode(inputs = {}) {
      return createComponent(TextNode, inputs);
  }
  class TextNode extends Component {
      constructor(inputs) {
          super();
          this.inputs = inputs;
          this.template = {
              tag: "textNode",
              textValue: this.inputs.id,
          };
      }
  }
  class ExampleRouter extends Component {
      constructor() {
          super(...arguments);
          this.list = [
              {
                  name: 'Home',
                  path: '/',
                  click: () => {
                      Router.goToUrl('/');
                  }
              },
              {
                  name: 'Timer',
                  path: '/timer',
                  click: () => {
                      Router.goToUrl('/timer');
                  }
              },
              {
                  name: 'Todo',
                  path: '/todo',
                  click: () => {
                      Router.goToUrl('/todo');
                  }
              },
              {
                  name: 'If',
                  path: '/if',
                  click: () => {
                      Router.goToUrl('/if');
                  }
              },
              {
                  name: 'TextNode',
                  path: `/textNode/*`,
                  click: () => {
                      Router.goToUrl(`/textNode/${Math.random() * 500 | 0}`);
                  }
              },
              {
                  name: 'Styles',
                  path: `/styles`,
                  click: () => {
                      Router.goToUrl('/styles');
                  }
              },
          ];
          this.template = {
              tag: "div",
              children: [
                  fdFor(this.list, (el) => {
                      const obs = fdIf(false);
                      Router.getCurrentRoute().addSubscriber((value) => {
                          obs.value = Router.isCurrentRoute(el.item.path);
                      });
                      return {
                          tag: "button",
                          textValue: el.item.name,
                          classList: new fdObject({
                              current: obs,
                          }),
                          listeners: {
                              click: () => el.item.click()
                          }
                      };
                  }, {
                      item: (e) => e
                  }),
                  createRouter({
                      '/': {
                          component: createCounter,
                          title: "Home",
                      },
                      '/textNode/:id': {
                          component: createTextNode,
                          title: "TextNode with router param",
                          resolver: (params) => Promise.resolve(params),
                      },
                      '/timer': {
                          component: createTimer,
                          title: "Timer",
                      },
                      '/todo': {
                          component: createTodo,
                          title: "Todo",
                      },
                      '/if': {
                          component: createIf,
                          title: "If",
                      },
                      '/styles': {
                          component: createStyles,
                          title: 'Styles'
                      }
                  }),
              ]
          };
      }
  }

  function createDiv(inputs = {}) {
      return createComponent(DivBlock, inputs);
  }
  class DivBlock extends Component {
      constructor(inputs) {
          super();
          this.inputs = inputs;
          this.template = {
              tag: "div",
              children: [
                  {
                      tag: "span",
                      textValue: this.counter,
                  },
                  createCounters({ counter: this.counter })
              ]
          };
      }
      get counter() {
          return this.inputs.value;
      }
      onInit() {
          console.log(`Init ${this.counter.value}`);
      }
      onDestroy() {
          console.log(`Destroy ${this.counter.value}`);
      }
  }
  const obs = fdValue([]);
  function createObsFor() {
      return {
          tag: "div",
          children: [
              // Here we will on each changes obs, create createDiv with inputs { value: ...}
              fdFor(obs, createDiv, { value: (e) => fdValue(e) }, (item) => item) // we do map from obs to reactive value
          ]
      };
  }
  setTimeout(() => {
      obs.value = [1, 2, 3, 4, 5];
      setTimeout(() => {
          obs.value = [1];
          setTimeout(() => {
              obs.value = [1, 2, 3, 4, 5];
          }, 3000);
      }, 3000);
  }, 3000);

  function createSimpleFor() {
      return {
          tag: "div",
          children: [
              fdFor([1, 2, 3, 4, 5, 6, 7], {
                  tag: "div",
                  textValue: (e) => e,
              })
          ]
      };
  }

  function createSimpleForContainer() {
      return {
          tag: "div",
          children: [
              fdFor([1, 2, 3, 4, 5, 6, 7], createCounter)
          ]
      };
  }

  class TextComponent extends Component {
      constructor() {
          super(...arguments);
          this.reactive = {
              counter: fdValue(-10),
          };
          this.onClick = () => {
              this.counter.value += 1;
          };
          this.template = {
              tag: "div",
              children: [
                  {
                      tag: "button",
                      textValue: "Click me",
                      listeners: {
                          click: this.onClick
                      },
                  },
                  {
                      tag: "textNode",
                      textValue: this.counter
                  }
              ]
          };
      }
      get counter() {
          return this.reactive.counter;
      }
  }
  function createTextNode$1() {
      return createComponent(TextComponent);
  }

  const simpleStyle = document.getElementById("styles");
  simpleStyle.appendChild(generateNode(createStyles()));
  const simpleTodo = document.getElementById("todo");
  simpleTodo.appendChild(generateNode(createTodo()));
  const simpleTimerConainer = document.getElementById("timer");
  simpleTimerConainer.appendChild(generateNode(createTimer()));
  const simpleCounterConainer = document.getElementById("counter");
  simpleCounterConainer.appendChild(generateNode(createCounter()));
  simpleCounterConainer.appendChild(generateNode(createCounter()));
  const simpleCounterSharedConainer = document.getElementById("counter_input");
  const sharedValue = fdValue(0);
  simpleCounterSharedConainer.appendChild(generateNode(createCounters({ counter: sharedValue })));
  simpleCounterSharedConainer.appendChild(generateNode(createCounters({ counter: sharedValue })));
  simpleCounterSharedConainer.appendChild(generateNode(createCounters({ counter: sharedValue })));
  const simpleIfConainer = document.getElementById("simple_if");
  simpleIfConainer.appendChild(generateNode(createIf()));
  const simpleForConainer = document.getElementById("simple_for");
  simpleForConainer.appendChild(generateNode(createSimpleFor()));
  const simpleForComponentConainer = document.getElementById("simple_for_component");
  simpleForComponentConainer.appendChild(generateNode(createSimpleForContainer()));
  const obsForComponentConainer = document.getElementById("simple_for_obs");
  obsForComponentConainer.appendChild(generateNode(createObsFor()));
  const attrsComponentConainer = document.getElementById("attrs");
  attrsComponentConainer.appendChild(generateNode(createExampleAttr()));
  const textNodeComponentConainer = document.getElementById("text_node");
  textNodeComponentConainer.appendChild(generateNode(createTextNode$1()));
  const routerConainer = document.getElementById("router");
  routerConainer.appendChild(generateNode(createExampleRouter()));

}));
//# sourceMappingURL=bundle.js.map
