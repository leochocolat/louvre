//utils
import bindAll from '../utils/bindAll';
import lerp from '../utils/lerp';

//vendors
import * as THREE from 'three';
import { TweenLite, Power3, TimelineLite } from 'gsap';
import * as dat from 'dat.gui';

//modules
import AssetsLoader from '../modules/AssetsLoader';
import SoundManager from '../modules/SoundManager';
import ThreeLights from './ThreeLights';
import ThreeModele from './ThreeModele';
import CameraLight from './CameraLight';
import Ground from './Ground';
import ContentComponent from '../components/ContentComponent';

const SETTINGS = {
    enableRaycast: true,
    enableOrbitControl: true,
    position: {
        x: -27.44,
        y: 15.24,
        z: 25.20
    },
    toggleGround: false,
    toggleCameraLight: true,
    toggleHitboxes: true,
    enableMousemove: false,
    cameraLookAt: {
        x: -68.92,
        y: 16.44,
        z: -0.63,
    }
}

class ThreeScene {
    constructor(canvas) {
        bindAll(
            this,
            '_assetsLoadedHandler',
            '_render',
            '_toggleEntityHandler',
            '_toggleHitBoxes',
            '_cameraAnimationCompletedHandler',
            '_audioEndedHandler'
        );

        const gui = new dat.GUI({
            name: 'Scene',
        });

        let scene = gui.addFolder('scene');
        scene.add(SETTINGS, 'enableRaycast');
        scene.add(SETTINGS, 'toggleGround').onChange(this._toggleEntityHandler);
        scene.add(SETTINGS, 'toggleCameraLight').onChange(this._toggleEntityHandler);
        scene.add(SETTINGS, 'enableMousemove');
        scene.add(SETTINGS, 'toggleHitboxes').onChange(this._toggleHitboxes);

        let camera = gui.addFolder('camera');
        camera.add(SETTINGS, 'enableOrbitControl');
        camera.add(SETTINGS.position, 'x').min(-100).max(100).step(0.01).onChange(this._cameraSettingsChangedHandler);
        camera.add(SETTINGS.position, 'y').min(-100).max(100).step(0.01).onChange(this._cameraSettingsChangedHandler);
        camera.add(SETTINGS.position, 'z').min(-100).max(100).step(0.01).onChange(this._cameraSettingsChangedHandler);

        let cameraView = gui.addFolder('cameraView');
        cameraView.add(SETTINGS.cameraLookAt, 'x').min(-500).max(100).step(0.01).onChange(this._cameraSettingsChangedHandler)
        cameraView.add(SETTINGS.cameraLookAt, 'y').min(-500).max(100).step(0.01).onChange(this._cameraSettingsChangedHandler)
        cameraView.add(SETTINGS.cameraLookAt, 'z').min(-500).max(100).step(0.01).onChange(this._cameraSettingsChangedHandler)


        this._canvas = canvas;

        this.sceneEntities = {
            lights: new ThreeLights(),
            modeleTest: new ThreeModele('final'),
            cameraLight: new CameraLight(),
            ground: new Ground()
        };

        this.components = {
            content: new ContentComponent()
        }

        this._delta = 0;

        this._setup();
        this._setupAudioManager();
        this._loadAssets();
        this._setupCameraAnimations();
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

        setTimeout(() => {
            this._setCameraLookAt()
        }, 1000);
    }

    _createModels() {
        for (let i in this.sceneEntities) {
            if (!this.sceneEntities[i].is3dModel) continue;
            this.sceneEntities[i].build(this._models);
            this.sceneEntities[i].addToScene(this._scene);
        }
    }

    _setupCameraAnimations() {
        this._timelines = {};
        this._timelines['1'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['1'].to(SETTINGS.position, 2, { x: 24.44, y: 24.42, z: 2.39, ease: Power2.easeInOut }, 0);
        this._timelines['1'].to(SETTINGS.cameraLookAt, 2, { x: -43.33, y: -14.27, z: -53.91, ease: Power2.easeInOut }, 0);
        this._timelines['1'].to(SETTINGS.position, 2, { x: 11.78, y: 16.81, z: -17.58, ease: Power3.easeInOut }, 1.9);
        this._timelines['1'].to(SETTINGS.cameraLookAt, 2, { x: -91.69, y: -67.18, z: -60.49, ease: Power3.easeInOut }, 1.9);

        this._timelines['2'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['2'].to(SETTINGS.position, 2, { x: 2.13, y: 19.17, z: 1.01, ease: Power2.easeInOut }, 0);
        this._timelines['2'].to(SETTINGS.cameraLookAt, 2, { x: -19.91, y: 7.31, z: -60.76, ease: Power2.easeInOut }, 0);

        this._timelines['3'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['3'].to(SETTINGS.position, 2, { x: -3.78, y: 21.36, z: -6.06, ease: Power2.easeInOut }, 0);
        this._timelines['3'].to(SETTINGS.cameraLookAt, 2, { x: -19.35, y: 25.21, z: -12.48, ease: Power2.easeInOut }, 0);

        this._timelines['4'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['4'].to(SETTINGS.position, 2, { x: -13.1, y: 8.08, z: 15.06, ease: Power2.easeInOut }, 0);
        this._timelines['4'].to(SETTINGS.cameraLookAt, 2, { x: -34.09, y: -20.85, z: -47.33, ease: Power2.easeInOut }, 0);

        this._timelines['5'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['5'].to(SETTINGS.position, 2, { x: 4.73, y: 16.15, z: -0.26, ease: Power2.easeInOut }, 0);
        this._timelines['5'].to(SETTINGS.cameraLookAt, 2, { x: 26.07, y: 15.37, z: -50.88, ease: Power2.easeInOut }, 0);

        this._timelines['6'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['6'].to(SETTINGS.position, 2, { x: -15.22, y: 18.06, z: 20.99, ease: Power2.easeInOut }, 0);
        this._timelines['6'].to(SETTINGS.cameraLookAt, 2, { x: -60.68, y: 30.35, z: -43.05, ease: Power2.easeInOut }, 0);

        this._timelines['7'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['7'].to(SETTINGS.position, 2, { x: 26.62, y: 15, z: 25, ease: Power2.easeInOut }, 0);
        this._timelines['7'].to(SETTINGS.cameraLookAt, 2, { x: -69, y: 16, z: 24.42, ease: Power2.easeInOut }, 0);
        this._timelines['7'].to(SETTINGS.position, 2, { x: 22.21, y: 13.39, z: 4.57, ease: Power2.easeInOut }, 0);
        this._timelines['7'].to(SETTINGS.cameraLookAt, 2, { x: -166.45, y: 16, z: -40.72, ease: Power2.easeInOut }, 0);

        this._timelines['8'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler });
        this._timelines['8'].to(SETTINGS.position, 2, { x: -8.76, y: 13.39, z: 2.36, ease: Power2.easeInOut }, 0);
        this._timelines['8'].to(SETTINGS.cameraLookAt, 2, { x: 0, y: 12.22, z: -60.56, ease: Power2.easeInOut }, 0);
        this._timelines['8'].to(SETTINGS.position, 2, { x: 0.16, y: 11.18, z: -8.66, ease: Power2.easeInOut }, 0);
        this._timelines['8'].to(SETTINGS.cameraLookAt, 2, { x: -27.5, y: 18.85, z: -27.5, ease: Power2.easeInOut }, 0);
    }

    rayCast() {
        if (this._isSpeaking) return;
        if (!SETTINGS.enableRaycast) return;

        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this._rayCaster.setFromCamera(this._mouse, this._camera);

        let intersects = this._rayCaster.intersectObjects(this._scene.children, true);

        if (intersects[0]) {
            this.rayCastHandler(intersects[0].object);
        }
    }

    _triggerAnimations(object, index) {
        // if (object.name == 'clic_inte_8') {
        //     let child = this._getSceneObjectWithName(object.parent, 'ouverture_livre');
        //     TweenMax.to(child.scale, 1, { x: 0.5 });
        // }
        // if (object.name == 'clic_inte_4') {
        //     let child = this._getSceneObjectWithName(object.parent, 'ouverture_livre');
        //     TweenMax.to(child.rotation, 1, { z: 1 });
        // }
        if (this._timelines[index]) {
            this._timelines[index].play();
        };
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

        this._soundManager.update(this._delta);

        this._camera.position.x = SETTINGS.position.x;
        this._camera.position.y = SETTINGS.position.y;
        this._camera.position.z = SETTINGS.position.z;

        this._camera.lookAt(
            SETTINGS.cameraLookAt.x,
            SETTINGS.cameraLookAt.y,
            SETTINGS.cameraLookAt.z
        );

        this._renderer.render(this._scene, this._camera);
    }

    tick() {
        if (!this._isReady) return;

        this._render();
    }

    rayCastHandler(object) {
        console.log(object.name)
        let regex = /inte_/;
        if (regex.test(object.name)) {
            let splits = object.name.split('_');
            this._activeIndex = parseInt(splits[splits.length - 1]);
            this._isSpeaking = true;
            this._triggerAnimations(object, this._activeIndex);
        }
    }

    _cameraAnimationCompletedHandler() {
        this.components.content.update(this._activeIndex);
        this._soundManager.playAudio(this._activeIndex).then((response) => {
            setTimeout(this._audioEndedHandler, response.duration * 1000);
        });
    }

    _setCameraLookAt() {
        let timeline = new TimelineLite();

        // timeline.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut }, 0);
        // timeline.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut }, 0);

        timeline.set(SETTINGS.cameraLookAt, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut }, 0);
        timeline.set(SETTINGS.position, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut }, 0);
    }

    _toggleEntityHandler() {
        this.sceneEntities.ground.setVisibility(SETTINGS.toggleGround);
        this.sceneEntities.cameraLight.setVisibility(SETTINGS.toggleCameraLight);
    }

    _toggleHitBoxes() {
        this.sceneEntities.modeleTest.disableHitBox(SETTINGS.disableHitBox);
    }

    _assetsLoadedHandler() {
        this._models = this._loader.getModels();
        this._audios = this._loader.getAudios();
        this._start();
    }

    _audioEndedHandler() {
        TweenLite.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut }, 0);
        TweenLite.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut }, 0);
        this._isSpeaking = false;
    }

    mousemoveHandler(position) {
        if (!SETTINGS.enableMousemove) return;
        this.sceneEntities.modeleTest.mousemoveHandler(position);
    }
}

export default ThreeScene;