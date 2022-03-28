import { IRectangleOptions, IAnimation } from "../types";
/**
 * @source
 */
export interface ICubesOptions extends IRectangleOptions {
    count?: number;
    cubeHeight?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    gap?: number;
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    center?: boolean;
    mirroredX?: boolean;
    mirroredY?: boolean;
}
/**
 * These are the options for the Cubes animation [[ICubesOptions]]
 */
export declare class Cubes implements IAnimation {
    private _options;
    constructor(options?: ICubesOptions);
    draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void;
}
