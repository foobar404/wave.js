import { ILineOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface ISquareOptions extends ILineOptions {
    count?: number;
    diameter?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
}
/**
 * These are the options for the Square animation [[ISquareOptions]]
 */
export declare class Square implements IAnimation {
    private _options;
    constructor(options?: ISquareOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
