import * as THREE from 'three';
import { TweenLite } from 'gsap';
import lerp from '../utils/lerp';

class ThreeModele {
    constructor(name) {
        this.name = name;
        this.is3dModel = true;
        this.object;

        this._rotation = {
            x: 0,
            y: 0
        }

        this._mousePosition = {
            x: 0,
            y: 0,
        }
    }

    build(models) {
        this.object = models[this.name].scene;
        this.object.position.z = 5;
        this.object.scale.set(.01, .01, .01);
        this.object.castShadow = true;

        this.object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.emissive = new THREE.Color(0xffffff);
                child.material.emissiveIntensity = 0;
            }
        });
    }

    addToScene(scene) {
        scene.add(this.object);
    }

    updateRotation() {
        this._rotation.x = lerp(this._rotation.x, this._mousePosition.x, 0.1);
        this._rotation.y = lerp(this._rotation.y, this._mousePosition.y, 0.1);

        this.object.rotation.x = - this._rotation.y * 0.00005;
        this.object.rotation.y = - this._rotation.x * 0.00005;
    }

    mousemoveHandler(position) {
        this._mousePosition = position;
    }

    update(delta) {
        this.updateRotation();
    }

}

export default ThreeModele;