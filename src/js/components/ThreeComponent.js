import bindAll from '../utils/bindAll';
import * as THREE from 'three';
import ModelesLoader from '../modules/ModelesLoader';

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
        new ModelesLoader();
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