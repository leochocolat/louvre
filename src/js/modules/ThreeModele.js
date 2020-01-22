import * as THREE from 'three';
import lerp from '../utils/lerp';
import fragmentCredits from '../shaders/credits/frag.glsl';
import fragmentAbout from '../shaders/about/frag.glsl';
import vertex from '../shaders/vert.glsl';
import { TweenLite, TimelineLite, Power1 } from 'gsap';

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

        this.object.traverse((child) => {
            if (child.isMesh) {
                let regex = /inte_/;

                if (regex.test(child.name)) {
                    child.visible = true;

                    if (child.material) {
                        child.material.transparent = true;
                        child.material.opacity = 0;
                    }
                } else {
                    child.material.emissive = new THREE.Color(0xffffff);
                    child.material.emissiveIntensity = 0;
                }

                if (child.name == 'IMAGE') {
                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.visible = true;
                }
            }
        });

        this.getClickableAreas();
    }

    _createCreditShaderMaterial(child, creditsTexture, displacementMap) {
        const texture = child.material.map;
        const roughness = child.material.roughness;
        const metalness = child.material.metalness;
        const roughnessMap = child.material.roughnessMap;
        const metalnessMap = child.material.metalnessMap;

        this._creditsUniforms = {
            u_texture: { type: 't', value: texture }, 
            u_map: { type: 't', value: displacementMap },
            u_displacement1: { value: 0 }, 
            u_displacement2: { value: 0.5 }, 
            u_transition: { value: 0 }, 
            u_newTexture: { type: 't', value: creditsTexture }
        }

        let shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this._creditsUniforms,
	        fragmentShader: fragmentCredits,
            vertexShader: vertex,
            defines: {
                PR: window.devicePixelRatio.toFixed(1)
            },
            side: THREE.DoubleSide
        });

        child.material = shaderMaterial;

        let tl = new TimelineLite({
            delay: 1.8
        });

        tl.to(this._creditsUniforms.u_displacement1, 1.5, { value: 0.5 }, 0);
        tl.to(this._creditsUniforms.u_transition, 1.5, { value: 1 }, 0);
        tl.to(this._creditsUniforms.u_displacement2, 1.5, { value: 0 }, 0);
    }

    removeTexture() {
        this.object.traverse((child) => {
            if (child.isMesh) {
                this._createNewTexture(child);
            }
        });
    }
    
    _createNewTexture(object) {
        // const texture = object.material.map;
        // new THREE.TextureLoader().load('../../img/textureBlack.jpg', newTexture => {
        //     this._aboutUniforms = {
        //         u_texture: { type: 't', value: texture },
        //         u_newTexture: { type: 't', value: newTexture },
        //         u_transition: { value: 0 },
        //     }
    
        //     let shaderMaterial = new THREE.ShaderMaterial({
        //         uniforms: this._aboutUniforms,
        //         fragmentShader: fragmentAbout,
        //         vertexShader: vertex,
        //         defines: {
        //             PR: window.devicePixelRatio.toFixed(1)
        //         },
        //         side: THREE.DoubleSide
        //     });
    
        //     object.material = shaderMaterial;

        //     TweenLite.to(this._aboutUniforms.u_transition, 1.5, { value: 0.8, delay: 1 });
        // });
    }

    replaceTexture() {
        this.object.traverse((child) => {
            if (child.isMesh && child.name === 'toile_menu_toile_menu_0') {
                const loader = new THREE.TextureLoader();

                let promise1 = new Promise(resolve => {
                    loader.load('../../img/textureCredits.jpg', resolve);
                });

                let promise2 = new Promise(resolve => {
                    loader.load('../../img/displacement-map.jpg', resolve);
                });

                Promise.all([promise1, promise2]).then(textures => {
                    this._createCreditShaderMaterial(child, textures[0], textures[1]);
                });
            }
        });
    }

    resetTexture() {
        let tl = new TimelineLite();
        tl.to(this._creditsUniforms.u_displacement1, 1.5, { value: 0 }, 0);
        tl.to(this._creditsUniforms.u_transition, 1.5, { value: 0 }, 0);
        tl.to(this._creditsUniforms.u_displacement2, 1.5, { value: 0.5 }, 0); 
    }

    addToScene(scene) {
        scene.add(this.object);
        // scene.add(this._sphereRed);
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