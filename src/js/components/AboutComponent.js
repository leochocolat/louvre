import { TweenLite, TimelineLite, Power3 } from "gsap";

class AboutComponent {
    constructor() {
        this.el = document.querySelector('.js-about');
        this.ui = {
            items: this.el.querySelectorAll('.js-item'),
            heading: this.el.querySelector('.js-about-heading'),
            paragraph: this.el.querySelector('.js-about-paragraph'),
            signature: this.el.querySelector('.js-about-signature'),
        }

        this._setup();
    }

    _setup() {

    }

    transitionIn() {
        let tl = new TimelineLite();
        tl.fromTo(this.ui.items, 1, { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: Power1.easeInOut }, 2);
        tl.fromTo(this.ui.signature, 1, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power1.easeInOut }, 2.7);
    }
    
    transitionOut() {
        let tl = new TimelineLite();
        tl.to(this.ui.items, 0.7, { autoAlpha: 0, ease: Power1.easeInOut }, 0);
        tl.to(this.ui.signature, 1, { autoAlpha: 0, ease: Power1.easeInOut }, 0.1);
    }
}

export default AboutComponent;