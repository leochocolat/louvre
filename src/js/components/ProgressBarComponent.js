import { TweenLite } from 'gsap';
import bindAll from '../utils/bindAll';


class ProgressBarComponent {
    constructor() {
        bindAll(
            this,
            '_clickHandler',
            '_mouseMoveHandler'
        )
        this.el = document.querySelector('.js-progress-bar-component');

        this.ui = {
            bullets: this.el.querySelectorAll('.bullet')
        }
        this.mouse = {
            x: 0,
            y: 0
        }
        this._setupEventsListeners()
    }

    _setupEventsListeners() {

        for (let index = 0; index < this.ui.bullets.length; index++) {
            // this.ui.bullets[index].addEventListener('mousemove', this._mouseMoveHandler)
            this.ui.bullets[index].addEventListener('click', this._clickHandler)
        }

    }

    _mouseMoveHandler(index) {
        let object = event.target.querySelector('span')

        this.mouse.x = event.clientX
        this.mouse.y = event.clientY

        TweenLite.to(object, 0.2, { x: this.mouse.x * 0.03, y: this.mouse.y * 0.03 })

        // this.ui.bullets[index].addEventListener('mouseover', this._aimBulletMouse)
    }

    _clickHandler() {
        let object = event.target
        this.setActiveBullet(object)
        this.getClickedObject(object)
    }

    _setup() {

    }

    setActiveBullet(object) {
        for (let index = 0; index < this.ui.bullets.length; index++) {
            this.ui.bullets[index].classList.remove('active')
        }

        object.classList.add('active')
    }

    getClickedObject(object) {
        return object.dataset.name;
    }
}

export default ProgressBarComponent;