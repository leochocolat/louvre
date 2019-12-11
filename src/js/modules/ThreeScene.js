//utils
import bindAll from '../utils/bindAll';

//vendors
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


/*
    HANDLE SCENE, CAMERA AND RENDERER
    CREATE SCENE OBJECTS (lights, Mesh...)
*/
class ThreeScene {
    constructor(canvas) {
        bindAll(
            this,
            '_render'
        );

        this._canvas = canvas;

        this._setup();
    }

    _setup() {
        this._scene = new THREE.Scene();

        this._camera = new THREE.PerspectiveCamera(75, this._canvas.width/this._canvas.height, 1, 10000);

        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
            physicallyCorrectLights: true,
            gammaInput: true,
            gammaOutput: true
        });

        this._renderer.shadowMap.enabled = true;

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.update();
    }

    start() {
        this._isReady = true;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    }

    _render() {
        this._controls.update();
        this._renderer.render(this._scene, this._camera);
    }

    tick() {
        if (!this._isReady) return;
        
        this._render();
    }
}

export default ThreeScene;