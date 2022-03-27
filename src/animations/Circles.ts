import { ICircleOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


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
export class Circles implements IAnimation {
    private _options: ICirclesOptions;

    constructor(options?: ICirclesOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        const centerX = width / 2;
        const centerY = height / 2;
        this._options = {
            count: 40,
            diameter: 0,
            fillColor: "rgba(0,0,0,0)",
            frequencyBand: "mids",
            ...this._options
        };

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        for (let i = 0; i < this._options.count; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
            let dataValue = audioData.data[dataIndex];

            shapes.circle(centerX, centerY, this._options.diameter + dataValue, this._options);
        }
    }
}