import * as THREE from 'three';
import bindAll from '../utils/bindAll';
import * as dat from 'dat.gui';

import { Sky } from 'three/examples/jsm/objects/Sky.js'
const SETTINGS = {
    sunController: {
        turbidity: 3.5,
        rayleigh: 2.5,
        luminance: 1.1,
        inclination: 0.1,
        azimuth: 0.7,
    }
}

class SkyBox {
    constructor() {
        this._sky = {}
        this._sunSphere = {}

        this._createSkyBox()
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

    _setupSkyBox() {
        this._sky.scale.setScalar(450000);
        this._sunSphere.position.x = 40000 * Math.cos(-SETTINGS.sunController.azimuth);
        this._sunSphere.position.y = 40000 * Math.sin(-SETTINGS.sunController.azimuth) * Math.sin(-SETTINGS.sunController.inclination);
        this._sunSphere.position.z = 40000 * Math.sin(-SETTINGS.sunController.azimuth) * Math.cos(-SETTINGS.sunController.inclination);
        this._sunSphere.visible = SETTINGS.sunController.sun;
        this._skyUniforms["sunPosition"].value.copy(this._sunSphere.position);
        this._skyUniforms["luminance"].value = SETTINGS.sunController.luminance;
        this._skyUniforms["turbidity"].value = SETTINGS.sunController.turbidity;
        this._skyUniforms["rayleigh"].value = SETTINGS.sunController.rayleigh;
    }
    addToScene(scene) {
        scene.add(this._sky, this._sunSphere);
    }
    update() {

    }
}

export default SkyBox