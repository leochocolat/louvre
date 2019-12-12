import bindAll from '../utils/bindAll';
import ThreeScene from '../modules/ThreeScene';

class CanvasComponent {
    constructor(options) {
        bindAll(
            this,
            '_tickHandler',
            '_resizeHandler',
            '_mouseClickHandler'
        );

        this.el = options.el;

        this._setup();
    }

    _setup() {
        this._setupThree();
        this._resize();
        this._setupEventListeners();
    }

    _setupThree() {
        this._threeScene = new ThreeScene(this.el);
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this.el.width = this._width;
        this.el.height = this._height;

        this._threeScene.resize(this._width, this._height);
    }

    _tick() {
        this._threeScene.tick();
    }

    _setupEventListeners() {
        this._tickHandler();
        window.addEventListener('resize', this._resizeHandler);
        window.addEventListener('click', this._mouseClickHandler);

    }

    _tickHandler() {
        this._tick();
        window.requestAnimationFrame(this._tickHandler);
    }
    _mouseClickHandler() {
        this._threeScene.rayCast(event);
    }
    _resizeHandler() {
        this._resize();
    }
}

export default CanvasComponent;

// _addMeshToScene() {
    //     //GROUND
    //     var geometry = new THREE.PlaneGeometry( 20, 20, 1);
    //     var material = new THREE.MeshStandardMaterial({
    //         side: THREE.DoubleSide,
    //         color: 0x222222,
    //         metalness: 0.5,
    //     });
    //     let plane = new THREE.Mesh(geometry, material);
    //     plane.position.z = -10;
    //     plane.receiveShadow = true;

    //     this._scene.add(plane);

    //     //PHYSICAL LIGHTS
    //     var sphereGeometry = new THREE.SphereBufferGeometry(0.1, 20, 20);

    //     var sphereMaterialRed = new THREE.MeshStandardMaterial({
    //         color: 0xff0000,
    //         emissive: 0xff0000,
    //         emissiveIntensity: 0.5
    //     });
    //     var sphereRed = new THREE.Mesh(sphereGeometry, sphereMaterialRed);

    //     var sphereMaterialBlue = new THREE.MeshStandardMaterial({
    //         color: 0x0000ff,
    //         emissive: 0x0000ff,
    //         emissiveIntensity: 0.5
    //     });
    //     var sphereBlue = new THREE.Mesh(sphereGeometry, sphereMaterialBlue);

    //     this._sphereLightRed = new THREE.PointLight(0xffffff, 0.2, 100, 2);
    //     this._sphereLightRed.add(sphereRed);
    //     this._sphereLightRed.position.z = 5;
    //     this._sphereLightRed.castShadow = true;

    //     this._sphereLightBlue = new THREE.PointLight(0xffffff, 1, 100, 2);
    //     this._sphereLightBlue.add(sphereBlue);
    //     this._sphereLightBlue.position.z = 7;
    //     this._sphereLightBlue.castShadow = true;

    //     this._scene.add(this._sphereLightRed);
    //     this._scene.add(this._sphereLightBlue);

    //     //3D MODEL
    //     this._modeleTest = this._models.ruby.scene;
    //     this._modeleTest.position.y = -1;
    //     this._modeleTest.scale.set(.01, .01, .01);
    //     this._modeleTest.castShadow = true;
    //     this._modeleTest.receiveShadow = false;

    //     this._modeleTest.traverse((child) => {
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = false;
    //         }
    //     });

    //     this._scene.add(this._modeleTest);

    //     this._animation = new THREE.AnimationMixer(this._modeleTest);
    //     this._animation.clipAction(this._models.ruby.animations[0]).play();
    // }

    // _setupLights() {
    //     let AmbientLight = new THREE.AmbientLight(0xffffff, 1); // soft white light

    //     let hemisphereLight = new THREE.HemisphereLight();
    //     hemisphereLight.color.set(0xffffff);
    //     hemisphereLight.groundColor.set(0xff0000);
    //     hemisphereLight.position.set(0, 0, 100);

    //     let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    //     directionalLight.position.set(0, 0, 200);
    //     directionalLight.castShadow = true;

    //     this._scene.add(AmbientLight);
    //     this._scene.add(hemisphereLight);
    //     this._scene.add(directionalLight);

    //     //helpers
    //     let dirLightHeper = new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000);
    //     this._scene.add(dirLightHeper);
    // }