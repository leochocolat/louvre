import * as THREE from 'three';

class Ground {
    constructor() {
        this.plane = {};
        this._setup();
    }

    _setup() {
        this._createPlane();
    }

    _createPlane() {
        let geometry = new THREE.PlaneGeometry(20, 20, 1);
        let material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0x222222,
            metalness: 0.5,
        });
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.position.z = -15;

        this.plane.receiveShadow = true;
    }

    addToScene(scene) {
        scene.add(this.plane);
    }

    update(delta) {
        this.plane.rotation.y = -delta;
    }
}

export default Ground;