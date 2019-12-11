import bindAll from '../utils/bindAll';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import data from '../../data/modeles';
import LoaderComponent from '../components/LoaderComponent';

class ModelesLoader {
    constructor() {
        bindAll(
            this,
            '_loadHandler'
        );


        this.components = {
            loader: new LoaderComponent({ el: document.querySelector('.js-loader-component') })
        }

        this._setup();
    }

    _setup() {
        this._promises = [];
        this.modeles = {};
    }

    loadAssets() {
        for (let i = 0; i < data.length; i++) {
            let promise = new Promise(resolve => {
                this._loader = new GLTFLoader().load(data[i].url, resolve);
                this.modeles[`${data[i].name}`] = {};
            })
            .then(result => {
                this.modeles[`${data[i].name}`] = result;
                this.components.loader.updateProgress((1+i)/data.length * 100);
            });
            this._promises.push(promise);
        };

        Promise.all(this._promises).then(this._loadHandler);

        return Promise.all(this._promises);
    }

    getModels() {
        return this.modeles;
    }

    _loadHandler() {
        this.components.loader.transitionOut();
        console.log(this.modeles);
    }


}

export default ModelesLoader;