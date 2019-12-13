import bindAll from '../utils/bindAll';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import models from '../../data/modeles';
import audios from '../../data/audios';
import LoaderComponent from '../components/LoaderComponent';


class AssetsLoader {
    constructor() {
        bindAll(
            this, 
            '_loadHanlder',
        )

        this._setup();

        this.components = {
            loader: new LoaderComponent({ el: document.querySelector('.js-loader-component') })
        }
    }

    _setup() {
        this._promises = [];
        this.models = {};
        this.audios = {};
        this._modelsLoaded = 0;
    }

    loadAssets() {
        let totalItems = models.length + audios.length;

        for (let i = 0; i < models.length; i++) {
            let promise = new Promise(resolve => {
                this._loader = new GLTFLoader().load(models[i].url, resolve);
                this.models[`${models[i].name}`] = {};
            })
            .then(result => {
                this.models[`${models[i].name}`] = result;
                this._modelsLoaded += 1;
                this.components.loader.updateProgress(this._modelsLoaded/totalItems * 100);
            });
            this._promises.push(promise);
        }

        for (let i = 0; i < audios.length; i++) {
            let promise = new Promise(resolve => {
                return fetch(audios[i].url).then( response => {
                    resolve(response.arrayBuffer());
                });
            }).then((result) =>{
                this._modelsLoaded += 1;
                this.audios[`${audios[i].name}`] = result;
                this.components.loader.updateProgress(this._modelsLoaded/totalItems * 100);
            });
            this._promises.push(promise);
        }

        Promise.all(this._promises).then(this._loadHanlder)

        return Promise.all(this._promises);
    }

    getModels() {
        return this.models;
    }

    getAudios() {
        return this.audios;
    }

    _loadHanlder() {
        this.components.loader.transitionOut();
    }
}

export default AssetsLoader;