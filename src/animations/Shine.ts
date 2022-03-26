import { ILineOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


/**
 * @source
 */
export interface IShineOptions extends ILineOptions {
    count?: number;
    diameter?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    rotate?: number;
    offset?: boolean;
}

/** 
 * These are the options for the Shine animation [[IShineOptions]]
 */
export class Shine implements IAnimation {
    private _options: IShineOptions;

    constructor(options?: IShineOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        this._options = {
            count: 30,
            rotate: 0,
            diameter: height / 3,
            frequencyBand: "mids",
            ...this._options
        };

        let centerX = width / 2;
        let centerY = height / 2;
        let degrees = (360 / this._options.count);

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        for (let i = 0; i < this._options.count; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
            let dataValue = audioData.data[dataIndex];

            let radians = shapes.toRadians((degrees * i) + this._options.rotate);
            let diameter = this._options?.offset ? this._options.diameter - (dataValue / 2) : this._options.diameter;
            let diameter2 = this._options.diameter + dataValue;

            let point1X = (diameter / 2) * Math.cos(radians) + centerX;
            let point1Y = (diameter / 2) * Math.sin(radians) + centerY;

            let point2X = (diameter2 / 2) * Math.cos(radians) + centerX;
            let point2Y = (diameter2 / 2) * Math.sin(radians) + centerY;

            shapes.line(point1X, point1Y, point2X, point2Y, this._options);
        }
    }
}