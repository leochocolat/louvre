import { TimelineLite } from 'gsap';

class SubtitlesComponent {
    constructor() {
        this.el = document.querySelector('.js-subtitles-component');
        
        this.ui = {
            content: this.el.querySelector('.js-content')
        }

        this._setup();
    }

    _setup() {
        this.ui.content.innerHTML = '';
    }

    transitionIn() {
        
    }

    transitionOut() {
        let timeline = new TimelineLite();
        timeline.to(this.ui.content, .5, { autoAlpha: 0, y: 10, onComplete: () => {
            this.ui.content.innerHTML = '';
        }});
        timeline.to(this.ui.content, .5, { autoAlpha: 1, y: 0 });
    }

    update(content) {
        let timeline = new TimelineLite();
        timeline.to(this.ui.content, .5, { autoAlpha: 0, y: 10, onComplete: () => {
            this.ui.content.innerHTML = content;
        }});
        timeline.to(this.ui.content, .5, { autoAlpha: 1, y: 0 });
    }
}

export default SubtitlesComponent;