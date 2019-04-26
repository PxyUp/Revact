import { Component, composite, createComponent, rValue } from '../../src';

class CompositeComp extends Component {
    private a = rValue(0);
    private b = rValue(0);
    
    rValues = {
        a: this.a,
        b: this.b,
        sum: composite([this.a, this.b], (a, b) => a + b)
    }

    template = {
        tag: "div",
        children: [
            {
                tag: "button",
                textValue: this.a,
                listeners: {
                    click: () => {
                        this.a.value +=1
                    }
                }
            },
            {
                tag: "button",
                textValue: this.b,
                listeners: {
                    click: () => {
                        this.b.value +=1
                    }
                }
            },
            {
                tag: "p",
                textValue: this.rValues.sum
            }
        ]
    }
}

export function createComposite() {
    return createComponent(CompositeComp)
}
