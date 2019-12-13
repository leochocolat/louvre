import * as THREE from 'three';

class ThreeModele {
    constructor(name) {
        this.name = name;
        this.is3dModel = true;
        this.object;
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

    update(delta) {
        this.object.traverse((child) => {
            if (child.isMesh) {
                // child.material.emissiveIntensity = Math.cos(delta);
            }
        });
    }

}

export default ThreeModele;