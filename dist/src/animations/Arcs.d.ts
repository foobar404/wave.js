import { IArcOptions, ICircleOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface IArcsOptions extends IArcOptions, ICircleOptions {
    count?: number;
    diameter?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
}
/**
 * These are the options for the Arcs animation [[IArcsOptions]]
 */
export declare class Arcs implements IAnimation {
    private _options;
    constructor(options?: IArcsOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
