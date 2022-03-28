import { IPolygonOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface IWaveOptions extends IPolygonOptions {
    count?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    center?: boolean;
    mirroredX?: boolean;
    mirroredY?: boolean;
}
/**
 * These are the options for the Wave animation [[IWaveOptions]]
 */
export declare class Wave implements IAnimation {
    private _options;
    constructor(options?: IWaveOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
