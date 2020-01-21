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
            '_startBtnClickHandler',
            '_creditsBtnClickHandler'
        );

        this.el = options.el;

        this.ui = {
            button: document.querySelector('.js-start-button'),
            creditsBtn: document.querySelector('.js-credits-button'),
            homeUI: document.querySelectorAll('.js-ui-home'),
            homeSection: document.querySelectorAll('.js-home-section'),
            progressBar: document.querySelector('.js-progress-bar'),
            muteButton: document.querySelector('.js-mute-button'),
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
        this.el.addEventListener('click', this._mouseClickHandler);
        this.el.addEventListener('mousemove', this._mousemoveHandler);
        this.ui.button.addEventListener('click', this._startBtnClickHandler);
        this.ui.creditsBtn.addEventListener('click', this._creditsBtnClickHandler);
    }

    _tickHandler() {
        this._tick();
    }

    _mouseClickHandler() {
        this._threeScene.clickHandler(event);
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
        TweenMax.to(this.ui.progressBar, 0.5, { autoAlpha: 1, ease: Power2.easeInOut, delay: 3 });
        TweenMax.to(this.ui.muteButton, 0.5, { autoAlpha: 1, ease: Power2.easeInOut, delay: 3.1 });
        TweenMax.to(this.ui.creditsBtn, 0.5, { autoAlpha: 1, ease: Power2.easeInOut, delay: 3 });

        setTimeout(() => {
            this._threeScene.startExperience();
        }, 1000)
    }

    _creditsBtnClickHandler() {
        this._threeScene.goToCredits();
    }
}

export default CanvasComponent;