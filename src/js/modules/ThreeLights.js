import * as THREE from 'three';
import * as dat from 'dat.gui';
import bindAll from '../utils/bindAll';

const SETTINGS = {
    enableHelpers: false,
    windowLight: {
        castShadow: true,
        color: '#ff0000',
        intensity: 0.8,
        position: {
            x: 29,
            y: 20,
            z: -4
        },
    },
    globalLight: {
        castShadow: false,
        color: '#ff00ff',
        intensity: 0.9,
        position: {
            x: 100,
            y: 38,
            z: 71
        },
    },
    painterLight: {
        castShadow: false,
        color: '#ff0000',
        intensity: 0.6,
        position: {
            x: -13,
            y: 38,
            z: 58
        },
    }
}

class ThreeLights {
    constructor() {
        bindAll(
            this,
            '_toggleHelpersHandler'
        );

        this._setup();

        const gui = new dat.GUI({
            name: 'Lights'
        });

        gui.add(SETTINGS, 'enableHelpers').onChange(this._toggleHelpersHandler);
        let windowLight = gui.addFolder('windowLight');
        windowLight.add(SETTINGS.windowLight, 'castShadow');
        windowLight.add(SETTINGS.windowLight, 'intensity').min(0).max(1).step(0.1);
        windowLight.add(SETTINGS.windowLight.position, 'x').min(-100).max(100).step(1);
        windowLight.add(SETTINGS.windowLight.position, 'y').min(-100).max(100).step(1);
        windowLight.add(SETTINGS.windowLight.position, 'z').min(-100).max(100).step(1);

        let globalLight = gui.addFolder('globalLight');
        globalLight.add(SETTINGS.globalLight, 'castShadow');
        globalLight.add(SETTINGS.globalLight, 'intensity').min(0).max(1).step(0.1);
        globalLight.add(SETTINGS.globalLight.position, 'x').min(-100).max(100).step(1);
        globalLight.add(SETTINGS.globalLight.position, 'y').min(-100).max(1000).step(1);
        globalLight.add(SETTINGS.globalLight.position, 'z').min(-100).max(100).step(1);

        let painterLight = gui.addFolder('painterLight');
        painterLight.add(SETTINGS.painterLight, 'castShadow');
        painterLight.add(SETTINGS.painterLight, 'intensity').min(0).max(1).step(0.1);
        painterLight.add(SETTINGS.painterLight.position, 'x').min(-100).max(100).step(1);
        painterLight.add(SETTINGS.painterLight.position, 'y').min(-100).max(1000).step(1);
        painterLight.add(SETTINGS.painterLight.position, 'z').min(-100).max(100).step(1);
    }

    _setup() {
        this.globalLight = new THREE.SpotLight(0xFFC132, SETTINGS.globalLight.intensity);
        this.globalLight.position.x = SETTINGS.globalLight.position.x;
        this.globalLight.position.y = SETTINGS.globalLight.position.y;
        this.globalLight.position.z = SETTINGS.globalLight.position.z;
        this.globalLight.castShadow = false;

        this.windowLight = new THREE.PointLight(0xffffff, SETTINGS.windowLight.intensity);

        this.windowLight.position.x = SETTINGS.windowLight.position.x;
        this.windowLight.position.y = SETTINGS.windowLight.position.y;
        this.windowLight.position.z = SETTINGS.windowLight.position.z;
        this.windowLight.castShadow = false;
        
        this.painterLight = new THREE.SpotLight(0xffffff, SETTINGS.painterLight.intensity);
        
        this.painterLight.position.x = SETTINGS.painterLight.position.x;
        this.painterLight.position.y = SETTINGS.painterLight.position.y;
        this.painterLight.position.z = SETTINGS.painterLight.position.z;
        this.painterLight.castShadow = false;

        //helpers
        // this.windowLightHelper = new THREE.PointLightHelper(this.windowLight, 1, 0xff0000);
        // this.globalLightHelper = new THREE.SpotLightHelper(this.globalLight, 0x0000ff);
        // this.painterLightHelper = new THREE.PointLightHelper(this.painterLight, 1, 0x0000ff);

    }

    addToScene(scene) {
        scene.add(this.globalLight);
        // scene.add(this.globalLightHelper);

        scene.add(this.painterLight);
        // scene.add(this.painterLightHelper);

        scene.add(this.windowLight);
        // scene.add(this.windowLightHelper);
    }

    update(delta) {
        this.globalLight.position.x = SETTINGS.globalLight.position.x;
        this.globalLight.position.y = SETTINGS.globalLight.position.y;
        this.globalLight.position.z = SETTINGS.globalLight.position.z;
        this.globalLight.castShadow = SETTINGS.globalLight.castShadow;
        this.globalLight.intensity = SETTINGS.globalLight.intensity;

        // this.globalLightHelper.update(); 

        this.windowLight.position.x = SETTINGS.windowLight.position.x;
        this.windowLight.position.y = SETTINGS.windowLight.position.y;
        this.windowLight.position.z = SETTINGS.windowLight.position.z;
        this.windowLight.castShadow = SETTINGS.windowLight.castShadow;
        this.windowLight.intensity = SETTINGS.windowLight.intensity;

        // this.windowLightHelper.update();

        this.painterLight.position.x = SETTINGS.painterLight.position.x;
        this.painterLight.position.y = SETTINGS.painterLight.position.y;
        this.painterLight.position.z = SETTINGS.painterLight.position.z;
        this.painterLight.castShadow = SETTINGS.painterLight.castShadow;
        this.painterLight.intensity = SETTINGS.painterLight.intensity;

        // this.painterLightHelper.update();
    }

    _toggleHelpersHandler() {
        // this.windowLightHelper.visible = SETTINGS.enableHelpers;
        // this.globalLightHelper.visible = SETTINGS.enableHelpers;
        // this.painterLightHelper.visible = SETTINGS.enableHelpers;

    }
}

export default ThreeLights;