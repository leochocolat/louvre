import * as THREE from 'three';
import { TweenLite } from 'gsap';

class CameraLight {
    constructor() {
        this._setup();
    }

    _setup() {
        this.light = new THREE.SpotLight(0xffffff);
        this.light.intensity = 0;
        this.light.penumbra = 1;
        this.light.distance = 50;
        this.light.decay = 1;
        this.light.shadow.camera.near = 500;
        this.light.shadow.camera.far = 4000;
        this.light.shadow.camera.fov = 30;

    }

    getLight() {
        return this.light;
    }

    addToScene(scene) {
        this._scene = scene;
        scene.add(this.light);
        // scene.add(this.lightHelper);
    }

    turnOn() {
        TweenLite.to(this.light, 1, { intensity: 1 });
    }

    turnOff() {
        TweenLite.to(this.light, 1, { intensity: 0 });
    }

    updatePositions(cameraPosition, cameraLookAt) {
        this.light.position.x = cameraPosition.x;
        this.light.position.y = cameraPosition.y;
        this.light.position.z = cameraPosition.z;

        this.light.target.position.set(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);

        this._scene.add(this.light.target);
    }

    updateLightTarget(object) {
        // this.light.target = object;
        // this.lightHelper.update();
    }

    setVisibility(bool) {
        this.light.visible = bool;
    }

    update(delta) {
        // this.lightHelper.update();
    }
}

export default CameraLight;