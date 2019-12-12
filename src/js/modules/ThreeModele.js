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
            }
        });
    }

    addToScene(scene) {
        scene.add(this.object);
    }

    update() {
        
    }

}

export default ThreeModele;