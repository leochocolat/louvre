class ContentComponent {
    constructor() {
        this.el = document.querySelector('.js-section-content')

        this.ui = {
            blockContent: this.el.querySelectorAll('.js-block-content')
        }

        this._setup();
    } 

    _setup() {

    }

    update(index) {
        this._activeIndex = index;
        
        this.transitionOut();
        this.ui.blockContent[index].classList.add('isActive');
    }

    transitionIn() {
        
    }

    transitionOut() {
        for (let i = 0; i < this.ui.blockContent.length; i++) {
            this.ui.blockContent[i].classList.remove('isActive');
        }
    }
}

export default ContentComponent;