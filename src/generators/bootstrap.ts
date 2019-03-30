import { FastDomNode } from '../interfaces/node';
import { generateNode } from './node';

/**
 * Bootstrap a FastDOM application to your DOM.
 * @param selector String
 * @param factoryFn Function
 * @param factoryArgs Array
 */
export function bootstrap<F = any>(
  selector: string,
  factoryFn: (args?: Array<F>) => FastDomNode,
  ...factoryArgs: Array<F>
): void {
  const selectorContainer = document.querySelector(selector);

  if (!selectorContainer) {
    throw Error(`FastDOM Bootstrap Error: No container found for selector "${selector}"`);
  }

  selectorContainer.appendChild(generateNode(factoryFn.apply(factoryFn, factoryArgs)));
}
