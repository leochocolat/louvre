import * as THREE from 'three';
import * as dat from 'dat.gui';

const SETTINGS = {
    dirLight: {
        color: '#ff0000',
        castShadow: true,
        position: {
            x: 100, 
            y: 66,
            z: -22
        },
    },
    spotLight: {
        color: '#0000ff',
        castShadow: false,
        position: {
            x: 0, 
            y: 100,
            z: 50
        },
    }
}

class ThreeLights {
    constructor() {
        this._setup();

        const gui = new dat.GUI({
            name: 'Lights',
        });

        let directionalLight = gui.addFolder('directionalLight');
        directionalLight.add(SETTINGS.dirLight, 'castShadow');
        directionalLight.add(SETTINGS.dirLight.position, 'x').min(-100).max(100).step(1);
        directionalLight.add(SETTINGS.dirLight.position, 'y').min(-100).max(100).step(1);
        directionalLight.add(SETTINGS.dirLight.position, 'z').min(-100).max(100).step(1);
        
        let spotLight = gui.addFolder('spotLight');
        spotLight.add(SETTINGS.spotLight, 'castShadow');
        spotLight.add(SETTINGS.spotLight.position, 'x').min(-100).max(100).step(1);
        spotLight.add(SETTINGS.spotLight.position, 'y').min(-100).max(100).step(1);
        spotLight.add(SETTINGS.spotLight.position, 'z').min(-100).max(100).step(1);
    }

    _setup() {
        this.spotLight = new THREE.SpotLight(0xffffff, 0.5);
        this.spotLight.position.x = SETTINGS.spotLight.position.x;
        this.spotLight.position.y = SETTINGS.spotLight.position.y;
        this.spotLight.position.z = SETTINGS.spotLight.position.z;
        this.spotLight.castShadow = SETTINGS.spotLight.castShadow;

        this.windowLight = new THREE.DirectionalLight({
            color: 0xffffff,
            intensity: 0.1
        });

        this.windowLight.position.x = SETTINGS.dirLight.position.x;
        this.windowLight.position.y = SETTINGS.dirLight.position.y;
        this.windowLight.position.z = SETTINGS.dirLight.position.z;

        //helpers
        this.dirLightHelper = new THREE.DirectionalLightHelper(this.windowLight, 1, 0xff0000);
        this.spotLightHelper = new THREE.DirectionalLightHelper(this.spotLight, 1, 0x0000ff);
    }

    addToScene(scene) {
        scene.add(this.spotLight);
        scene.add(this.spotLightHelper);

        scene.add(this.windowLight);
        scene.add(this.dirLightHelper);
    }

    update(delta) {
        this.spotLight.position.x = SETTINGS.spotLight.position.x;
        this.spotLight.position.y = SETTINGS.spotLight.position.y;
        this.spotLight.position.z = SETTINGS.spotLight.position.z;
        this.spotLight.castShadow = SETTINGS.spotLight.castShadow;

        this.spotLightHelper.update();

        this.windowLight.position.x = SETTINGS.dirLight.position.x;
        this.windowLight.position.y = SETTINGS.dirLight.position.y;
        this.windowLight.position.z = SETTINGS.dirLight.position.z;   
        this.windowLight.castShadow = SETTINGS.dirLight.castShadow;

        this.dirLightHelper.update();
    }
}

export default ThreeLights;