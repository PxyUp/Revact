import { Observer } from "../observer/observer";
import { fdObject } from "../observer/fdObject";

export interface FastDomNode {
    tag: string;
    skip?: Observer<boolean> | boolean;
    attrs?: { [key: string]: any } | fdObject<any>;
    parent?: HTMLElement;
    classList?: Array<string> | fdObject<boolean>;
    children?: Array<FastDomNode | HTMLElement | Comment | Array<any>>;
    listeners? : { [key: string]: any | Array<any> }
    textValue?: Observer<any> | string;
    instance?: any;
}
