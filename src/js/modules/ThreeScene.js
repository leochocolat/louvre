//utils
import bindAll from '../utils/bindAll';
import lerp from '../utils/lerp';

//vendors
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TweenLite, Power3, TimelineLite } from 'gsap';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

//components
import ProgressBarComponent from '../components/ProgressBarComponent';
import ContentComponent from '../components/ContentComponent';
import CursorComponent from '../components/CursorComponent';

//modules
import AssetsLoader from './AssetsLoader';
import SoundManager from './SoundManager';
import ThreeLights from './ThreeLights';
import ThreeModele from './ThreeModele';
import CameraLight from './CameraLight';
import Ground from './Ground';
import SkyBox from './SkyBox';

//shaders
import vert from '../shaders/vert.glsl'
import frag from '../shaders/outline/frag.glsl'

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
        z: -0.63
    },
    sunController: {
        turbidity: 3.5,
        rayleigh: 1.3,
        luminance: 1.1,
        inclination: 0.05,
        azimuth: 1.0172,
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
            '_audioEndedHandler',
            '_cameraUpdateHandler',
            '_creditCameraAnimationEnd',
            '_leaveInteractionCompletedHandler',
            '_leaveCreditsCompleteHandler',
            '_aboutAnimationEnd'
        );

        const gui = new dat.GUI({
            name: 'Scene'
        });

        let scene = gui.addFolder('scene');
        scene.add(SETTINGS, 'enableRaycast');
        scene.add(SETTINGS, 'toggleGround').onChange(this._toggleEntityHandler);
        scene.add(SETTINGS, 'toggleCameraLight').onChange(this._toggleEntityHandler);
        scene.add(SETTINGS, 'enableMousemove');
        scene.add(SETTINGS, 'toggleHitboxes').onChange(this._toggleHitboxes);

        let camera = gui.addFolder('camera');
        camera.add(SETTINGS, 'enableOrbitControl');
        camera.add(SETTINGS.position, 'x').min(-300).max(300).step(0.1).onChange(this._cameraUpdateHandler);
        camera.add(SETTINGS.position, 'y').min(-300).max(300).step(0.1).onChange(this._cameraUpdateHandler);
        camera.add(SETTINGS.position, 'z').min(-300).max(300).step(0.1).onChange(this._cameraUpdateHandler);

        let cameraView = gui.addFolder('cameraView');
        cameraView.add(SETTINGS.cameraLookAt, 'x').min(-500).max(100).step(0.01).onChange(this._cameraUpdateHandler)
        cameraView.add(SETTINGS.cameraLookAt, 'y').min(-500).max(100).step(0.01).onChange(this._cameraUpdateHandler)
        cameraView.add(SETTINGS.cameraLookAt, 'z').min(-500).max(100).step(0.01).onChange(this._cameraUpdateHandler)

        this._canvas = canvas;

        this.sceneEntities = {
            lights: new ThreeLights(),
            modeleTest: new ThreeModele('500'),
            cameraLight: new CameraLight(),
            ground: new Ground(),
            skyBox: new SkyBox()
        };

        this.components = {
            progressBar: new ProgressBarComponent(),
            content: new ContentComponent(),
            cursor: new CursorComponent()
        }

        this._delta = 0;

        this._setup();
    }

    _setup() {
        this._setupSceneAndCamera();
        this.resize(window.innerWidth, window.innerHeight);
        this._setupAudioManager();
        this._loadAssets();
        this._setupCameraAnimations();
        this._createEntities();
        this._createSceneNoise();
        this._createObjectOutline();
        this._setupEventListeners();
    }

    _setupSceneAndCamera() {
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
    }

    _setupAudioManager() {
        this._soundManager = new SoundManager();
    }

    _loadAssets() {
        this._loader = new AssetsLoader();
        this._loader.loadAssets().then(this._assetsLoadedHandler);
    }

    _setupCameraAnimations() {
        this._timelines = {};
        this._timelines['1'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['1'].to(SETTINGS.position, 2, { x: 24.44, y: 24.42, z: 2.39, ease: Power2.easeInOut }, 0);
        this._timelines['1'].to(SETTINGS.cameraLookAt, 2, { x: -43.33, y: -14.27, z: -53.91, ease: Power2.easeInOut }, 0);
        this._timelines['1'].to(SETTINGS.position, 2, { x: 13, y: 17.5, z: -16.6, ease: Power3.easeInOut }, 1.9);
        this._timelines['1'].to(SETTINGS.cameraLookAt, 2, { x: -91.69, y: -67.18, z: -60.49, ease: Power3.easeInOut }, 1.9);

        this._timelines['2'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['2'].to(SETTINGS.position, 2, { x: 2.13, y: 19.17, z: 1.01, ease: Power2.easeInOut }, 0);
        this._timelines['2'].to(SETTINGS.cameraLookAt, 2, { x: -19.91, y: 7.31, z: -60.76, ease: Power2.easeInOut }, 0);

        this._timelines['3'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['3'].to(SETTINGS.position, 2, { x: -3.78, y: 21.36, z: -6.06, ease: Power2.easeInOut }, 0);
        this._timelines['3'].to(SETTINGS.cameraLookAt, 2, { x: -19.35, y: 25.21, z: -12.48, ease: Power2.easeInOut }, 0);

        this._timelines['4'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['4'].to(SETTINGS.position, 2, { x: -13.1, y: 8.08, z: 15.06, ease: Power2.easeInOut }, 0);
        this._timelines['4'].to(SETTINGS.cameraLookAt, 2, { x: -34.09, y: -20.85, z: -47.33, ease: Power2.easeInOut }, 0);

        this._timelines['5'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['5'].to(SETTINGS.position, 2, { x: 4.73, y: 16.15, z: -0.26, ease: Power2.easeInOut }, 0);
        this._timelines['5'].to(SETTINGS.cameraLookAt, 2, { x: 26.07, y: 15.37, z: -50.88, ease: Power2.easeInOut }, 0);

        this._timelines['6'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['6'].to(SETTINGS.position, 2, { x: -15.22, y: 18.06, z: 20.99, ease: Power2.easeInOut }, 0);
        this._timelines['6'].to(SETTINGS.cameraLookAt, 2, { x: -60.68, y: 30.35, z: -43.05, ease: Power2.easeInOut }, 0);

        this._timelines['7'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['7'].to(SETTINGS.position, 2, { x: 26.62, y: 15, z: 25, ease: Power2.easeInOut }, 0);
        this._timelines['7'].to(SETTINGS.cameraLookAt, 2, { x: -69, y: 16, z: 24.42, ease: Power2.easeInOut }, 0);
        this._timelines['7'].to(SETTINGS.position, 2, { x: 22.21, y: 13.39, z: 4.57, ease: Power2.easeInOut }, 0);
        this._timelines['7'].to(SETTINGS.cameraLookAt, 2, { x: -166.45, y: 16, z: -40.72, ease: Power2.easeInOut }, 0);

        this._timelines['8'] = new TimelineLite({ paused: true, onComplete: this._cameraAnimationCompletedHandler, onUpdate: this._cameraUpdateHandler });
        this._timelines['8'].to(SETTINGS.position, 2, { x: -8.76, y: 13.39, z: 2.36, ease: Power2.easeInOut }, 0);
        this._timelines['8'].to(SETTINGS.cameraLookAt, 2, { x: 0, y: 12.22, z: -60.56, ease: Power2.easeInOut }, 0);
        this._timelines['8'].to(SETTINGS.position, 2, { x: 0.16, y: 11.18, z: -8.66, ease: Power2.easeInOut }, 0);
        this._timelines['8'].to(SETTINGS.cameraLookAt, 2, { x: -27.5, y: 18.85, z: -27.5, ease: Power2.easeInOut }, 0);
    }

    _createSceneNoise() {
        this._composer = new EffectComposer(this._renderer);

        let pixelRatio = window.devicePixelRatio || 0,
            renderPass = new RenderPass(this._scene, this._camera),
            noiseEffect = {
                uniforms: {
                    "tDiffuse": { value: null },
                    "amount": { value: this._noiseCounter }
                },
                vertexShader: vert,
                fragmentShader: frag
            }

        this._composer.addPass(renderPass);
        renderPass.renderToScreen = true;

        this._composer.setSize(this._width * pixelRatio, this._height * pixelRatio);
        this._composer.setPixelRatio(pixelRatio);

        this._noiseCounter = 0.0

        this._customPass = new ShaderPass(noiseEffect);
        this._composer.addPass(this._customPass);
    }

    _createObjectOutline() {
        this._enableOutline = true;

        this._outlinePass = new OutlinePass(new THREE.Vector2(this._width, this._height), this._scene, this._camera)
        this._outlinePass.visibleEdgeColor.set(0xffffff);
        this._outlinePass.hiddenEdgeColor.set(0xffffff);

        this._composer.addPass(this._outlinePass);

        this._effectFXAA = new ShaderPass(FXAAShader);
        this._effectFXAA.uniforms['resolution'].value.set(1 / this._width, 1 / this._height);
        this._effectFXAA.renderToScreen = true;

        this._composer.addPass(this._effectFXAA);
    }

    _createEntities() {
        for (let i in this.sceneEntities) {
            if (this.sceneEntities[i].is3dModel) continue;
            this.sceneEntities[i].addToScene(this._scene);
        }
    }

    _createModels() {
        for (let name in this.sceneEntities) {
            if (!this.sceneEntities[name].is3dModel) continue;
            this.sceneEntities[name].build(this._models);
            this.sceneEntities[name].addToScene(this._scene);
        }
    }

    _start() {
        this._createModels(this._models);
        this._toggleEntityHandler();
        this._isReady = true;

        this._lookAround();
    }

    startExperience() {
        this._setCameraLookAt();
        this._soundManager.start(this._audios);
    }

    _lookAround() {
        let timeline = new TimelineLite({
            onUpdate: this._cameraUpdateHandler
        });

        timeline.fromTo(SETTINGS.position, 2, { x: 0, y: 0, z: 0 }, { x: SETTINGS.position.x, y: SETTINGS.position.y, z: SETTINGS.position.z });
        timeline.fromTo(SETTINGS.cameraLookAt, 2, { x: 0, y: 0, z: 0 }, { x: SETTINGS.cameraLookAt.x, y: SETTINGS.cameraLookAt.y, z: SETTINGS.cameraLookAt.z });
    }

    _setCameraLookAt() {
        let timeline = new TimelineLite({
            onComplete: () => {
                SETTINGS.enableMousemove = true;
                this.sceneEntities.modeleTest.loadShaderTexture();
            },
            onUpdate: this._cameraUpdateHandler
        });

        timeline.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut }, 0);
        timeline.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 12, z: -24.5, ease: Power3.easeInOut }, 0);
    }

    goToCredits() {
        let timeline = new TimelineLite({
            onComplete: this._creditCameraAnimationEnd,
            onUpdate: this._cameraUpdateHandler
        });

        timeline.to(SETTINGS.position, 2, { x: -26.3, y: 15, z: 29, ease: Power3.easeInOut }, 0);
        timeline.to(SETTINGS.cameraLookAt, 2.5, { x: -60.57, y: 16, z: -1.02, ease: Power3.easeInOut }, 0);

        this.sceneEntities.modeleTest.replaceTexture();
    }

    goToAbout() {
        let timeline = new TimelineLite({
            onComplete: this._aboutAnimationEnd,
            onUpdate: this._cameraUpdateHandler
        });

        timeline.to(SETTINGS.position, 2, { x: -0.5, y: 34, z: 60, ease: Power3.easeInOut }, 0);
        timeline.to(SETTINGS.cameraLookAt, 2.5, { x: -1.02, y: 5.6, z: -0.63, ease: Power3.easeInOut }, 0);

        timeline.to(SETTINGS.position, 2, { x: -0.5, y: 37, z: 26.9, ease: Power3.easeInOut }, 1.5);
        timeline.to(SETTINGS.cameraLookAt, 2.5, { x: -1.02, y: -500, z: -0.63, ease: Power3.easeInOut }, 1.8);
    }

    _leaveInteraction() {
        let timeline = new TimelineLite({
            onComplete: this._leaveInteractionCompletedHandler
        });
        timeline.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        timeline.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        
        this.sceneEntities.cameraLight.turnOff();
    }

    _rayCast() {
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

    rayCastMouseMove() {
        if (!this._enableOutline) return;

        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this._rayCaster.setFromCamera(this._mouse, this._camera);

        let intersects = this._rayCaster.intersectObjects(this._scene.children, true);
        if (intersects[0]) {
            this._getSelectedBox(intersects[0].object.parent);
        }
    }

    _getSelectedBox(object) {
        let regex = /inte_/;
        this._selectedObjects = [];
        if (regex.test(object.name) && this._enableOutline) {
            let splits = object.name.split('_');
            this._activeIndex = parseInt(splits[splits.length - 1]);
            let glowingObj = this._getSelectedObject(this._activeIndex);
            this._selectedObjects.push(glowingObj)
            this._outlinePass.selectedObjects = this._selectedObjects;
            TweenLite.to(this._outlinePass, 1.5, { edgeStrength: 10, edgeThickness: 1 });
        } else {
            this._disableOutline()
        }
    }

    _getSelectedObject(index) {
        let object;

        if (!this.sceneEntities.modeleTest.object) return;

        this.sceneEntities.modeleTest.object.children[0].traverse((child) => {
            if (child.name === `interaction_${index}`) {
                object = child;
            }
        });

        return object;
    }

    triggerAnimations(index) {
        if (this._timelines[index]) {
            this._timelines[index].progress(0);
            this._timelines[index].play();
        };
        this._disableOutline()
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

    _exitStory() {
        if (this._isLeaving) return;

        this._isLeaving = true;

        this._leaveInteraction();
        this._enableOutline = true;
        this._soundManager.pauseAudio();
        this.components.content.transitionOut();
        window.clearTimeout(this._audioEndTimeout);
        this.components.cursor.removeCross();
        this.components.cursor.resetAudioProgress();
        this.components.progressBar.removeActive();
    }

    _exitCredits() {
        if (this._isLeaving || !this._isCreditView) return;

        this._isLeaving = true;

        this._leaveCredits();
    }

    _exitAbout() {
        if (this._isLeaving || !this._isAboutView) return;

        this._isLeaving = true;

        this._leaveAbout();
    }

    _leaveCredits() {
        this.components.cursor.removeCross();
        let timeline = new TimelineLite({
            delay: 1,
            onComplete: this._leaveCreditsCompleteHandler,
        });
        timeline.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        timeline.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);

        this.sceneEntities.modeleTest.resetTexture();
    }

    _leaveAbout() {
        this.components.cursor.removeCross();
        let timeline = new TimelineLite({
            delay: 1,
            onComplete: this._leaveCreditsCompleteHandler,
        });
        timeline.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        timeline.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
    }

    _exitAttempt() {
        this._exitCredits();
        this._exitAbout();
        if (!this._isSpeaking) return;
        this._exitStory();
    }

    _disableOutline() {
        TweenLite.to(this._outlinePass, 1.5, { edgeStrength: 0, edgeThickness: 0 });
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);

        if (this._composer && this._effectFXAA) {
            this._composer.setSize(this._width, this._height);
            this._effectFXAA.uniforms['resolution'].value.set(1 / this._width, 1 / this._height);
        }
    }

    _render() {
        this._delta += 0.01;

        for (let i in this.sceneEntities) {
            this.sceneEntities[i].update(this._delta);
        }

        this._noiseCounter += 0.1;
        this._customPass.uniforms["amount"].value = this._noiseCounter;

        this._soundManager.update(this._delta);
        this._composer.render(this._scene, this._camera);

        this.components.cursor.update(this._delta);
    }

    tick() {
        if (!this._isReady) return;

        this._render();
    }

    _setupEventListeners() {
        for (let i = 0; i < this.components.progressBar.ui.buttons.length; i++) {
            const element = this.components.progressBar.ui.buttons[i];
            element.addEventListener('click', () => this._progressBarButtonClickHandler(i));
        }
    }

    _progressBarButtonClickHandler(i) {
        if (this._isSpeaking) return;
        if (!SETTINGS.enableRaycast) return;

        this._isSpeaking = true;
        this._enableOutline = false;
        this._activeIndex = i + 1;
        this.triggerAnimations(this._activeIndex);
        this.components.progressBar.setActiveBullet(i);
        this.components.progressBar.animateSquare(i);
    }

    _cameraUpdateHandler() {
        this._camera.position.x = SETTINGS.position.x;
        this._camera.position.y = SETTINGS.position.y;
        this._camera.position.z = SETTINGS.position.z;

        this._camera.lookAt(
            SETTINGS.cameraLookAt.x,
            SETTINGS.cameraLookAt.y,
            SETTINGS.cameraLookAt.z
        );

        this.sceneEntities.cameraLight.updatePositions(SETTINGS.position, SETTINGS.cameraLookAt);
    }

    rayCastHandler(object) {
        let regex = /inte_/;
        if (regex.test(object.parent.name)) {
            let splits = object.parent.name.split('_');
            this._activeIndex = parseInt(splits[splits.length - 1]);
            this._isSpeaking = true;
            this._enableOutline = false;

            this.components.progressBar.setActiveBullet(this._activeIndex - 1);
            this.components.progressBar.animateSquare(this._activeIndex - 1);
            this.triggerAnimations(this._activeIndex);
        }
    }

    _cameraAnimationCompletedHandler() {
        this.components.content.update(this._activeIndex);
        this._soundManager.playAudio(this._activeIndex).then((audio) => {
            this._audioEndTimeout = setTimeout(this._audioEndedHandler, audio.duration * 1000);
            this.components.cursor.updateAudioProgress(audio.duration);
            this.components.cursor.displayCross();
            this.sceneEntities.cameraLight.turnOn();
        });
    }

    _leaveInteractionCompletedHandler() {
        this._isLeaving = false;
        this._isSpeaking = false;
    }

    _leaveCreditsCompleteHandler() {
        this._isCreditView = false;
        this._isLeaving = false;
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
        setTimeout(() => {
            this._start();
        }, 100);
    }

    _audioEndedHandler() {
        this._leaveInteraction();
        this.components.cursor.resetAudioProgress();
        this.components.cursor.removeCross();
        this.components.content.transitionOut();
        this.components.progressBar.removeActive();
        this._isSpeaking = false;
        this._enableOutline = true;
    }

    _creditCameraAnimationEnd() {
        this._isCreditView = true;
        this.components.cursor.displayCross();
    }

    _aboutAnimationEnd() {
        this._isAboutView = true;
        this.components.cursor.displayCross();
    }

    mousemoveHandler(position) {
        if (!SETTINGS.enableMousemove) return;
        this.sceneEntities.modeleTest.mousemoveHandler(position);
    }

    clickHandler(event) {
        this._exitAttempt();
        this._rayCast();
    }
}

export default ThreeScene;