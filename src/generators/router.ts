import { FastDomNode, Paths } from '../interfaces/index';
import { callDeep, removeAllChild } from '../misc/misc';

import { Component } from './component';
import { RouterPath } from '../interfaces/router';
import { fdIf } from '../misc/directives';
import { generateNode } from './node';

class ModuleRouter extends Component {
  private _paths: { [key: string]: RouterPath } = {};
  private _cUrl: string = '';
  private _currentComp: FastDomNode = null;

  template: FastDomNode = {
    tag: 'div',
    classList: ['router-view'],
  };

  public setPaths(paths: Paths = {}) {
    const _paths = {} as { [key: string]: RouterPath };
    Object.keys(paths).forEach(path => {
      _paths[path] = {
        component: paths[path].component,
        title: paths[path].title,
        path: path,
      };
    });
    this._paths = _paths;
  }

  private onPopState = (e: PopStateEvent) => {
    this.applyUrl(e.state);
  };

  private applyUrl = (url: string) => {
    const key = Object.keys(this._paths).find(path => path === url);
    if (!key) {
      return;
    }
    const pathItem = this._paths[key];
    if (this._currentComp) {
      callDeep(this._currentComp, 'destroy', true, true);
    }
    removeAllChild(this.template.domNode as HTMLElement);
    if (pathItem.title) {
      document.title = pathItem.title;
    }
    this._cUrl = pathItem.path;
    const component = pathItem.component();
    this.template.domNode.appendChild(generateNode(component));
    if (component.instance) {
      component.instance.onInit();
    }
    this._currentComp = component;
    window.history.pushState(pathItem.path, document.title, pathItem.path);
  };

  onInit() {
    window.addEventListener('popstate', this.onPopState);
    this.goToUrl(window.location.pathname);
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
}

export const Router = new ModuleRouter();

export function createRouter(paths: Paths) {
  Router.setPaths(paths);
  setTimeout(() => {
    Router.onInit();
  });
  return Router.template;
}
