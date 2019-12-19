import { TimelineLite, TweenLite, Power3 } from 'gsap';
import bindAll from '../utils/bindAll';

class LoaderComponent {
    constructor(options) {
        bindAll(this, '_loaderAnimationCompleted');

        this.el = options.el;

        this.ui = {
            progress: this.el.querySelector('.js-progress'),
            heading: this.el.querySelector('.js-heading')
        }

        this._setup();

        this._tweenObject = {
            value: 0
        }
    }

    _setup() {
        this.ui.progress.innerHTML = '';
        for (let i = 0; i < 2; i++) {
            let span = document.createElement('span');
            span.setAttribute('class', 'js-span');
            span.innerHTML = "0";
            this.ui.progress.appendChild(span);
        }

        let content = this.ui.heading.innerHTML;
        this.ui.heading.innerHTML = '';
        for (let i = 0; i < content.length; i++) {
            let mask = document.createElement('span');
            mask.setAttribute('class', 'js-mask');
            mask.style.overflow = 'hidden';
            let span = document.createElement('span');
            span.setAttribute('class', 'js-heading-span');
            span.innerHTML = content.charAt(i);
            mask.appendChild(span);
            this.ui.heading.appendChild(mask);
        }

        this.ui.spans = this.ui.progress.querySelectorAll('.js-span');

        this.timeline = new TimelineLite({ paused: true });
        this.timeline.fromTo(this.ui.spans[0], 1, { y: -200 }, { y: 0 }, 0);
        this.timeline.fromTo(this.ui.spans[1], 1, { y: 200 }, { y: 0 }, 0);
    }

    updateProgress(progress) {
        TweenLite.to(this._tweenObject, .5, { value: progress, onUpdate: () => {
            if (this._tweenObject.value === 100) {
                this.ui.progress.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    let span = document.createElement('span');
                    span.setAttribute('class', 'js-span-end');
                    span.innerHTML = i == 0 ? 1 : 0;
                    this.ui.progress.appendChild(span);
                }
                this._loaderAnimationCompleted();
            }
            if (Math.round(this._tweenObject.value) % 2 === 0) {
                let progressValue = Math.round(this._tweenObject.value).toString();
                this.ui.spans[0].innerHTML = progressValue.charAt(0);
                this.ui.spans[1].innerHTML = progressValue.charAt(1);
                this.timeline.progress(this._tweenObject.value/100);
            }
        } })
    }

    transitionOut() {
        this._isLoaded = true;
        if (!this._isCompleted) return;

        let timeline = new TimelineLite();
        timeline.to(this.ui.heading.querySelectorAll('.js-heading-span'), 1.3, { x: '150%', ease: Power3.easeInOut }, 0);
        timeline.staggerTo(this.el.querySelectorAll('.js-span-end'), 1.5, { x: window.innerWidth, ease: Power3.easeInOut }, -0.1, 0.1);
        timeline.to(this.el, 1, { x: '100%', ease: Power3.easeOut }, 1.2);
        timeline.set(this.el, { display: 'none' });
    }

    _loaderAnimationCompleted() {
        this._isCompleted = true;
        if (this._isLoaded) {
            setTimeout(() => {
                this.transitionOut();
            }, 1000);
        }
    }
}

export default LoaderComponent;