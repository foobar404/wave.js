import { IPolygonOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface IFlowerOptions extends IPolygonOptions {
    count?: number;
    diameter?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    rotate?: number;
}
/**
 * These are the options for the Flower animation [[IFlowerOptions]]
 */
export declare class Flower implements IAnimation {
    private _options;
    constructor(options?: IFlowerOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
