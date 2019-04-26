import { Component, Observer, composite, createComponent, fdIf, fdObject, fdValue, nodeWrapper } from '../../src';
const dotStyle = {
    position: 'absolute',
    background: '#61dafb',
    font: 'normal 15px sans-serif',
    'text-align': 'center',
    cursor: 'pointer',
};

const targetSize = 25;

class Dot extends Component {
    private hover = fdIf(false)
    private privateText = composite([this.hover, this.text], (hover, text) => {
        if (hover) {
            return `*${text}*`
        }
        return text
    })

    private styles = composite([this.hover], (hover) => {
        let s = this.size * 1.3
        return {
            ...dotStyle,
            width: s + 'px',
            height: s + 'px',
            left: this.x + 'px',
            top: this.y + 'px',
            'border-radius': (s / 2) + 'px',
            'line-height': (s) + 'px',
            background: hover ? '#ff0' : dotStyle.background
        }
    })

    onHover = () => {
        this.hover.value = true;
    }

    onLeave = () => {
        this.hover.value = false;
    }

    template = {
        tag: "div",
        textValue: this.privateText,
        styles: this.styles,
        listeners: {
            mouseenter: this.onHover,
            mouseleave: this.onLeave
        }
    }

    constructor(private x: number, private y: number, private size: number, private text: Observer<number>) {
        super();
    }
}

function createDot(x: number, y: number, size: number, text: Observer<number>) {
    return createComponent(Dot, x, y, size, text)
}

class SierpinskiTriangle extends Component {
    template = this.s <= targetSize ? nodeWrapper(createDot(this.x - targetSize / 2, this.y - targetSize / 2, targetSize, this.second))
        : nodeWrapper(
            createSierpinskiTriangle(this.x, this.y - this.s / 4, this.s / 2, this.second) as any,
            createSierpinskiTriangle(this.x - this.s / 2, this.y + this.s / 4, this.s / 2, this.second) as any,
            createSierpinskiTriangle(this.x + this.s / 2, this.y + this.s / 4, this.s / 2, this.second) as any,
        );
    constructor(private x: number, private y: number, private s: number, private second: Observer<number>) {
        super();
    }
}

function createSierpinskiTriangle(x: number, y: number, s: number, second: Observer<number>) {
    return createComponent(SierpinskiTriangle, x, y, s, second)
}

class ApplicationTria extends Component {
    private start = Date.now();
    seconds = fdValue(0)
    scale = fdValue(0)
    elapsed = fdValue(0)

    style = composite([this.scale], (scale) => {
        return {
            position: 'absolute',
            'transform-origin': '0px 0px',
            left: '50%',
            top: '50%',
            width: '10px',
            height: '10px',
            background: '#eee',
            transform: ('scaleX(' + (scale / 2.1) + ') scaleY(0.7) translateZ(0.1px)')
        }
    })

    template = {
        tag: "div",
        styles: this.style,
        children: [
            createSierpinskiTriangle(0, 0, 1000, this.seconds) as any,
        ]
    }

    onInit() {
        const nextFrame = () => {
            this.elapsed.value = Date.now() - this.start;
            const t = (this.elapsed.value / 1000) % 10;
            this.scale.value = 1 + (t > 5 ? 10 - t : t) / 10;
            window.requestAnimationFrame(() => {
                nextFrame();
            });
        }
        const nextSecond = () => {
            this.seconds.value = (this.seconds.value > 9) ? 0 : this.seconds.value + 1;
            setTimeout(() => {
                nextSecond();
            }, 1000);
        }
        nextFrame()
        nextSecond();
    }

}

export function createTriaApp() {
    return createComponent(ApplicationTria)
}