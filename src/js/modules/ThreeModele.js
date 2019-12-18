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
                let regex = /inte_/;
                if (regex.test(child.name)) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.visible = true;
                    
                    if (child.material) {
                        child.material.transparent = true;
                        child.material.opacity = 0;
                    }
                } else {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.emissive = new THREE.Color(0xffffff);
                    child.material.emissiveIntensity = 0;
                }

                if (child.name == 'IMAGE') {
                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.visible = false;
                }
            }
        });

        this.getClickableAreas();
    }

    addToScene(scene) {
        scene.add(this.object);
        // scene.add(this._sphereRed);
    }

    getPicturePosition() {
        let vec = new THREE.Vector3();

        this.object.traverse((child) => {
            if (child.isMesh) {
                if (child.name === 'toile_menu') {
                    this.object.updateMatrixWorld();
                    let position = child.getWorldPosition(vec);

                    let sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
                    let sphereMaterialRed = new THREE.MeshStandardMaterial({
                        color: 0x00ff00,
                        emissive: 0x00ff00,
                        emissiveIntensity: 0.5
                    });

                    this._sphereRed = new THREE.Mesh(sphereGeometry, sphereMaterialRed);
                    this._sphereRed.name = `ancragePoint_${child.name}`;
                    this._sphereRed.position.x = position.x;
                    this._sphereRed.position.y = position.y;
                    this._sphereRed.position.z = position.z;
                }
            }
        });

        return vec;
    }

    updateRotation() {
        this._rotation.x = lerp(this._rotation.x, this._mousePosition.x, 0.1);
        this._rotation.y = lerp(this._rotation.y, this._mousePosition.y, 0.1);

        this.object.rotation.x = - this._rotation.y * 0.00005;
        this.object.rotation.y = - this._rotation.x * 0.00005;
    }

    getClickableAreas() {
        this.object.traverse((child) => {
            if (child.isMesh) {
                if (child.name === 'Sculpture') {
                    this.object.updateMatrixWorld();

                    let vec = new THREE.Vector3();
                    let position = child.getWorldPosition(vec); 

                    let sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
                    let sphereMaterialRed = new THREE.MeshStandardMaterial({
                        color: 0x00ff00,
                        emissive: 0x00ff00,
                        emissiveIntensity: 0.5
                    });

                    this._sphereRed = new THREE.Mesh(sphereGeometry, sphereMaterialRed);
                    this._sphereRed.name = `ancragePoint_${child.name}`;
                    this._sphereRed.position.x = position.x;
                    this._sphereRed.position.y = position.y;
                    this._sphereRed.position.z = position.z;
                }
            }
        });
    }

    mousemoveHandler(position) {
        this._mousePosition = position;
    }

    update(delta) {
        this.updateRotation();
    }
    
    disableHitBox(bool) {
        console.log(bool)
        this.object.traverse((child) => {
            if (child.isMesh) {
                let regex = /inte_/;
                if (regex.test(child.name)) {
                    child.visible = bool;
                }
            }
        });
    }

}

export default ThreeModele;