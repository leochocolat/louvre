import { TweenLite, TimelineLite, Power3 } from 'gsap';
import bindAll from '../utils/bindAll';


class ProgressBarComponent {
    constructor() {
        bindAll(
            this,
            '_clickHandler',
        )

        this.el = document.querySelector('.js-progress-bar-component');

        this.ui = {
            buttons: this.el.querySelectorAll('.js-progress-bar-button'),
            activeSquare: this.el.querySelector('.js-active-square')
        }

        this._setup();
    }

    _setup() {
        this._getProperties();
        this._initStyle();
        this._setupEventsListeners();
    }

    _getProperties() {
        this._invervalY = this.ui.buttons[1].getBoundingClientRect().y - this.ui.buttons[0].getBoundingClientRect().y
    }

    _initStyle() {
        TweenLite.set(this.ui.activeSquare, { rotation: 45 });
    }

    setActiveBullet(el) {
        for (let index = 0; index < this.ui.buttons.length; index++) {
            this.ui.buttons[index].classList.remove('active')
        }

        el.classList.add('active');
    }

    getClickedObject(el) {
        return el.dataset.name;
    }

    _animateSquare(el, index) {
        let timeline = new TimelineLite();

        timeline.to(this.ui.activeSquare, 1, { y: this._invervalY * index, rotation: 45 + 90 * index, ease: Power3.easeInOut }, 0);
    }

    _setupEventsListeners() {
        for (let index = 0; index < this.ui.buttons.length; index++) {
            this.ui.buttons[index].addEventListener('click', () => this._clickHandler(index));
        }
    }

    _clickHandler(index) {
        this._activeElement = this.ui.buttons[index];
        this.setActiveBullet(this._activeElement);
        this.getClickedObject(this._activeElement);
        this._animateSquare(this._activeElement, index);
    }
}

export default ProgressBarComponent;