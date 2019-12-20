//utils
import bindAll from '../utils/bindAll';
import lerp from '../utils/lerp';

//vendors
import * as THREE from 'three';
import { TweenLite, Power3, TimelineLite } from 'gsap';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js'

import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import * as dat from 'dat.gui';

//components
import ProgressBarComponent from '../components/ProgressBarComponent';
import ContentComponent from '../components/ContentComponent';

//modules
import AssetsLoader from './AssetsLoader';
import SoundManager from './SoundManager';
import ThreeLights from './ThreeLights';
import ThreeModele from './ThreeModele';
import CameraLight from './CameraLight';
import Ground from './Ground';


import vert from '../shaders/vert.glsl'
import frag from '../shaders/frag.glsl'

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
            '_cameraUpdateHandler'
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
        camera.add(SETTINGS.position, 'x').min(-100).max(100).step(0.01).onChange(this._cameraUpdateHandler);
        camera.add(SETTINGS.position, 'y').min(-100).max(100).step(0.01).onChange(this._cameraUpdateHandler);
        camera.add(SETTINGS.position, 'z').min(-100).max(100).step(0.01).onChange(this._cameraUpdateHandler);

        let cameraView = gui.addFolder('cameraView');
        cameraView.add(SETTINGS.cameraLookAt, 'x').min(-500).max(100).step(0.01).onChange(this._cameraUpdateHandler)
        cameraView.add(SETTINGS.cameraLookAt, 'y').min(-500).max(100).step(0.01).onChange(this._cameraUpdateHandler)
        cameraView.add(SETTINGS.cameraLookAt, 'z').min(-500).max(100).step(0.01).onChange(this._cameraUpdateHandler)

        // let camera = gui.addFolder('camera');
        // camera.add(SETTINGS, 'enableOrbitControl');
        // camera.add(SETTINGS.position, 'x').min(-100).max(100).step(0.1).onChange(this._cameraUpdateHandler);
        // camera.add(SETTINGS.position, 'y').min(-100).max(100).step(0.1).onChange(this._cameraUpdateHandler);
        // camera.add(SETTINGS.position, 'z').min(0).max(100).step(0.1).onChange(this._cameraUpdateHandler);

        this._canvas = canvas;


        this.sceneEntities = {
            lights: new ThreeLights(),
            modeleTest: new ThreeModele('500'),
            cameraLight: new CameraLight(),
            ground: new Ground()
        };

        this.components = {
            progressBar: new ProgressBarComponent(),
            content: new ContentComponent()
        }

        this._delta = 0;

        this._setup();
    }

    _setup() {
        this._setupSceneAndCamera();
        this.resize(window.innerWidth, window.innerHeight);
        this._setupAudioManager();
        this._loadAssets();
        this._createSkyBox();
        this._setupCameraAnimations();
        this._createEntities();
        this._createSceneNoise();
        this._createObjectOutline()
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

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.width = 256;
        this._renderer.shadowMap.height = 256;

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
        this._timelines['1'].to(SETTINGS.position, 2, { x: 11.78, y: 16.81, z: -17.58, ease: Power3.easeInOut }, 1.9);
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
                    "amount": { value: this.noiseCounter }
                },
                vertexShader: vert,
                fragmentShader: frag
            }

        this._composer.addPass(renderPass);
        renderPass.renderToScreen = true

        this._composer.setSize(this._width * pixelRatio, this._height * pixelRatio);
        this._composer.setPixelRatio(pixelRatio);

        this.noiseCounter = 0.0

        this._customPass = new ShaderPass(noiseEffect);
        this._composer.addPass(this._customPass);

    }

    _createObjectOutline() {
        this._enableOutline = true;

        this._outlinePass = new OutlinePass(new THREE.Vector2(this._width, this._height), this._scene, this._camera)
        this._outlinePass.edgeStrength = 10;
        this._outlinePass.edgeThickness = 4;
        this._outlinePass.visibleEdgeColor.set(0xffffff);
        this._outlinePass.hiddenEdgeColor.set(0xffffff);

        this._composer.addPass(this._outlinePass);

        this._effectFXAA = new ShaderPass(FXAAShader);
        this._effectFXAA.uniforms['resolution'].value.set(1 / this._width, 1 / this._height);
        this._effectFXAA.renderToScreen = true;

        this._composer.addPass(this._effectFXAA);
    }

    _setupSkyBox() {
        this._sky.scale.setScalar(450000);
        this._sunSphere.position.x = 40000 * Math.cos(-SETTINGS.sunController.azimuth);
        this._sunSphere.position.y = 40000 * Math.sin(-SETTINGS.sunController.azimuth) * Math.sin(-SETTINGS.sunController.inclination);
        this._sunSphere.position.z = 40000 * Math.sin(-SETTINGS.sunController.azimuth) * Math.cos(-SETTINGS.sunController.inclination);
        this._sunSphere.visible = SETTINGS.sunController.sun;
        this._skyUniforms["sunPosition"].value.copy(this._sunSphere.position);
        this._skyUniforms["luminance"].value = SETTINGS.sunController.luminance;
        this._skyUniforms["turbidity"].value = SETTINGS.sunController.turbidity;
        this._skyUniforms["rayleigh"].value = SETTINGS.sunController.rayleigh;;


        this._scene.add(this._sunSphere, this._sky);
    }

    _createSkyBox() {
        this._sky = new Sky();
        this._sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this._skyUniforms = this._sky.material.uniforms;
        this._setupSkyBox();
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
    }

    startExperience() {
        this._setCameraLookAt();
        this._soundManager.start(this._audios);
    }

    _setCameraLookAt() {
        let timeline = new TimelineLite({
            onComplete: () => {
                SETTINGS.enableMousemove = true;
            },
            onUpdate: this._cameraUpdateHandler
        });

        timeline.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut }, 0);
        timeline.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 12, z: -24.5, ease: Power3.easeInOut }, 0);
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

    rayCastMouseMove() {
        console.log(this._enableOutline)
        if (!this._enableOutline) return;

        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this._rayCaster.setFromCamera(this._mouse, this._camera);

        let intersects = this._rayCaster.intersectObjects(this._scene.children, true);

        if (intersects[0]) {
            this._getSelectedBox(intersects[0].object);
        }
    }

    _getSelectedBox(object, index) {
        let regex = /inte_/;
        this._selectedObjects = [];
        if (regex.test(object.name) && this._enableOutline) {
            let splits = object.name.split('_');
            this._activeIndex = parseInt(splits[splits.length - 1]);
            let glowingObj = this._getSelectedObject(this._activeIndex);
            this._selectedObjects.push(glowingObj)
            this._outlinePass.selectedObjects = this._selectedObjects;
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

    _triggerAnimations(object, index) {
        if (this._timelines[index]) {
            this._timelines[index].progress(0);
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

        this.noiseCounter += 0.1;
        this._customPass.uniforms["amount"].value = this.noiseCounter;

        this._soundManager.update(this._delta);
        this._composer.render(this._scene, this._camera);
    }

    tick() {
        if (!this._isReady) return;

        this._render();
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
    }

    rayCastHandler(object) {
        let regex = /inte_/;
        if (regex.test(object.name)) {
            let splits = object.name.split('_');
            this._activeIndex = parseInt(splits[splits.length - 1]);
            this._isSpeaking = true;
            this._enableOutline = false;
            this._triggerAnimations(object, this._activeIndex);
        }
    }

    _cameraAnimationCompletedHandler() {
        this.components.content.update(this._activeIndex);
        this._soundManager.playAudio(this._activeIndex).then((response) => {
            setTimeout(this._audioEndedHandler, response.duration * 1000);
        });
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
        TweenLite.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        TweenLite.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        this.components.content.transitionOut();
        this._isSpeaking = false;
        this._enableOutline = true;

    }

    _leaveInteraction() {
        TweenLite.to(SETTINGS.cameraLookAt, 3, { x: 0, y: 11.9, z: -24.5, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        TweenLite.to(SETTINGS.position, 2, { x: 0.2, y: 17.8, z: 36, ease: Power3.easeInOut, onUpdate: this._cameraUpdateHandler }, 0);
        this.components.content.transitionOut();
        this._isSpeaking = false;
        this._enableOutline = true;

    }

    mousemoveHandler(position) {
        if (!SETTINGS.enableMousemove) return;
        this.sceneEntities.modeleTest.mousemoveHandler(position);
    }
}

export default ThreeScene;