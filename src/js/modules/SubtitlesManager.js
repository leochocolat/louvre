import data from '../../data/audioScripts';
import SubtitlesComponent from '../components/SubtitlesComponent';

class SubtitlesManager {
    constructor() {
        this._setup();

        this.component = new SubtitlesComponent();
    }

    _setup() {

    }

    play(name) {
        for (let i = 0; i < data[name].length; i++) {
            setTimeout(() => {
                this.component.update(data[name][i].content);
            }, data[name][i].timestamp * 1000);
        }
    }

    end() {
        this.component.transitionOut();
    }
}

export default SubtitlesManager;