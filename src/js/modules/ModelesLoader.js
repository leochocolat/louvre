import bindAll from '../utils/bindAll';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import data from '../../data/modeles';

class ModelesLoader {
    constructor() {
        bindAll(
            this,
            '_loadHandler'
        );

        this._setup();
    }

    _setup() {
        let promises = [];
        this.modeles = {};
        
        for (let i = 0; i < data.length; i++) {
            let promise = new Promise(resolve => {
                this._loader = new GLTFLoader().load(data[i].url, resolve);
                this.modeles[`${data[i].name}`] = {};
            }).then(result => {
                this.modeles[`${data[i].name}`] = result;
                console.log(`Asset loaded : ${(1+i)/data.length * 100}%`);
            });
            promises.push(promise);
        };

        Promise.all(promises).then(this._loadHandler);
    }

    _loadHandler() {
        console.log('LOADED');
        console.log(this.modeles);
    }
}

export default ModelesLoader;