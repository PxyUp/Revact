import { Component, fdIf, fdObject } from '../../src';
const dotStyle = {
    position: 'absolute',
    background: '#61dafb',
    font: 'normal 15px sans-serif',
    textAlign: 'center',
    cursor: 'pointer',
};
const containerStyle = {
    position: 'absolute',
    transformOrigin: '0 0',
    left: '50%',
    top: '50%',
    width: '10px',
    height: '10px',
    background: '#eee',
};
const targetSize = 25;

class Dot extends Component {
    private hover = fdIf(false)

    onHover = () => {
        this.hover.value = true;
    }

    onLeave = () => {
        this.hover.value = false;
    }
}