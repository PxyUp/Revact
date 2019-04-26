!function(t){"function"==typeof define&&define.amd?define(t):t()}(function(){"use strict";var t=/([:*])(\w+)/g,e=/\*/g,n="([^/]+)",r="(?:.*)",o="(?:/$|$)",i="",a=!("undefined"==typeof window||!window.history||!window.history.pushState),c=window.requestIdleCallback||requestAnimationFrame||setTimeout;function u(t,e){"string"!=typeof e?requestAnimationFrame(function(){Object.keys(e).forEach(function(n){t.style.setProperty(n,e[n])})}):requestAnimationFrame(function(){t.style.cssText=e})}function s(t,e){Object.keys(e).forEach(function(n){e[n]||""===e[n]?t.setAttribute(n,e[n]):t.removeAttribute(n)})}function l(t,e){Object.keys(e).forEach(function(n){t[n]=e[n]})}function f(t,e){t&&e&&Object.keys(e).forEach(function(n){Array.isArray(e[n])?e[n].forEach(function(e){t.addEventListener(n,e)}):t.addEventListener(n,e[n])})}function p(t,e){t&&e&&Object.keys(e).forEach(function(n){Array.isArray(e[n])?e[n].forEach(function(e){t.removeEventListener(n,e)}):t.removeEventListener(n,e[n])})}function d(t){if(t)for(;t.firstChild;)t.removeChild(t.firstChild)}function h(t,e,n){for(var r,o,i=[],a=3;a<arguments.length;a++)i[a-3]=arguments[a];if(t){if(n)return t.children&&t.children.forEach(function(t){h.apply(void 0,[t,e,n].concat(i))}),void(t.instance&&(r=t.instance)[e].apply(r,i));t.instance&&(o=t.instance)[e].apply(o,i),t.children&&t.children.forEach(function(t){h.apply(void 0,[t,e,n].concat(i))})}}function v(t){return t instanceof RegExp?t:t.replace(/\/+$/,"").replace(/^\/+/,"^/")}function y(a,c){return void 0===c&&(c=[]),c.map(function(c){var u=function(a){var c,u=[];c=a instanceof RegExp?a:new RegExp(a.replace(t,function(t,e,r){return u.push(r),n}).replace(e,r)+o,i);return{regexp:c,paramNames:u}}(v(c.path)),s=u.regexp,l=u.paramNames,f=a.match(s),p=function(t,e){return 0===e.length?null:t?t.slice(1,t.length).reduce(function(t,n,r){return null===t&&(t={}),t[e[r]]=decodeURIComponent(n),t},null):null}(f,l);return!!f&&{match:f,route:c,params:p}}).filter(function(t){return t})}function b(t,e){return void 0===e&&(e=[]),y(function(t,e,n){void 0===e&&(e=!1),void 0===n&&(n="#");var r,o=function(t){return t.split(/\?(.*)?$/)[0]};return void 0===n&&(n="#"),a&&!e?o(t).split(n)[0]:(r=t.split(n)).length>1?o(r[1]):o(r[0])}(t),e)[0]||!1}function m(t,e){if(0!==e.length){var n=document.createDocumentFragment();e.forEach(function(t){Array.isArray(t)?m(n,t):n.appendChild(t)}),t.appendChild(n)}}var g=function(){function t(t,e){void 0===e&&(e=!1),this._value=t,this.forces=e,this.subscribers=[],this.isDestroy=!1,this.firstState=t}return Object.defineProperty(t.prototype,"value",{get:function(){return this._value},set:function(t){this.isDestroy||(this._value!==t||this.forces)&&(this._value=t,this.subscribers.length&&this.subscribers.forEach(function(e){e(t)}))},enumerable:!0,configurable:!0}),t.prototype.destroy=function(t){void 0===t&&(t=!1),this.isDestroy||(t&&(this.subscribers=[]),this.isDestroy=!0)},t.prototype.reInit=function(){this.isDestroy=!1,this.value=this.firstState},t.prototype.addSubscriber=function(t){this.isDestroy||this.subscribers.push(t)},t.prototype.removeSubscriber=function(t){var e=this.subscribers.indexOf(t);e>-1&&this.subscribers.splice(e,1)},t}(),x=function(){function t(t){void 0===t&&(t={});var e=this;this.obsArr=[],this.values={},this.obs=new g(this.values,!0),this.isDestroyed=!1,Object.keys(t).forEach(function(n){var r=t[n];"object"==typeof r?(e.obsArr.push(r),e.values[n]=r.value,r.addSubscriber(function(t){e.values[n]=t,e.obs.value=e.values})):e.values[n]=r})}return Object.defineProperty(t.prototype,"value",{get:function(){return this.obs.value},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"observer",{get:function(){return this.obs},enumerable:!0,configurable:!0}),t.prototype.reInit=function(){this.isDestroyed=!1,this.obs.reInit(),this.obsArr.forEach(function(t){t.reInit()})},t.prototype.destroy=function(t){void 0===t&&(t=!1),this.isDestroyed||(this.obs.destroy(t),this.obsArr.forEach(function(e){e.destroy(t)}),this.isDestroyed=!0)},t}(),w="instance";function k(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return{tag:"fragment",children:t}}function C(t){if(!1===t.show)return null;var e,n,r,o,i;if("textNode"===t.tag&&(e=document.createTextNode("")),"fragment"===t.tag&&(e=document.createDocumentFragment()),"textNode"!==t.tag&&"fragment"!==t.tag&&(e=document.createElement(t.tag)),t.domNode=e,null!==t.textValue||void 0!==t.textValue)if("object"==typeof t.textValue){var a=t.textValue;a.addSubscriber(function(t){e.textContent=t}),e.textContent=a.value}else e.textContent=t.textValue;if("textNode"!==t.tag){if(t.classList)if("string"==typeof t.classList)e.className=t.classList;else if(Array.isArray(t.classList))t.classList.forEach(function(t){e.classList.add(t)});else{n=t.classList;var c=t.classList.observer;Object.keys(c.value).forEach(function(t){return c.value[t]?e.classList.add(t):e.classList.remove(t)}),c.addSubscriber(function(t){Object.keys(t).forEach(function(n){return t[n]?e.classList.add(n):e.classList.remove(n)})})}if(t.props)if(t.props instanceof x){o=t.props;var d=t.props.observer;l(e,d.value),d.addSubscriber(function(t){l(e,t)})}else l(e,t.props);if(t.styles)if(t.styles instanceof x){var v=(i=t.styles).observer;u(e,v.value),v.addSubscriber(function(t){u(e,t)})}else t.styles instanceof g?(i=t.styles,u(e,i.value),i.addSubscriber(function(t){u(e,t)})):u(e,t.styles);if(t.attrs)if(t.attrs instanceof x){r=t.attrs;var y=t.attrs.observer;s(e,y.value),y.addSubscriber(function(t){s(e,t)})}else s(e,t.attrs);if(t.children){var b=[];t.children.forEach(function(t){if(t){if(Array.isArray(t)){var n=[];return t.forEach(function(t){if(t.tag){var r=C(Object.assign(t,{parent:e}));r&&n.push(r)}else n.push(t)}),t._parent=e,void b.push(n)}if(t.tag){var r=C(Object.assign(t,{parent:e}));r&&b.push(r)}else b.push(t)}}),m(e,b)}t.listeners&&f(e,t.listeners)}t.instance&&(e[w]=t.instance);var k=function(){"textNode"!==t.tag&&p(e,t.listeners),r&&r.destroy(),o&&o.destroy(),n&&n.destroy(),i&&n.destroy(),h(t,"destroy",!0)};if("object"==typeof t.show){var S=document.createComment("");return t.show.addSubscriber(function(a){var c=t.parent?t.parent:null;a?c&&(S.parentNode===c&&c.replaceChild(e,S),h(t,"reInit",!1),i&&n.reInit(),n&&n.reInit(),o&&o.reInit(),r&&r.reInit(),"textNode"!==t.tag&&f(e,t.listeners)):c&&(k(),e.parentNode===c&&c.replaceChild(S,e))}),t.show.value?(t.instance&&t.instance.onInit(),e):(k(),S)}return t.instance&&t.instance.onInit(),e}function S(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=new(t.bind.apply(t,[void 0].concat(e)));return r.template.instance=r,r.template}var j=function(){function t(){this.reactive={},this.fdObjects={},this.fdStyles={}}return t.prototype.onDestroy=function(){},t.prototype.onInit=function(){},t.prototype.reInit=function(){var t=this;Object.keys(this.fdStyles).forEach(function(e){t.fdStyles[e].reInit()}),Object.keys(this.fdObjects).forEach(function(e){t.fdObjects[e].reInit()}),Object.keys(this.reactive).forEach(function(e){t.reactive[e].reInit()}),this.onInit()},t.prototype.destroy=function(){for(var t=this,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];!0===e[0]&&function t(e){e.listeners&&p(e.domNode,e.listeners),e.children&&e.children.forEach(function(e){!e.instance&&e.tag&&t(e)})}(this.template),Object.keys(this.fdObjects).forEach(function(n){var r;(r=t.fdObjects[n]).destroy.apply(r,e)}),Object.keys(this.reactive).forEach(function(n){var r;(r=t.reactive[n]).destroy.apply(r,e)}),Object.keys(this.fdStyles).forEach(function(n){var r;(r=t.fdStyles[n]).destroy.apply(r,e)}),this.onDestroy()},t}(),O=function(t,e){return(O=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)};function E(t,e){function n(){this.constructor=t}O(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}var V=function(){return(V=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function _(t){return L(t)}function L(t,e){return void 0===e&&(e=!1),new g(t,e)}function P(t,e,n,r,o){void 0===n&&(n=[]);var i,a,c,u,s=!1;return o?(a=o,i=t):(u=typeof(c=t),i=(s=null===c||"object"!==u&&"function"!==u)?{id:r,value:t}:t,a=function(){return i}),"function"==typeof e?V({},e.apply(void 0,n.map(function(e){return"function"==typeof e?e(s?i.value:t):e}).concat([r])),{fdKey:a(i)}):V({},e,{textValue:e.textValue(s?i.value:t),fdKey:a(i)})}function I(t,e,n,r){if(void 0===n&&(n=[]),Array.isArray(t))return t.map(function(t,o){return P(t,e,n,o,r)});var o=new Map,i=t.value.map(function(t,i){var a=P(t,e,n,i,r);return o.set(a.fdKey,i),a});return t.addSubscriber(function(t){var a=i._parent,u=i.length;if(0===t.length){if(u){d(a);var s=i.slice();c(function(){s.forEach(function(t){h(t,"destroy",!0,!0)})})}return i=t,o.clear(),void(i._parent=a)}if(0===u){i=t.map(function(t,i){var a=P(t,e,n,i,r);return o.set(a.fdKey,i),a});var l=[];return i.forEach(function(t){l.push(C(t))}),m(a,l),void(i._parent=a)}for(var f=[],p=t.map(function(t,o){return P(t,e,n,o,r)}),v=[],y=0;y<u;y++)v.push(!1);var b=p.map(function(t){var e=o.get(t.fdKey);return void 0!==e?[t,e]:[t,-1]});b.forEach(function(t){var e=t[1];e>-1&&(v[e]=!0)}),v.forEach(function(t,e){t||(a.removeChild(i[e].domNode),f.push(i[e]))}),c(function(){f.forEach(function(t){h(t,"destroy",!0,!0)})});var g=0,x=[];b.forEach(function(t,e){var n=t[0],r=t[1];if(-1===r)return x.push(C(n)),void(g+=1);i[r].domNode!==a.children[e+g]&&(a.insertBefore(i[r].domNode,a.children[e+g]),g+=1)}),m(a,x),o.clear(),p.forEach(function(t,e){t.domNode=a.children[e],o.set(t.fdKey,e)}),(i=p)._parent=a}),i}function A(t){return t.replace(/\/$/,"").split("/").length}function N(t,e){return A(e.path)-A(t.path)}var T=new(function(t){function e(e){var n=t.call(this)||this;return n.baseHref=e,n._arrPaths=[],n._cUrl=L(""),n._cState=L(""),n._currentComp=null,n.template={tag:"div",classList:["router-view"]},n.onPopState=function(t){n.applyUrl((t.isTrusted?t.state:n.baseHref+t.state).replace(/[\\\\\/]+/g,"/"))},n.applyUrl=function(t){var e=b(t,n._arrPaths);if(e){var r=e.route;if(n._currentComp&&h(n._currentComp,"destroy",!0,!0),n._cState.value=r.path,n._cUrl.value=t,d(n.template.domNode),r.resolver)r.resolver(e.params).then(function(e){n.createComponent(t,r,e)});else n.createComponent(t,r)}},window.addEventListener("popstate",n.onPopState),n}return E(e,t),e.prototype.setPaths=function(t){var e=this;void 0===t&&(t={}),Object.keys(t).forEach(function(n){e._arrPaths.push({component:t[n].component,title:t[n].title,path:v((e.baseHref+n).replace(/[\\\\\/]+/g,"/")),resolver:t[n].resolver})}),this._arrPaths.sort(N),this.initRouter()},e.prototype.initRouter=function(){this.applyUrl(window.location.pathname.replace(/[\\\\\/]+/g,"/"))},e.prototype.createComponent=function(t,e,n){var r=this;e.title&&("function"==typeof e.title?document.title=e.title(n):document.title=e.title),window.history.pushState(this._cUrl.value,document.title,this._cUrl.value);var o=e.component(n);this._currentComp=o,Promise.resolve().then(function(){r.template.domNode.appendChild(C(o))})},e.prototype.onDestroy=function(){window.removeEventListener("popstate",this.onPopState)},e.prototype.goToUrl=function(t){this._cUrl.value!==(this.baseHref+t).replace(/[\\\\\/]+/g,"/")&&dispatchEvent(new PopStateEvent("popstate",{state:t}))},e.prototype.isCurrentRoute=function(t){var e=b((this.baseHref+t).replace(/[\\\\\/]+/g,"/"),[{path:this._cState.value}]);return!!e&&""!==e.match[0]},e.prototype.getCurrentRoute=function(){return this._cUrl},e.prototype.getCurrentState=function(){return this._cState},e}(j))(window.location.pathname);function D(t,e){for(var n=[],r=2;r<arguments.length;r++)n[r-2]=arguments[r];var o=document.querySelector(t);if(!o)throw Error('FastDOM Bootstrap Error: No container found for selector "'+t+'"');o.appendChild(C(e.call.apply(e,[e].concat(n))))}function U(t,e){if(0!==t.length){var n=function(t){return e.apply(void 0,t.map(function(t){return t.value}))},r=n(t),o=new g(r);return t.forEach(function(e){e instanceof g?e.addSubscriber(function(){o.value=n(t)}):e.observer.addSubscriber(function(){o.value=n(t)})}),o}}var F=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.a=L(0),e.b=L(0),e.reactive={a:e.a,b:e.b,sum:U([e.a,e.b],function(t,e){return t+e})},e.template={tag:"div",children:[{tag:"button",textValue:e.a,listeners:{click:function(){e.a.value+=1}}},{tag:"button",textValue:e.b,listeners:{click:function(){e.b.value+=1}}},{tag:"p",textValue:e.reactive.sum}]},e}return E(e,t),e.prototype.onInit=function(){},e}(j);function H(){return S(R)}var R=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.width=100,e.reactive={counter:L(0)},e.onClick=function(){e.counter.value+=1},e.template={tag:"button",textValue:e.counter,listeners:{click:e.onClick}},e}return E(e,t),Object.defineProperty(e.prototype,"counter",{get:function(){return this.reactive.counter},enumerable:!0,configurable:!0}),e}(j);function M(t){return S(q,t)}var q=function(t){function e(e){var n=t.call(this)||this;return n.counter=e,n.onClick=function(){n.counter.value+=1},n.template={tag:"button",textValue:n.counter,listeners:{click:n.onClick}},n}return E(e,t),e.prototype.onInit=function(){console.log("init CountersShared")},e.prototype.onDestroy=function(){console.log("destroy CountersShared")},e}(j);var B=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.reactive={src:L("https://www.w3schools.com/html/pic_trulli.jpg"),disabled:_(!1)},e.fdObjects={imgAttrs:new x({src:e.src}),btnAttrs:new x({disabled:e.disabled})},e.onClick=function(){e.src.value="https://www.w3schools.com/html/img_girl.jpg"},e.changeBtnClick=function(){e.disabled.value=!e.disabled.value},e.btnClick=function(){alert("hey")},e.template={tag:"div",children:[{tag:"div",children:[{tag:"span",textValue:"Current state:"},{tag:"span",textValue:e.disabled},{tag:"button",attrs:e.fdObjects.btnAttrs,textValue:"I am button",listeners:{click:e.btnClick}},{tag:"button",textValue:"Click me to change",listeners:{click:e.changeBtnClick}}]},{tag:"button",textValue:"Click me",listeners:{click:e.onClick}},{tag:"span",textValue:e.src},{tag:"div",children:[{tag:"img",attrs:e.fdObjects.imgAttrs}]}]},e}return E(e,t),Object.defineProperty(e.prototype,"src",{get:function(){return this.reactive.src},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"disabled",{get:function(){return this.reactive.disabled},enumerable:!0,configurable:!0}),e}(j),K=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.reactive={counter:L(0),classOdd:_(!0)},e.fdObjects={classList:new x({odd:e.currentClass})},e.template={tag:"div",classList:e.fdObjects.classList,textValue:e.counter},e}return E(e,t),Object.defineProperty(e.prototype,"counter",{get:function(){return this.reactive.counter},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"currentClass",{get:function(){return this.reactive.classOdd},enumerable:!0,configurable:!0}),e.prototype.onInit=function(){var t=this,e=function(){t.timer=window.setTimeout(function(){t.counter.value+=1,t.currentClass.value=t.counter.value%2==0,e()},1e3)};e()},e.prototype.onDestroy=function(){clearTimeout(this.timer)},e}(j);function $(){return S(K)}function Y(){return S(z)}var z=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.reactive={show:_(!0),text:L("Here timer")},e.onClick=function(){e.show.value=!e.show.value,e.text.value=e.show.value?"Here timer":"Sorry not timer"},e.template={tag:"div",children:[{tag:"p",children:[{tag:"span",textValue:"Current value:"},{tag:"span",textValue:e.show}]},{tag:"button",listeners:{click:e.onClick},textValue:"Change state"},{tag:"div",textValue:"You will see me always"},{tag:"div",show:e.show,textValue:"You will sometimes"},{tag:"div",children:[{tag:"strong",textValue:e.text},V({},$(),{show:e.show})]}]},e}return E(e,t),Object.defineProperty(e.prototype,"show",{get:function(){return this.reactive.show},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"text",{get:function(){return this.reactive.text},enumerable:!0,configurable:!0}),e}(j);function W(){return S(X)}var X=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.reactive={bgFirstColor:L("#"+((1<<24)*Math.random()|0).toString(16)),bgSecondColor:L("background-color: #"+((1<<24)*Math.random()|0).toString(16)+";user-select: none;")},e.fdStyles={divFirstStyle:new x({"background-color":e.reactive.bgFirstColor,"user-select":"none"}),divSecondStyle:e.reactive.bgSecondColor},e.onClick=function(){e.reactive.bgFirstColor.value="#"+((1<<24)*Math.random()|0).toString(16)},e.onClickSecond=function(){e.reactive.bgSecondColor.value="background-color: #"+((1<<24)*Math.random()|0).toString(16)+";user-select: none;"},e.template={tag:"div",children:[{tag:"div",styles:e.fdStyles.divFirstStyle,textValue:"Click me(change styles  object)",listeners:{click:e.onClick}},{tag:"div",styles:e.fdStyles.divSecondStyle,textValue:"Click me(change css string)",listeners:{click:e.onClickSecond}}]},e}return E(e,t),e}(j);function Z(t,e){return S(G,t,e)}var G=function(t){function e(e,n){var r=t.call(this)||this;return r.todoList=e,r.value=n,r.onClick=function(){r.todoList.value=r.todoList.value.filter(function(t){return t!==r.value})},r.template={tag:"div",children:[{tag:"span",textValue:r.value.label},{tag:"button",textValue:"remove",listeners:{click:r.onClick}}]},r}return E(e,t),e}(j);function J(){return S(Q)}var Q=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.reactive={inputValue:L(""),todoList:L([])},e.fdObjects={inputValueProp:new x({value:e.inputValue})},e.onInput=function(t){e.inputValue.value=t.target.value},e.onClick=function(){e.inputValue.value&&(e.todoList.value=e.todoList.value.concat([{label:e.inputValue.value}]),e.inputValue.value="")},e.inputBlock={tag:"input",attrs:{placeholder:"Write here"},props:e.fdObjects.inputValueProp,listeners:{input:e.onInput}},e.template={tag:"div",children:[{tag:"div",children:[e.inputBlock,{tag:"button",textValue:"add Todo",listeners:{click:e.onClick}}]},{tag:"div",children:[I(e.todoList,Z,[e.todoList,function(t){return t}])]}]},e}return E(e,t),Object.defineProperty(e.prototype,"inputValue",{get:function(){return this.reactive.inputValue},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"todoList",{get:function(){return this.reactive.todoList},enumerable:!0,configurable:!0}),e}(j);function tt(t){return void 0===t&&(t={}),S(et,t)}var et=function(t){function e(e){var n=t.call(this)||this;return n.inputs=e,n.template={tag:"textNode",textValue:n.inputs.id},n}return E(e,t),e}(j),nt=function(t){function e(){var e,n=null!==t&&t.apply(this,arguments)||this;return n.list=[{name:"Home",path:"/",click:function(){T.goToUrl("/")}},{name:"Timer",path:"/timer",click:function(){T.goToUrl("/timer")}},{name:"Todo",path:"/todo",click:function(){T.goToUrl("/todo")}},{name:"If",path:"/if",click:function(){T.goToUrl("/if")}},{name:"TextNode",path:"/textNode/*",click:function(){T.goToUrl("/textNode/"+(500*Math.random()|0))}},{name:"Styles",path:"/styles",click:function(){T.goToUrl("/styles")}}],n.template={tag:"div",children:[I(n.list,function(t){var e=_(!1);return T.getCurrentRoute().addSubscriber(function(n){e.value=T.isCurrentRoute(t.path)}),{tag:"button",textValue:t.name,classList:new x({current:e}),listeners:{click:function(){return t.click()}}}},[function(t){return t}]),(e={"/":{component:H,title:"Home"},"/textNode/:id":{component:tt,resolver:function(t){return Promise.resolve(V({},t,{title:"Route title "+t.id}))},title:function(t){return"TextNode with "+t.title}},"/timer":{component:$,title:"Timer"},"/todo":{component:J,title:"Todo"},"/if":{component:Y,title:"If"},"/styles":{component:W,title:"Styles"}},T.setPaths(e),T.template)]},n}return E(e,t),e}(j);function rt(t){return S(ot,t)}var ot=function(t){function e(e){var n=t.call(this)||this;return n.counter=e,n.template={tag:"div",children:[{tag:"span",textValue:n.counter},M(n.counter)]},n}return E(e,t),e.prototype.onInit=function(){console.log("Init "+this.counter.value)},e.prototype.onDestroy=function(){console.log("Destroy "+this.counter.value)},e}(j),it=L([]);setTimeout(function(){it.value=[1,2,3,4,5],setTimeout(function(){it.value=[1]},3e3)},3e3);var at=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.reactive={counter:L(-10)},e.onClick=function(){e.counter.value+=1},e.template={tag:"div",children:[{tag:"button",textValue:"Click me",listeners:{click:e.onClick}},{tag:"textNode",textValue:e.counter}]},e}return E(e,t),Object.defineProperty(e.prototype,"counter",{get:function(){return this.reactive.counter},enumerable:!0,configurable:!0}),e}(j);var ct={position:"absolute",background:"#61dafb",font:"normal 15px sans-serif","text-align":"center",cursor:"pointer"},ut=25,st=function(t){function e(e,n,r,o){var i=t.call(this)||this;return i.x=e,i.y=n,i.size=r,i.text=o,i.hover=_(!1),i.privateText=U([i.hover,i.text],function(t,e){return t?"*"+e+"*":e}),i.styles=U([i.hover],function(t){var e=1.3*i.size;return V({},ct,{width:e+"px",height:e+"px",left:i.x+"px",top:i.y+"px","border-radius":e/2+"px","line-height":e+"px",background:t?"#ff0":ct.background})}),i.onHover=function(){i.hover.value=!0},i.onLeave=function(){i.hover.value=!1},i.template={tag:"div",textValue:i.privateText,styles:i.styles,listeners:{mouseenter:i.onHover,mouseleave:i.onLeave}},i}return E(e,t),e}(j);var lt=function(t){function e(e,n,r,o){var i=t.call(this)||this;return i.x=e,i.y=n,i.s=r,i.second=o,i.template=i.s<=ut?k(function(t,e,n,r){return S(st,t,e,n,r)}(i.x-ut/2,i.y-ut/2,ut,i.second)):k(ft(i.x,i.y-i.s/4,i.s/2,i.second),ft(i.x-i.s/2,i.y+i.s/4,i.s/2,i.second),ft(i.x+i.s/2,i.y+i.s/4,i.s/2,i.second)),i}return E(e,t),e}(j);function ft(t,e,n,r){return S(lt,t,e,n,r)}var pt=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.start=Date.now(),e.seconds=L(0),e.scale=L(0),e.elapsed=L(0),e.style=U([e.scale],function(t){return{position:"absolute","transform-origin":"0px 0px",left:"50%",top:"50%",width:"10px",height:"10px",background:"#eee",transform:"scaleX("+t/2.1+") scaleY(0.7) translateZ(0.1px)"}}),e.template={tag:"div",styles:e.style,children:[ft(0,0,1e3,e.seconds)]},e}return E(e,t),e.prototype.onInit=function(){var t=this,e=function(){t.elapsed.value=Date.now()-t.start;var n=t.elapsed.value/1e3%10;t.scale.value=1+(n>5?10-n:n)/10,window.requestAnimationFrame(function(){e()})},n=function(){t.seconds.value=t.seconds.value>9?0:t.seconds.value+1,setTimeout(function(){n()},1e3)};e(),n()},e}(j);D("#styles",W),D("#todo",J),D("#timer",$),D("#counter",H),D("#counter",H);var dt=L(0);D("#counter_input",M,dt),D("#counter_input",M,dt),D("#counter_input",M,dt),D("#simple_if",Y),D("#simple_for",function(){return{tag:"div",children:[I([1,2,3,4,5,6,7],{tag:"div",textValue:function(t){return t}})]}}),D("#simple_for_component",function(){return{tag:"div",children:[I([1,2,3,4,5,6,7],H)]}}),D("#simple_for_obs",function(){return{tag:"div",children:[I(it,rt,[function(t){return L(t)}],function(t){return t})]}}),D("#attrs",function(){return S(B)}),D("#text_node",function(){return S(at)}),D("#router",function(){return S(nt)}),D("#composite",function(){return S(F)}),D("#radi",function(){return S(pt)})});
//# sourceMappingURL=bundle.js.map
