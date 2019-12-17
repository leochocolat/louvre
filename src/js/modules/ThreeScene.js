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
import { Mesh } from 'three';

const SETTINGS = {
    enableRaycast: true,
    enableOrbitControl: true,
    position: {
        x: 0.2,
        y: 22.2,
        z: 31.3
    },
    toggleGround: false,
    toggleCameraLight: true,
    cameraLookAt: {
        x: -594,
        y: 1.6,
        z: -64.6,
    }
}

class ThreeScene {
    constructor(canvas) {
        bindAll(
            this,
            '_assetsLoadedHandler',
            '_render',
            '_cameraSettingsChangedHandler',
            '_toggleEntityHandler',
            // '_setCameraLookAt'
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

        let cameraView = gui.addFolder('cameraView');
        cameraView.add(SETTINGS.cameraLookAt, 'x').min(-1000).max(100).step(0.1).onChange(this._setCameraLookAt)
        cameraView.add(SETTINGS.cameraLookAt, 'y').min(-1000).max(100).step(0.1).onChange(this._setCameraLookAt)
        cameraView.add(SETTINGS.cameraLookAt, 'z').min(-1000).max(100).step(0.1).onChange(this._setCameraLookAt)


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

        this._camera = new THREE.PerspectiveCamera(50, this._canvas.width / this._canvas.height, 1, 10000);

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

        // this._controls = new OrbitControls(this._camera, this._renderer.domElement);

        this._camera.position.set(
            SETTINGS.position.x,
            SETTINGS.position.y,
            SETTINGS.position.z,
        );

        this._camera.lookAt(
            SETTINGS.cameraLookAt.x,
            SETTINGS.cameraLookAt.y,
            SETTINGS.cameraLookAt.z
        );
        // this._controls.update();
        setTimeout(() => {

            this._setCameraLookAt()
        }, 1000);
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

        console.log(object.name);

        if (object.name == 'clic_inte_8') {
            let child = this._getSceneObjectWithName(object.parent, 'ouverture_livre');
            TweenMax.to(object.scale, 1, { x: 0.5 });
        }
        if (object.name == 'clic_inte_4') {
            let child = this._getSceneObjectWithName(object.parent, 'ouverture_livre');
            TweenMax.to(child.rotation, 1, { z: 1 });
        }

    }

    _getSceneObjectWithName(object, name) {
        let mesh;
        object.traverse((child) => {
            if (child.isMesh && child.name === name) {
                mesh = child;
            }
        });
        return mesh;
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

        // this._controls.update();
        // this._controls.enabled = SETTINGS.enableOrbitControl;
        this._renderer.render(this._scene, this._camera);
    }

    tick() {
        if (!this._isReady) return;

        // this._controls.update();
        this._render();
    }

    _cameraSettingsChangedHandler() {
        this._camera.position.set(
            SETTINGS.position.x,
            SETTINGS.position.y,
            SETTINGS.position.z,
        );
        // this._controls.update();
        // this._controls.saveState();
        // this._controls.reset();
    }

    _setCameraLookAt() {
        TweenMax.to(SETTINGS.cameraLookAt, 3, {
            x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut, onUpdate: () => {
                this._camera.lookAt(SETTINGS.cameraLookAt.x, SETTINGS.cameraLookAt.y, SETTINGS.cameraLookAt.z);
            }
        });

        TweenMax.to(SETTINGS.position, 2, {
            x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut, onUpdate: () => {
                this._camera.position.set(SETTINGS.position.x, SETTINGS.position.y, SETTINGS.position.z)
            }
        });

        // this._controls.update();
        // this._controls.saveState();
        // this._controls.reset();
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