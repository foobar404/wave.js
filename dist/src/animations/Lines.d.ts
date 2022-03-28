import { ILineOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface ILinesOptions extends ILineOptions {
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
 * These are the options for the Lines animation [[ILinesOptions]]
 */
export declare class Lines implements IAnimation {
    private _options;
    constructor(options?: ILinesOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
