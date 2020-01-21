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

        this._names = [
            "L'artiste, cet artisan de génie",
            "La signature",
            "L'autoportrait",
            "Ut pictura poesis",
            "Vies d'artiste",
            "L'artiste et l'académie",
            "La femme artiste",
            'mille citadelles',
        ] 

        this._setup();
    }

    _setup() {
        this._getProperties();
        this._initStyle();
        this._initNames();
        this._setupEventsListeners();
    }

    _getProperties() {
        this._invervalY = this.ui.buttons[1].getBoundingClientRect().y - this.ui.buttons[0].getBoundingClientRect().y
    }

    _initStyle() {
        TweenLite.set(this.ui.activeSquare, { rotation: 45 });
    }

    _initNames() {
        for (let i = 0; i < this.ui.buttons.length; i++) {
            const element = this.ui.buttons[i];
            element.querySelector('.js-name').innerHTML = this._names[i];
        }
    }

    setActiveBullet(activeIndex) {
        for (let index = 0; index < this.ui.buttons.length; index++) {
            this.ui.buttons[index].classList.remove('active')
        }

        this.ui.buttons[activeIndex].classList.add('active');
    }

    removeActive() {
        for (let index = 0; index < this.ui.buttons.length; index++) {
            this.ui.buttons[index].classList.remove('active')
        }
    }

    getClickedObject(el) {
        return el.dataset.name;
    }

    animateSquare(index) {
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
        // this.setActiveBullet(index);
        this.getClickedObject(this._activeElement);
        // this.animateSquare(index);
    }

    transitionOut() {
        TweenLite.to(this.el, .5, { autoAlpha: 0 });
    }
    
    transitionIn() {
        TweenLite.to(this.el, .5, { autoAlpha: 1 });
    }
}

export default ProgressBarComponent;