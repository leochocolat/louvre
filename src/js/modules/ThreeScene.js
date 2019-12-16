//utils
import bindAll from '../utils/bindAll';
import lerp from '../utils/lerp';

//vendors
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TweenLite, Power3 } from 'gsap';
import * as dat from 'dat.gui';

//modules
import AssetsLoader from '../modules/AssetsLoader';
import SoundManager from '../modules/SoundManager';
import ThreeLights from './ThreeLights';
import ThreeModele from './ThreeModele';
import CameraLight from './CameraLight';
import Ground from './Ground';

const SETTINGS = {
    enableRaycast: true,
    enableOrbitControl: true,
    position: {
        x: -5.5,
        y: 22.2,
        z: 66
    },
    toggleGround: false,
    toggleCameraLight: true,
}

class ThreeScene {
    constructor(canvas) {
        bindAll(
            this,
            '_assetsLoadedHandler',
            '_render',
            '_cameraSettingsChangedHandler',
            '_toggleEntityHandler'
        );

        const gui = new dat.GUI({
            name: 'Scene',
        });

        let scene = gui.addFolder('scene');
        scene.add(SETTINGS, 'enableRaycast');
        scene.add(SETTINGS, 'toggleGround').onChange(this._toggleEntityHandler);
        scene.add(SETTINGS, 'toggleCameraLight').onChange(this._toggleEntityHandler);
        
        let camera = gui.addFolder('camera');
        camera.add(SETTINGS, 'enableOrbitControl');
        camera.add(SETTINGS.position, 'x').min(-100).max(100).step(0.1).onChange(this._cameraSettingsChangedHandler);
        camera.add(SETTINGS.position, 'y').min(-100).max(100).step(0.1).onChange(this._cameraSettingsChangedHandler);
        camera.add(SETTINGS.position, 'z').min(0).max(100).step(0.1).onChange(this._cameraSettingsChangedHandler);

        this._canvas = canvas;

        this.sceneEntities = {
            lights: new ThreeLights(),
            modeleTest: new ThreeModele('room'),
            cameraLight: new CameraLight(),
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
        this._loader = new AssetsLoader();
        this._loader.loadAssets().then(this._assetsLoadedHandler);
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
        this._camera.position.set(
            SETTINGS.position.x,
            SETTINGS.position.y,
            SETTINGS.position.z,
        );
        this._controls.update();
    }

    _createEntities() {
        for (let i in this.sceneEntities) {
            if (this.sceneEntities[i].is3dModel) continue;
            this.sceneEntities[i].addToScene(this._scene);
        }
    }

    _start() {
        this._soundManager.start(this._audios);
        this._createModels(this._models);
        this._toggleEntityHandler();
        this._isReady = true;
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

        if (intersects[0]) {
            this._triggerAnimations(intersects[0].object);
        }
    }

    _triggerAnimations(object) {
        this.sceneEntities.cameraLight.updateLightPosition(this._camera.position);
        this.sceneEntities.cameraLight.updateLightTarget(object);
        this.sceneEntities.cameraLight.turnOn();
        // if (object.name === 'Cube')
        // console.log(object)
        // TweenMax.to(this._camera.position, 1, { x: object.position.x, y: object.position.y, z: object.position.z + 15, ease: Power3.easeInOut })
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

        this._controls.update();
        this._render();
    }

    _cameraSettingsChangedHandler() {
        this._camera.position.set(
            SETTINGS.position.x,
            SETTINGS.position.y,
            SETTINGS.position.z,
        );
        this._controls.update();
        this._controls.saveState();
        this._controls.reset();
    }

    _toggleEntityHandler() {
        this.sceneEntities.ground.setVisibility(SETTINGS.toggleGround);
        this.sceneEntities.cameraLight.setVisibility(SETTINGS.toggleCameraLight);
    }

    _assetsLoadedHandler() {
        this._models = this._loader.getModels();
        this._audios = this._loader.getAudios();
        this._start();
    }

    mousemoveHandler(position) {
        this.sceneEntities.modeleTest.mousemoveHandler(position);
    }
}

export default ThreeScene;