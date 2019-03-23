import { Observer } from "../observer/observer";
import { fdClasses } from "../observer/fdClasses";

export interface FastDomNode {
    tag: string;
    skip?: Observer<boolean> | boolean;
    attrs?: { [key: string]: any };
    parent?: HTMLElement;
    classList?: Array<string> | fdClasses;
    children?: Array<FastDomNode | HTMLElement | Comment | Array<any>>;
    listeners? : { [key: string]: any | Array<any> }
    textValue?: Observer<any> | string;
    instance?: any;
}
