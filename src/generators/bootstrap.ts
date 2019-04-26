import { RevactNode } from '../interfaces/node';
import { generateNode } from './node';

/**
 * Bootstrap a Revact application to your DOM.
 * @param selector String
 * @param factoryFn Function
 * @param factoryArgs Array
 * @example
    import 'bootstrap' from 'revact'
    import { createMyComponent } from './MyComponent'
    import { MyComponentPropOne, MyComponentPropTwo } from './types'

    bootstrap('#root', createMyComponent, 'my prop one', { mySecondProp: 'foo bar' })

 *
 */
export function bootstrap<T extends (...args: any[]) => RevactNode>(
  selector: string,
  factoryFn: T,
  ...factoryArgs: Parameters<T>
): void {
  const selectorContainer = document.querySelector(selector);

  if (!selectorContainer) {
    throw Error(`Revact Bootstrap Error: No container found for selector "${selector}"`);
  }

  selectorContainer.appendChild(generateNode(factoryFn.call(factoryFn, ...factoryArgs)));
}
