import * as THREE from 'three';
import { TweenLite } from 'gsap';

class CameraLight {
    constructor() {
        this._setup();
    }

    _setup() {
        this.light = new THREE.DirectionalLight(0xff0000);
        this.light.intensity = 0;

        this.lightHelper = new THREE.DirectionalLightHelper(this.light, 1, 0x00ff00);
    }

    getLight() {
        return this.light;
    }

    addToScene(scene) {
        // scene.add(this.light);
        // scene.add(this.lightHelper);
    }

    turnOn() {
        TweenLite.to(this.light, .5, { intensity: 1 });
    }

    turnOff() {
        TweenLite.to(this.light, .5, { intensity: 0 });
    }

    updateLightPosition(cameraPosition) {
        this.light.position.x = cameraPosition.x;
        this.light.position.y = cameraPosition.y;
        this.light.position.z = cameraPosition.z;
        this.lightHelper.update();
    }

    updateLightTarget(object) {
        // this.light.target = object;
        this.lightHelper.update();
    }

    setVisibility(bool) {
        this.light.visible = bool;
    }

    update(delta) {
        this.lightHelper.update();
    }
}

export default CameraLight;