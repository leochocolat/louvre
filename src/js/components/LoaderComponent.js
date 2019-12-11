import { TimelineLite } from 'gsap';

class LoaderComponent {
    constructor(options) {
        this.el = options.el;

        this.ui = {
            progress: this.el.querySelector('.js-progress')
        }

        this._setup();
    }

    _setup() {
        
    }

    updateProgress(progress) {
        this.ui.progress.innerHTML = `${Math.round(progress)}%`;        
    }

    transitionOut() {
        let timeline = new TimelineLite();
        timeline.to(this.el, .5, { autoAlpha: 0 });
        timeline.set(this.el, { display: 'none' });
    }
}

export default LoaderComponent;