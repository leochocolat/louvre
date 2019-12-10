import bindAll from '../utils/bindAll';
import THREE from 'three';

class ThreeComponent {
    constructor(options) {
        bindAll(
            this, 
            '_tickHandler',
            '_resizeHandler'
        );

        this.el = options.el;
        this.canvas = this.el;

        this._setup();
    }

    _setup() {
        this._setupThreeScene();
        this._resize();
        this._setupEventListeners();
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
    }

    _setupThreeScene() {
        
    }

    _tick() {
        
    }

    _setupEventListeners() {
        window.addEventListener('resize', this._resizeHandler);
    }

    _tickHandler() {
        this._tick();
    }

    _resizeHandler() {
        this._resize();
    }
}

export default ThreeComponent;