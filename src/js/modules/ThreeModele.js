class ThreeModele {
    constructor(name) {
        this.name = name;
        this.is3dModel = true;
        this.object = {};
    }

    build(models) {
        this.object = models[this.name];
        console.log(this.object);
    }

    update() {

    }

}

export default ThreeModele;