import bindAll from '../utils/bindAll';
import { TweenLite, Power1 } from 'gsap';

class CursorComponent {
    constructor(options) {
        bindAll(
            this,
            '_mousemoveHandler'
        )
        this.el = options.el;

        this._setup();
    }

    _setup() {
        this._setupEventListeners();
    }

    _setupEventListeners() {
        window.addEventListener('mousemove', this._mousemoveHandler);
    }

    _mousemoveHandler(e) {
        TweenLite.to(this.el, .5, { autoAlpha: 1, x: e.clientX, y: e.clientY });
    }
}

export default CursorComponent;