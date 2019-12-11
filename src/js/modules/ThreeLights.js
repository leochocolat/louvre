import * as THREE from 'three';

class ThreeLights {
    constructor() {
        this._setup();
    }

    _setup() {
        this.light = new THREE.DirectionalLight({
            color: 0xffffff,
            castShadow: true,
        });

        this.light.position.z = 100;
    }

    addToScene(scene) {
        scene.add(this.light);
    }

    update(delta) {
        
    }
}

export default ThreeLights;