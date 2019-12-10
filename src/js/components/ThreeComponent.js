import bindAll from '../utils/bindAll';
import * as THREE from 'three';
import ModelesLoader from '../modules/ModelesLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class ThreeComponent {
    constructor(options) {
        bindAll(
            this,
            '_tickHandler',
            '_resizeHandler'
        );

        this.el = options.el;
        this.canvas = this.el;

        this._setup();
    }

    _setup() {
        this._setupThreeScene();
        this._resize();
        this._setupEventListeners();
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        // resize camera and renderer
        this._camera.aspect = (this._width / this._height)
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._width , this._height);
    }

    _setupThreeScene() {
<<<<<<< HEAD
        new ModelesLoader();
=======
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this._renderer = new THREE.WebGLRenderer({
            canvas: this.el
        });

        this._controls = new OrbitControls( this._camera, this._renderer.domElement );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this._scene.add( this.cube );

        this._camera.position.z = 5;
        this._controls.update()
>>>>>>> 55c62ff71cf8324eb38500bdb2493a627ccecced
    }

    _tick() {
        this._controls.update()
        this._renderer.render(this._scene, this._camera);
    }

    _setupEventListeners() {
        this._tickHandler();
        window.addEventListener('resize', this._resizeHandler);
    }

    _tickHandler() {
        this._tick();
        window.requestAnimationFrame(this._tickHandler);
    }

    _resizeHandler() {
        this._resize();
    }
}

export default ThreeComponent;