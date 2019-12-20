import data from '../../data/audioScripts';
import SubtitlesComponent from '../components/SubtitlesComponent';

class SubtitlesManager {
    constructor() {
        this._setup();

        this.component = new SubtitlesComponent();
    }

    _setup() {
        this._timeouts = [];
    }

    play(name) {
        for (let i = 0; i < data[name].length; i++) {
            let timeout = setTimeout(() => {
                this.component.update(data[name][i].content);
            }, data[name][i].timestamp * 1000);

            this._timeouts.push(timeout);
        }
    }

    end() {
        this._clearTimeouts();
        setTimeout(() => {
            this.component.transitionOut();
        }, 500);
    }

    _clearTimeouts() {
        for (let i = 0; i < this._timeouts.length; i++) {
            window.clearTimeout(this._timeouts[i]);
        }
    }
}

export default SubtitlesManager;