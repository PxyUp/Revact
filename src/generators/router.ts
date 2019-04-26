import { Paths, RevactNode } from '../interfaces/index';
import { RouteParams, RouterPath } from '../interfaces/router';
import { callDeep, clean, matchRoute, removeAllChild } from '../misc/misc';

import { Component } from './component';
import { generateNode } from './node';
import { rValue } from '../misc/directives';

function getUrlDepth(url: string) {
  return url.replace(/\/$/, '').split('/').length;
}

function compareUrlDepth(urlA: RouterPath, urlB: RouterPath) {
  return getUrlDepth(urlB.path as string) - getUrlDepth(urlA.path as string);
}

export class ModuleRouter extends Component {
  private _arrPaths: Array<RouterPath> = [];
  private _cUrl = rValue('');
  private _cState = rValue('');
  private _currentComp: RevactNode = null;

  template: RevactNode = {
    tag: 'div',
    classList: ['router-view'],
  };

  public setPaths(paths: Paths = {}) {
    Object.keys(paths).forEach(path => {
      this._arrPaths.push({
        component: paths[path].component,
        title: paths[path].title,
        path: clean((this.baseHref + path).replace(/[\\\\/]+/g, '/')),
        resolver: paths[path].resolver,
      });
    });
    this._arrPaths.sort(compareUrlDepth);
    this.initRouter();
  }

  private onPopState = (e: PopStateEvent) => {
    this.applyUrl((e.isTrusted ? e.state : this.baseHref + e.state).replace(/[\\\\/]+/g, '/'));
  };

  private initRouter() {
    this.applyUrl(window.location.pathname.replace(/[\\\\/]+/g, '/'));
  }

  private applyUrl = (url: string) => {
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
    removeAllChild(this.template.domNode as HTMLElement);
    if (pathItem.resolver) {
      const resolver = pathItem.resolver(foundRoute.params);
      resolver.then((params: RouteParams) => {
        this.createComponent(url, pathItem, params);
      });
      return;
    }
    this.createComponent(url, pathItem);
  };

  private createComponent(url: string, pathItem: RouterPath, params?: RouteParams) {
    if (pathItem.title) {
      if (typeof pathItem.title === 'function') {
        document.title = pathItem.title(params);
      } else {
        document.title = pathItem.title;
      }
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

  goToUrl(path: string) {
    if (this._cUrl.value === (this.baseHref + path).replace(/[\\\\/]+/g, '/')) {
      return;
    }
    dispatchEvent(
      new PopStateEvent('popstate', {
        state: path,
      }),
    );
  }

  public isCurrentRoute(url: string): boolean {
    const item = matchRoute((this.baseHref + url).replace(/[\\\\/]+/g, '/'), [
      {
        path: this._cState.value,
      } as any,
    ]);
    if (!item) {
      return false;
    }
    return item.match[0] !== '' ? true : false;
  }

  public getCurrentRoute() {
    return this._cUrl;
  }

  public getCurrentState() {
    return this._cState;
  }

  constructor(private baseHref: string) {
    super();
    window.addEventListener('popstate', this.onPopState);
  }
}

export const Router = new ModuleRouter(window.location.pathname);

export function createRouter(paths: Paths) {
  Router.setPaths(paths);
  return Router.template;
}
