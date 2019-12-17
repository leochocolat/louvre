class SoundVisualizerComponent {
    constructor() {
        this.el = document.querySelector('.js-canvas-analyzer');
        this._setup();
    }

    _setup() {
        this._setupCanvas();
        this._resize();
        this._initPoints();
    }

    _setupCanvas() {
        this._canvas = this.el;
        this._ctx = this._canvas.getContext('2d');
    }

    _resize() {
        this._width = 50;
        this._height = 50;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    _initPoints() {
        this._points = [];

        for (let i = 0; i <= this._width; i++) {
            let point = {};
            point.x = i;
            point.y = this._height/2;

            this._points.push(point);
        }
    }

    _updatePoints(delta, gain) {
        for (let i = 0; i < this._points.length; i++) {
            this._points[i].y = this._height/2 + Math.sin((delta + i) * 0.4) * 10 * gain;
        }
    }

    _drawPoints() {
        this._ctx.beginPath();
        this._ctx.strokeStyle = 'white';

        this._ctx.moveTo(this._points[0].x, this._points[0].y);

        for (let i = 0; i < this._points.length; i++) {
            const position = this._points[i];
            this._ctx.lineTo(position.x, position.y);
        }

        this._ctx.stroke();
        this._ctx.closePath();
    }

    _draw(delta, gain) {
        this._ctx.clearRect(0, 0, this._width, this._height);

        this._updatePoints(delta, gain);
        this._drawPoints();
    }

    update(delta, gain) {
        this._draw(delta, gain);
    }
}

export default SoundVisualizerComponent;