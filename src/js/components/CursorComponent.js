import bindAll from '../utils/bindAll';
import lerp from '../utils/lerp';
import { TweenLite, Power1, Power2, Power0 } from 'gsap';

class CursorComponent {
    constructor(options) {
        bindAll(
            this,
            '_mousemoveHandler'
        )

        this.el = document.querySelector('.js-cursor');

        this.ui = {
            canvas: this.el.querySelector('.js-canvas-cursor')
        }

        this._cursorPosition = {
            x: 0,
            y: 0,
        }

        this._audioProgress = 0;
        this._crossOpacity = 0;

        this._setup();
    }

    _setup() {
        this._setupCanvas();
        this._setupEventListeners();
    }

    _setupCanvas() {
        this._resizeCanvas(); 
        this._ctx = this.ui.canvas.getContext('2d');
    }

    _drawCircle() {
        this._ctx.beginPath();

        this._ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';

        this._ctx.arc(this._width/2, this._height/2, 20, 0, Math.PI * 2);

        this._ctx.stroke();

        this._ctx.closePath();
    }

    _drawCross() {
        this._ctx.beginPath();

        this._ctx.strokeStyle = `rgba(255, 255, 255, ${this._crossOpacity})`;

        this._ctx.save();
        this._ctx.translate(this._width/2, this._height/2);
        this._ctx.scale(0.2, 0.2);
        
        this._ctx.moveTo(-this._width/2, -this._height/2);
        this._ctx.lineTo(this._width/2, this._height/2);
        this._ctx.moveTo(this._width/2, -this._height/2);
        this._ctx.lineTo(-this._width/2, this._height/2);

        this._ctx.restore();

        this._ctx.stroke();

        this._ctx.closePath();
    }

    _drawProgressCircle() {
        this._ctx.beginPath();

        this._ctx.strokeStyle = 'rgba(255, 255, 255, 1)';

        this._ctx.arc(this._width/2, this._height/2, 20, - Math.PI/2, -Math.PI/2 + (Math.PI * 2 * this._audioProgress), false);

        this._ctx.stroke();

        this._ctx.closePath();
    }

    updateAudioProgress(duration) {
        this._progressTween = TweenLite.to(this, duration, { _audioProgress: 1, ease: Power0.easeNone });
    }

    resetAudioProgress() {
        this._progressTween.pause();
        TweenLite.to(this, 2, { _audioProgress: 0, ease: Power3.easeInOut });
    }

    displayCross() {
        TweenLite.to(this, .5, { _crossOpacity: 0.4, ease: Power3.easeInOut });
    }

    removeCross() {
        TweenLite.to(this, .5, { _crossOpacity: 0, ease: Power3.easeInOut });
    }

    _resizeCanvas() {
        this._width = 50;
        this._height = 50;

        this.ui.canvas.width = this._width;
        this.ui.canvas.height = this._height;
    }

    _draw() {
        this._ctx.clearRect(0, 0, this._width, this._height);

        this._drawCircle();
        this._drawProgressCircle();
        this._drawCross();
    }

    _updateCursorPosition() {
        if (!this._mousePosition) return;

        this._cursorPosition.x = lerp(this._cursorPosition.x, this._mousePosition.x, 0.1);
        this._cursorPosition.y = lerp(this._cursorPosition.y, this._mousePosition.y, 0.1);
        TweenLite.set(this.el, { x: this._cursorPosition.x, y: this._cursorPosition.y });
    }

    update() {
        this._updateCursorPosition();
        this._draw();
    }

    _setupEventListeners() {
        window.addEventListener('mousemove', this._mousemoveHandler);
    }

    _mousemoveHandler(e) {
        this._mousePosition = {};
        this._mousePosition.x = e.clientX;
        this._mousePosition.y = e.clientY;
    }
}

export default CursorComponent;