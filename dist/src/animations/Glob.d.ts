import { IPolygonOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface IGlobOptions extends IPolygonOptions {
    count?: number;
    diameter?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    mirroredX?: boolean;
}
/**
 * These are the options for the Glob animation [[IGlobOptions]]
 */
export declare class Glob implements IAnimation {
    private _options;
    constructor(options?: IGlobOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
