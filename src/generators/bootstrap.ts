import { FastDomNode } from '../interfaces/node';
import { generateNode } from './node';

/**
 * Bootstrap a FastDOM application to your DOM.
 * @param selector String
 * @param factoryFn Function
 * @param factoryArgs Array
 * @example
    import 'bootstrap' from 'faster-dom'
    import { createMyComponent } from './MyComponent'
    import { MyComponentPropOne, MyComponentPropTwo } from './types'

    bootstrap<[
      MyComponentPropOne,
      MyComponentPropTwo
    ]>('#root', createMyComponent, 'my prop one', { mySecondProp: 'foo bar' })

 * </example>
 */
export function bootstrap<F extends any[]>(
  selector: string,
  factoryFn: (args?: F) => FastDomNode,
  ...factoryArgs: F
): void {
  const selectorContainer = document.querySelector(selector);

  if (!selectorContainer) {
    throw Error(`FastDOM Bootstrap Error: No container found for selector "${selector}"`);
  }

  selectorContainer.appendChild(generateNode(factoryFn.apply(factoryFn, factoryArgs)));
}
