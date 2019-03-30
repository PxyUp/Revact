import { Component } from './../generators/component';

export interface ClassConstructor<T extends Component> {
  new (...args: any[]): T;
}

export type ComponentsInputs = { [key: string]: any };
