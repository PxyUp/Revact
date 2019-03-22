import { Observer } from "../observer/observer";

export interface FastDomNode {
    tag: string;
    skip?: Observer<boolean> | boolean;
    attrs?: { [key: string]: any };
    parent?: HTMLElement;
    classList?: Array<string>;
    children?: Array<FastDomNode | HTMLElement | Comment>;
    listeners? : { [key: string]: any | Array<any> }
    textValue?: Observer<any> | string;
    instance?: any;
}
