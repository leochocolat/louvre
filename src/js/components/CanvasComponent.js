import bindAll from '../utils/bindAll';
import ThreeScene from '../modules/ThreeScene';
import { TweenLite, TweenMax, Power3 } from 'gsap';

class CanvasComponent {
    constructor(options) {
        bindAll(
            this,
            '_tickHandler',
            '_resizeHandler',
            '_mouseClickHandler',
            '_mousemoveHandler',
            '_startBtnClickHandler'
        );

        this.el = options.el;

        this.ui = {
            button: document.querySelector('.js-start-button'),
            homeUI: document.querySelectorAll('.js-ui-home'),
            homeSection: document.querySelectorAll('.js-home-section'),
        }

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
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
        window.addEventListener('resize', this._resizeHandler);
        window.addEventListener('click', this._mouseClickHandler);
        window.addEventListener('mousemove', this._mousemoveHandler);
        this.ui.button.addEventListener('click', this._startBtnClickHandler);
    }

    _tickHandler() {
        this._tick();
    }

    _mouseClickHandler() {
        this._threeScene.rayCast(event);
    }

    _resizeHandler() {
        this._resize();
    }

    _mousemoveHandler() {
        this._mousePosition = {
            x: event.clientX - this._width / 2,
            y: event.clientY - this._height / 2,
        }
        this._threeScene.mousemoveHandler(event);
        this._threeScene.rayCastMouseMove(event);
    }

    _startBtnClickHandler() {
        TweenMax.to(this.ui.button, 0.2, { borderColor: 'white', ease: Power1.easeOut });
        TweenMax.to(this.ui.button, 0.5, { autoAlpha: 0, ease: Power1.easeOut });
        TweenMax.staggerTo(this.ui.homeUI, 1, { autoAlpha: 0, ease: Power2.easeInOut }, -0.2, 0);
        TweenMax.to(this.ui.homeSection, 1, { autoAlpha: 0, ease: Power2.easeInOut, delay: 1 });
        setTimeout(() => {
            this._threeScene.startExperience();
        }, 1000)
    }
}

export default CanvasComponent;