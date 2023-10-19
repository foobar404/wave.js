import { IAnimation } from "./types";
import { Arcs, IArcsOptions } from "./animations/Arcs";
import { Circles, ICirclesOptions } from "./animations/Circles";
import { Cubes, ICubesOptions } from "./animations/Cubes";
import { Flower, IFlowerOptions } from "./animations/Flower";
import { Glob, IGlobOptions } from "./animations/Glob";
import { Lines, ILinesOptions } from "./animations/Lines";
import { Shine, IShineOptions } from "./animations/Shine";
import { Square, ISquareOptions } from "./animations/Square";
import { Turntable, ITurntableOptions } from "./animations/Turntable";
import { Wave as WaveAnimation, IWaveOptions } from "./animations/Wave";

export {
    IArcsOptions,
    ICirclesOptions,
    ICubesOptions,
    IFlowerOptions,
    IGlobOptions,
    ILinesOptions,
    IShineOptions,
    ISquareOptions,
    ITurntableOptions,
    IWaveOptions,
};

export type AudioElement =
    | HTMLAudioElement
    | {
          context: AudioContext;
          source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode;
      }
    | AnalyserNode;

export class Wave {
    public animations = {
        Arcs: Arcs,
        Circles: Circles,
        Cubes: Cubes,
        Flower: Flower,
        Glob: Glob,
        Lines: Lines,
        Shine: Shine,
        Square: Square,
        Turntable: Turntable,
        Wave: WaveAnimation,
    };
    private _activeAnimations: IAnimation[] = [];
    private _audioElement: HTMLAudioElement;
    private _canvasElement: HTMLCanvasElement;
    private _canvasContext: CanvasRenderingContext2D;
    private _audioContext: AudioContext | null;
    private _audioSource: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null;
    private _audioAnalyser: AnalyserNode;
    private _muteAudio: boolean;
    private _interacted: boolean;

    constructor(audioElement: AudioElement, canvasElement: HTMLCanvasElement, muteAudio: boolean = false) {
        this._canvasElement = canvasElement;
        this._canvasContext = this._canvasElement.getContext("2d");
        this._muteAudio = muteAudio;
        this._interacted = false;

        if (audioElement instanceof HTMLAudioElement) {
            this._audioElement = audioElement;

            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (isSafari) {
                const events = ['touchstart', 'touchmove', 'touchend', 'mouseup', 'click'];
                events.forEach((event) => {
                    document.body.addEventListener(
                        event,
                        () => this.connectAnalyser(),
                        { once: true }
                    );
                });
            } else {
                this._audioElement.addEventListener(
                    "play",
                    () => this.connectAnalyser(),
                    { once: true }
                );
            }
        } else if (audioElement instanceof AnalyserNode) {
            this._audioAnalyser = audioElement;
            this._audioContext = null;
            this._audioSource = null;
            this._play();
        } else if (audioElement) {
            this._audioContext = audioElement.context;
            this._audioSource = audioElement.source;
            this._audioAnalyser = this._audioContext.createAnalyser();
            this._play();
        }
    }

    private connectAnalyser(): void {
        if (this._interacted) return;

        this._interacted = true;
        this._audioContext = new AudioContext();
        this._audioSource = this._audioContext.createMediaElementSource(this._audioElement);
        this._audioAnalyser = this._audioContext.createAnalyser();
        this._play();
    }

    private _play(): void {
        if (this._audioSource) {
            this._audioSource.connect(this._audioAnalyser);
            if (!this._muteAudio) {
                this._audioSource.connect(this._audioContext.destination);
            }
        }
        this._audioAnalyser.smoothingTimeConstant = 0.85;
        this._audioAnalyser.fftSize = 1024;
        let audioBufferData = new Uint8Array(this._audioAnalyser.frequencyBinCount);

        let tick = () => {
            this._audioAnalyser.getByteFrequencyData(audioBufferData);
            this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);
            this._activeAnimations.forEach((animation) => {
                animation.draw(audioBufferData, this._canvasContext);
            });
            window.requestAnimationFrame(tick);
        };
        tick();
    }

    public addAnimation(animation: IAnimation): void {
        this._activeAnimations.push(animation);
    }

    public clearAnimations(): void {
        this._activeAnimations = [];
    }
}
