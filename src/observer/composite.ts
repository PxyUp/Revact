import { Observer } from './observer';

/**
 *
 * @param arr Array of observer
 * @param results function for calculate
 */
export function Composite(
  arr: Array<Observer<any>>,
  results: (...args: any[]) => any,
): Observer<any> {
  if (arr.length === 0) {
    return;
  }

  const getValue = (list: Array<Observer<any>>) => {
    return results(...list.map(e => e.value));
  };

  const initValue = getValue(arr);
  const resultsObs = new Observer(initValue);

  arr.forEach(item => {
    item.addSubscriber(() => {
      resultsObs.value = getValue(arr);
    });
  });

  return resultsObs;
}
