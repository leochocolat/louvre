//utils
import bindAll from '../utils/bindAll';

//vendors
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ThreeLights from './ThreeLights';
import ThreeModele from './ThreeModele';
import Ground from './Ground';

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

        this.sceneEntities = {
            lights: new ThreeLights(),
            modeleTest: new ThreeModele('modele-test'),
            ground: new Ground()
        };

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

    start(models) {
        this._models = models;
        this._isReady = true;
        this._createModels(this._models);
    }

    _createModels() {
        for (let i in this.sceneEntities) {
            if (!this.sceneEntities[i].is3dModel) continue;
            this.sceneEntities[i].build(this._models);
        }
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

        for (let i in this.sceneEntities) {
            this.sceneEntities[i].update();
        }

        this._renderer.render(this._scene, this._camera);
    }

    tick() {
        if (!this._isReady) return;
        
        this._render();
    }
}

export default ThreeScene;