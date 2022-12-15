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
export { IArcsOptions, ICirclesOptions, ICubesOptions, IFlowerOptions, IGlobOptions, ILinesOptions, IShineOptions, ISquareOptions, ITurntableOptions, IWaveOptions, };
export declare type AudioElement = HTMLAudioElement | {
    context: AudioContext;
    source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode;
};
export declare class Wave {
    animations: {
        Arcs: typeof Arcs;
        Circles: typeof Circles;
        Cubes: typeof Cubes;
        Flower: typeof Flower;
        Glob: typeof Glob;
        Lines: typeof Lines;
        Shine: typeof Shine;
        Square: typeof Square;
        Turntable: typeof Turntable;
        Wave: typeof WaveAnimation;
    };
    private _activeAnimations;
    private _audioElement;
    private _canvasElement;
    private _canvasContext;
    private _audioContext;
    private _audioSource;
    private _audioAnalyser;
    private _muteAudio;
    constructor(audioElement: AudioElement, canvasElement: HTMLCanvasElement, muteAudio?: boolean);
    private _play;
    addAnimation(animation: IAnimation): void;
    clearAnimations(): void;
}
