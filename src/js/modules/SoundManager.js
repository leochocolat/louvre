import data from '../../data/audios';
import bindAll from '../utils/bindAll';
import SubtitlesManager from './SubtitlesManager';

class SoundManager {
    constructor() {
        bindAll(
            this,
            '_loadHandler',
            '_audioEndedHandler'
        )

        this._setup();

        this.audios = {};
    }

    _setup() {
        this._subtitlesManager = new SubtitlesManager();

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new AudioContext();
    }

    start(audios) {
        this.audios = audios;
        this.play('introduction');
    }

    play(name) {
        let audio = this.audios[name];
        this._audioContext.decodeAudioData(audio, buffer => {
            let bufferSource = this._audioContext.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.loop = true;
            bufferSource.connect(this._audioContext.destination);
            bufferSource.start();
            this._subtitlesManager.play(name);
            bufferSource.loop = false;
            bufferSource.onended = this._audioEndedHandler;
        });
    }

    _loadHandler() {
        this.play('introduction');
    }

    _audioEndedHandler() {
        this._subtitlesManager.end();
    }
}

export default SoundManager;