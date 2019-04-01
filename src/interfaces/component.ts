import { Component } from './../generators/component';

export type ClassConstructor<T extends Component> = new (...args: any[]) => T;

export type ComponentsInputs = Array<any>;
