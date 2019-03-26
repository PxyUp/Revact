import { FastDomNode, Paths } from '../interfaces/index';
import { RouteParams, RouterPath } from '../interfaces/router';
import { callDeep, clean, matchRoute, removeAllChild } from '../misc/misc';

import { Component } from './component';
import { generateNode } from './node';

function getUrlDepth(url: string) {
  return url.replace(/\/$/, '').split('/').length;
}

function compareUrlDepth(urlA: RouterPath, urlB: RouterPath) {
  return getUrlDepth(urlB.path as string) - getUrlDepth(urlA.path as string);
}

export class ModuleRouter extends Component {
  private _arrPaths: Array<RouterPath> = [];
  private _cUrl: string = '';
  private _currentComp: FastDomNode = null;

  template: FastDomNode = {
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
  }

  private onPopState = (e: PopStateEvent) => {
    this.applyUrl((e.isTrusted ? e.state : this.baseHref + e.state).replace(/[\\\\/]+/g, '/'));
  };

  private applyUrl = (url: string) => {
    console.log(url, this._arrPaths);
    const foundRoute = matchRoute(url, this._arrPaths);
    if (!foundRoute) {
      return;
    }
    const pathItem = foundRoute.route;
    if (this._currentComp) {
      callDeep(this._currentComp, 'destroy', true, true);
    }
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

  createComponent(url: string, pathItem: RouterPath, params?: RouteParams) {
    if (pathItem.title) {
      document.title = pathItem.title;
    }
    this._cUrl = url;
    const component = pathItem.component(params);
    this.template.domNode.appendChild(generateNode(component));
    this._currentComp = component;
    window.history.pushState(this._cUrl, document.title, this._cUrl);
  }

  onInit() {
    window.addEventListener('popstate', this.onPopState);
    this.goToUrl('/');
  }

  onDestroy() {
    window.removeEventListener('popstate', this.onPopState);
  }

  goToUrl(path: string) {
    if (this._cUrl === path) {
      return;
    }
    dispatchEvent(
      new PopStateEvent('popstate', {
        state: path,
      }),
    );
  }

  constructor(private baseHref: string) {
    super();
  }
}

export const Router = new ModuleRouter(window.location.pathname);

export function createRouter(paths: Paths) {
  Router.setPaths(paths);
  return Router.template;
}
