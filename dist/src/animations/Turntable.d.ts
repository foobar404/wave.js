import { IPolygonOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface ITurntableOptions extends IPolygonOptions {
    count?: number;
    cubeHeight?: number;
    diameter?: number;
    gap?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    rotate?: number;
}
/**
 * These are the options for the Turntable animation [[ITurntableOptions]]
 */
export declare class Turntable implements IAnimation {
    private _options;
    constructor(options?: ITurntableOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
