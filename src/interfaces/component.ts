export interface ClassConstructor<T> {
  new (inputs?: ComponentsInputs): T;
}

export type ComponentsInputs = { [key: string]: any };
