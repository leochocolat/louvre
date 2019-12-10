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
            antialias: true
        });

        this._renderer.shadowMap.enabled = true;
    }

    _setupControls() {
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.update();
    }

    _addMeshToScene() {
        var geometry = new THREE.PlaneGeometry( 120, 120, 1);
        var material = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
        let plane = new THREE.Mesh(geometry, material);
        plane.position.z = 0;
        plane.castShadow = false;
        plane.receiveShadow = true;

        this._scene.add(plane);

        var sphereGeometry = new THREE.SphereBufferGeometry( 2, 32, 32 );
        var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
        var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        sphere.position.z = 40;
        sphere.castShadow = true;
        sphere.receiveShadow = false;
        // this._scene.add( sphere );

        this._microphone = this._models.microphone.scene;
        this._microphone.position.z = 40;
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
        let spotLight = new THREE.SpotLight( 0xFFFFFF, 2);
        spotLight.position.set(0, 0, 60);
        spotLight.target.position.set(0, 0, 0);

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 5000;
        spotLight.shadow.mapSize.height = 5000;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 2000;

        this.lightHelper = new THREE.SpotLightHelper(spotLight);
        this._scene.add(this.lightHelper);

        this.shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
        this._scene.add(this.shadowCameraHelper);
        this._scene.add(new THREE.AxesHelper(10));

        this._scene.add(spotLight);
    }

    _tick() {
        this._controls.update();
        this.lightHelper.update();
        this.shadowCameraHelper.update();
        this._microphone.rotation.y += 0.1;
        
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