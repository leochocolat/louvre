import data from '../../data/audios';
import bindAll from '../utils/bindAll';
import SubtitlesManager from './SubtitlesManager';
import { TweenLite } from 'gsap';
import SoundVisualizerComponent from '../components/SoundVisualizerComponent';

class SoundManager {
    constructor() {
        bindAll(
            this,
            '_audioEndedHandler',
            '_muteButtonClickHandler',
        )
        
        this.ui = {
            muteButton: document.querySelector('.js-mute-button'),
            soundBar: document.querySelectorAll('.js-mute-button span'),
            soundState: document.querySelector('.js-sound-state'),
        }

        this.components = {
            soundVisualizer: new SoundVisualizerComponent()
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

        this._analyzer = this._audioContext.createAnalyser();
        this._audioGain.connect(this._analyzer);
    }

    start(audios) {
        this.audios = audios;
        this.playAudio('introduction');
        this.playAmbiance('ambiance');
    }

    playAudio(name) {
        let audio = this.audios[name];
        this._audioContext.decodeAudioData(audio, buffer => {
            let bufferSource = this._audioContext.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.loop = false;
            bufferSource.connect(this._audioGain);
            bufferSource.start();
            this._subtitlesManager.play(name);
            bufferSource.onended = this._audioEndedHandler;
        });
    }

    playAmbiance(name) {
        let audio = this.audios[name];
        this._audioContext.decodeAudioData(audio, buffer => {
            let bufferSource = this._audioContext.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.loop = true;
            bufferSource.connect(this._audioGain);
            bufferSource.start();
        });
    }

    playSound(name) {
        let audio = this.audios[name];
        this._audioContext.decodeAudioData(audio, buffer => {
            let bufferSource = this._audioContext.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.loop = false;
            bufferSource.connect(this._audioGain);
            bufferSource.start();
        });
    }

    toggleMute() {
        if (this._audioGain.gain.value === 0) {
            TweenLite.to(this._audioGain.gain, .5, { value: 1 });
            this.ui.soundState.classList.remove('isMuted');
        } else {
            TweenLite.to(this._audioGain.gain, .5, { value: 0 });
            this.ui.soundState.classList.add('isMuted');
        }
    }

    _updateSoundBar(frequencyArray) {
        for (let i = 0; i < this.ui.soundBar.length; i++) {
            TweenLite.to(this.ui.soundBar[i], .2, { scaleY: 0.2 + frequencyArray[i]/300 })
        }
    }

    update(delta) {
        let frequencyArray = new Uint8Array(this._analyzer.frequencyBinCount);
        this._analyzer.getByteFrequencyData(frequencyArray);
        this.components.soundVisualizer.update(delta, this._audioGain.gain.value);
    } 

    _setupEventListeners() {
        this.ui.muteButton.addEventListener('click', this._muteButtonClickHandler);
    }

    _audioEndedHandler() {
        this._subtitlesManager.end();
    }

    _muteButtonClickHandler() {
        this.toggleMute();
    }
}

export default SoundManager;