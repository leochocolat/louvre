import bindAll from '../utils/bindAll';
import ThreeScene from '../modules/ThreeScene';

class CanvasComponent {
    constructor(options) {
        bindAll(
            this,
            '_tickHandler',
            '_resizeHandler',
            '_mouseClickHandler',
            '_mousemoveHandler'
        );

        this.el = options.el;

        this._setup();
    }

    _setup() {
        this._setupThree();
        this._resize();
        this._setupEventListeners();
    }

    _setupThree() {
        this._threeScene = new ThreeScene(this.el);
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this.el.width = this._width;
        this.el.height = this._height;

        this._threeScene.resize(this._width, this._height);
    }

    _tick() {
        this._threeScene.tick();
    }

    _setupEventListeners() {
        this._tickHandler();
        window.addEventListener('resize', this._resizeHandler);
        window.addEventListener('mousemove', this._mouseClickHandler);
        window.addEventListener('mousemove', this._mousemoveHandler);
    }

    _tickHandler() {
        this._tick();
        window.requestAnimationFrame(this._tickHandler);
    }

    _mouseClickHandler() {
        this._threeScene.rayCast(event);
    }

    _resizeHandler() {
        this._resize();
    }

    _mousemoveHandler(e) {
        this._mousePosition = {
            x: e.clientX - this._width / 2,
            y: e.clientY - this._height / 2,
        }
        this._threeScene.mousemoveHandler(e);
    }
}

export default CanvasComponent;