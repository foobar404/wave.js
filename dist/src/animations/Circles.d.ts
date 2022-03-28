import { ICircleOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface ICirclesOptions extends ICircleOptions {
    count?: number;
    diameter?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
}
/**
 * These are the options for the Circles animation [[ICirclesOptions]]
 */
export declare class Circles implements IAnimation {
    private _options;
    constructor(options?: ICirclesOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
