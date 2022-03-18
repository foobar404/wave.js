import { IAnimation } from "./types";
import { Arcs } from "./animations/Arcs";
import { Circles } from "./animations/Circles";
import { Cubes } from "./animations/Cubes";
import { Flower } from "./animations/Flower";
import { Glob } from "./animations/Glob";
import { Lines } from "./animations/Lines";
import { Shine } from "./animations/Shine";
import { Square } from "./animations/Square";
import { Turntable } from "./animations/Turntable";
import { Wave as WaveAnimation } from "./animations/Wave";
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
    constructor(audioElement: HTMLAudioElement, canvasElement: HTMLCanvasElement);
    private _play;
    addAnimation(animation: IAnimation): void;
    clearAnimations(): void;
}
