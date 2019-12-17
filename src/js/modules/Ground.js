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
        let geometry = new THREE.PlaneGeometry(500, 500, 1);
        let material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0xffffff,
        });
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.position.y = 0.1;
        this.plane.rotation.x = Math.PI/2;

        this.plane.receiveShadow = true;
    }

    addToScene(scene) {
        scene.add(this.plane);
    }

    setVisibility(bool) {
        this.plane.visible = bool;
    }

    update(delta) {
        // this.plane.rotation.y = -delta;
    }
}

export default Ground;