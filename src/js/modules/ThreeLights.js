import * as THREE from 'three';
import * as dat from 'dat.gui';

const SETTINGS = {
    castShadow: true,
    position: {
        x: 0, 
        y: 0,
        z: 100
    },
}

class ThreeLights {
    constructor() {
        this._setup();

        const gui = new dat.GUI({
            name: 'Lights',
        });

        let lights = gui.addFolder('lights');
        lights.add(SETTINGS, 'castShadow');
        lights.add(SETTINGS.position, 'x').min(-100).max(100).step(1);
        lights.add(SETTINGS.position, 'y').min(-100).max(100).step(1);
        lights.add(SETTINGS.position, 'z').min(-100).max(100).step(1);
    }

    _setup() {
        this.light = new THREE.DirectionalLight({
            color: 0xffffff,
        });

        this.light.position.x = SETTINGS.position.x;
        this.light.position.y = SETTINGS.position.y;
        this.light.position.z = SETTINGS.position.z;
    }

    addToScene(scene) {
        scene.add(this.light);
    }

    update(delta) {
        this.light.position.x = SETTINGS.position.x;
        this.light.position.y = SETTINGS.position.y;
        this.light.position.z = SETTINGS.position.z;   
        this.light.castShadow = SETTINGS.castShadow;
    }
}

export default ThreeLights;