import bindAll from '../utils/bindAll';
import * as THREE from 'three';
import ModelesLoader from '../modules/ModelesLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class ThreeComponent {
    constructor(options) {
        bindAll(
            this,
            '_tickHandler',
            '_resizeHandler'
        );

        this.el = options.el;
        this.canvas = this.el;

        this._delta = 0;

        this._setup();
    }

    _setup() {
        this._loadModels();
        this._setupThreeScene();
        this._setupControls();
        this._setupLights();
        this._resize();
        this._setupEventListeners();
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._camera.aspect = (this._width / this._height)
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._width , this._height);
    }

    _loadModels() {
        this._loader = new ModelesLoader();
        this._loader.loadAssets().then(() => { 
            this._models = this._loader.getModels();
            this._start();
        });
    }

    _start() {
        this._addMeshToScene();
        this._tickHandler();
    }

    _setupThreeScene() {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.z = 5;

        this._renderer = new THREE.WebGLRenderer({
            canvas: this.el,
            antialias: true,
            physicallyCorrectLights: true,
            gammaInput: true,
            gammaOutput: true
        });

        this._renderer.shadowMap.enabled = true;
    }

    _setupControls() {
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.update();
    }

    _addMeshToScene() {
        //GROUND
        var geometry = new THREE.PlaneGeometry( 20, 20, 1);
        var material = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
        let plane = new THREE.Mesh(geometry, material);
        plane.position.z = 0;
        plane.castShadow = false;
        plane.receiveShadow = true;

        this._scene.add(plane);

        //PHYSICAL LIGHTS
        var sphereGeometry = new THREE.SphereBufferGeometry(0.1, 20, 20);

        var sphereMaterialRed = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5,
            castShadow: true
        });
        var sphereRed = new THREE.Mesh(sphereGeometry, sphereMaterialRed);

        var sphereMaterialBlue = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            emissive: 0x0000ff,
            emissiveIntensity: 0.5,
            castShadow: true
        });
        var sphereBlue = new THREE.Mesh(sphereGeometry, sphereMaterialBlue);

        this._sphereLightRed = new THREE.PointLight(0xff0000, 0.2, 100, 2);
        this._sphereLightRed.add(sphereRed);
        this._sphereLightRed.castShadow = true;

        this._sphereLightBlue = new THREE.PointLight(0x0000ff, 1, 100, 2);
        this._sphereLightBlue.add(sphereBlue);
        this._sphereLightBlue.position.z = 7;
        this._sphereLightBlue.castShadow = true;

        this._scene.add(this._sphereLightRed);
        this._scene.add(this._sphereLightBlue);

        //3D MODEL
        this._microphone = this._models.microphone.scene;
        this._microphone.position.z = 2;
        this._microphone.castShadow = true;
        this._microphone.receiveShadow = false;

        this._microphone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = false;
            }
        });

        this._scene.add(this._microphone);
    }

    _setupLights() {
        let AmbientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light

        let hemisphereLight = new THREE.HemisphereLight();
        hemisphereLight.color.set(0xffffff);
        hemisphereLight.groundColor.set(0xff0000);
        hemisphereLight.position.set(0, 0, 100);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
        directionalLight.position.set(0, 0, 10);
        directionalLight.castShadow = true;

        this._scene.add(AmbientLight);
        this._scene.add(hemisphereLight);
        this._scene.add(directionalLight);
        
        let dirLightHeper = new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000);
        this._scene.add(dirLightHeper);
    }

    _tick() {
        this._controls.update();

        this._delta += 0.01;

        this._sphereLightRed.position.y = Math.sin(this._delta) * 2;
        this._sphereLightRed.position.z = Math.cos(this._delta) * 2 + 5;

        this._sphereLightBlue.position.x = Math.cos(this._delta) * 2;
        this._sphereLightBlue.position.y = Math.sin(this._delta) * 2;
        
        this._renderer.render(this._scene, this._camera);
    }

    _setupEventListeners() {
        window.addEventListener('resize', this._resizeHandler);
    }

    _tickHandler() {
        this._tick();
        window.requestAnimationFrame(this._tickHandler);
    }

    _resizeHandler() {
        this._resize();
    }
}

export default ThreeComponent;