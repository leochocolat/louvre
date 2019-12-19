import { TimelineLite, TweenLite } from 'gsap';
import bindAll from '../utils/bindAll';

class LoaderComponent {
    constructor(options) {
        bindAll(this, '_loaderAnimationCompleted');

        this.el = options.el;

        this.ui = {
            progress: this.el.querySelector('.js-progress')
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

        this.ui.spans = this.ui.progress.querySelectorAll('.js-span');

        this.timeline = new TimelineLite({ paused: true, onComplete: this._loaderAnimationCompleted });
        this.timeline.fromTo(this.ui.spans[0], 1, { y: -200 }, { y: 0 }, 0);
        this.timeline.fromTo(this.ui.spans[1], 1, { y: 200 }, { y: 0 }, 0);
    }

    updateProgress(progress) {
        TweenLite.to(this._tweenObject, .5, { value: progress, onUpdate: () => {
            if (this._tweenObject.value === 100) {
                this.ui.progress.innerHTML = '100';
            }
            let progressValue = Math.round(this._tweenObject.value).toString();
            this.ui.spans[0].innerHTML = progressValue.charAt(0);
            this.ui.spans[1].innerHTML = progressValue.charAt(1);
            this.timeline.progress(this._tweenObject.value/100);
        } })
        console.log(progress/100);
    }

    transitionOut() {
        this._isLoaded = true;
        if (!this._isCompleted) return;

        let timeline = new TimelineLite();
        timeline.to(this.el, 1, { autoAlpha: 0 });
        timeline.set(this.el, { display: 'none' });
    }

    _loaderAnimationCompleted() {
        this._isCompleted = true;
        if (this._isLoaded) {
            this.transitionOut();
        }
    }
}

export default LoaderComponent;