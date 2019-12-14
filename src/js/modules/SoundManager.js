import data from '../../data/audios';
import bindAll from '../utils/bindAll';
import SubtitlesManager from './SubtitlesManager';
import { TweenLite } from 'gsap';

class SoundManager {
    constructor() {
        bindAll(
            this,
            '_loadHandler',
            '_audioEndedHandler',
            '_muteButtonClickHandler'
        )
        
        this.ui = {
            muteButton: document.querySelector('.js-mute-button')
        }

        this._setup();
        this._setupEventListeners();

        this.audios = {};
    }

    _setup() {
        this._subtitlesManager = new SubtitlesManager();

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new AudioContext();

        this._audioGain = this._audioContext.createGain();
        this._audioGain.gain.value = 1;
        this._audioGain.connect(this._audioContext.destination);
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
            bufferSource.connect(this._audioGain);
            bufferSource.start();
            this._subtitlesManager.play(name);
            bufferSource.loop = false;
            bufferSource.onended = this._audioEndedHandler;
        });
    }

    toggleMute() {
        if (this._audioGain.gain.value === 0) {
            TweenLite.to(this._audioGain.gain, .5, { value: 1 });
        } else {
            TweenLite.to(this._audioGain.gain, .5, { value: 0 });
        }
    }

    _setupEventListeners() {
        this.ui.muteButton.addEventListener('click', this._muteButtonClickHandler);
    }

    _loadHandler() {
        this.play('introduction');
    }

    _audioEndedHandler() {
        this._subtitlesManager.end();
    }

    _muteButtonClickHandler() {
        this.toggleMute();
    }
}

export default SoundManager;