//utils
import bindAll from '../utils/bindAll';
import lerp from '../utils/lerp'
//vendors
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

//modules
import ModelesLoader from '../modules/ModelesLoader';
import SoundManager from '../modules/SoundManager';
import ThreeLights from './ThreeLights';
import ThreeModele from './ThreeModele';
import Ground from './Ground';

const SETTINGS = {
    enableRaycast: true,
    enableOrbitControl: true
}

/*
    HANDLE SCENE, CAMERA AND RENDERER
    CREATE SCENE OBJECTS (lights, Mesh...)
*/
class ThreeScene {
    constructor(canvas) {
        bindAll(
            this,
            '_modelsLoadedHandler',
            '_audiosLoadedHandler',
            '_render'
        );

        const gui = new dat.GUI({
            name: 'Scene',
        });

        let scene = gui.addFolder('scene');
        scene.add(SETTINGS, 'enableRaycast');
        
        let camera = gui.addFolder('camera');
        camera.add(SETTINGS, 'enableOrbitControl');

        this._canvas = canvas;

        this.sceneEntities = {
            lights: new ThreeLights(),
            modeleTest: new ThreeModele('modele-test'),
            ground: new Ground()
        };

        this._delta = 0;

        this._setup();
        this._setupAudioManager();
        this._loadAssets();
        this._createEntities();
    }

    _setupAudioManager() {
        this._soundManager = new SoundManager();
    }

    _loadAssets() {
        this._loader = new ModelesLoader();
        this._loader.loadAssets().then(this._modelsLoadedHandler);
        this._soundManager.loadAssets().then(this._audiosLoadedHandler);
    }

    _setup() {
        this._scene = new THREE.Scene();

        this._camera = new THREE.PerspectiveCamera(75, this._canvas.width / this._canvas.height, 1, 10000);

        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
            physicallyCorrectLights: true,
            gammaInput: true,
            gammaOutput: true
        });

        this._mouse = new THREE.Vector2();
        this._rayCaster = new THREE.Raycaster();

        this._renderer.shadowMap.enabled = true;

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._camera.position.set(0, 0, 10);
        this._controls.update();
    }

    _createEntities() {
        for (let i in this.sceneEntities) {
            if (this.sceneEntities[i].is3dModel) continue;
            this.sceneEntities[i].addToScene(this._scene);
        }
    }

    _start() {
        if (!this._isAudioReady || !this._isModelsReady) return;
        this._isReady = true;
        this._soundManager.start();
        this._createModels(this._models);
    }

    _createModels() {
        for (let i in this.sceneEntities) {
            if (!this.sceneEntities[i].is3dModel) continue;
            this.sceneEntities[i].build(this._models);
            this.sceneEntities[i].addToScene(this._scene);
        }
    }

    rayCast() {
        if (!SETTINGS.enableRaycast) return;

        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this._rayCaster.setFromCamera(this._mouse, this._camera);

        let intersects = this._rayCaster.intersectObjects(this._scene.children, true);

        if (intersects[0].object) {
            this._triggerAnimations(intersects[0].object)
            // this._camera.position.x = lerp(this._camera.position.x, 20, 0.01)
        }
        // console.log(this._camera.position.x)
    }

    _triggerAnimations(object) {
        console.log(object)
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    }

    _render() {
        this._delta += 0.01;
        
        for (let i in this.sceneEntities) {
            this.sceneEntities[i].update(this._delta);
        }

        this._controls.update();
        this._controls.enabled = SETTINGS.enableOrbitControl;
        this._renderer.render(this._scene, this._camera);
    }

    tick() {
        if (!this._isReady) return;

        this._render();
    }

    _modelsLoadedHandler() {
        this._isModelsReady = true;
        this._models = this._loader.getModels();
        this._start();
    }

    _audiosLoadedHandler() {
        this._isAudioReady = true;
        this._start();
    }
}

export default ThreeScene;