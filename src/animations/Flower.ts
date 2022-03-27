import { IPolygonOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


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
export class Flower implements IAnimation {
    private _options: IFlowerOptions;

    constructor(options?: IFlowerOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        this._options = {
            count: 20,
            diameter: height / 3,
            frequencyBand: "mids",
            rotate: 0,
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

            let radians1 = shapes.toRadians((degrees * i) + this._options.rotate);
            let radians2 = shapes.toRadians((degrees * (i + 1)) + this._options.rotate);

            let point1X = (this._options.diameter / 2) * Math.cos(radians1) + centerX;
            let point1Y = (this._options.diameter / 2) * Math.sin(radians1) + centerY;
            let point2X = (this._options.diameter / 2) * Math.cos(radians2) + centerX;
            let point2Y = (this._options.diameter / 2) * Math.sin(radians2) + centerY;

            let diameter2 = this._options.diameter + dataValue;

            let point3X = (diameter2 / 2) * Math.cos(radians1) + centerX;
            let point3Y = (diameter2 / 2) * Math.sin(radians1) + centerY;
            let point4X = (diameter2 / 2) * Math.cos(radians2) + centerX;
            let point4Y = (diameter2 / 2) * Math.sin(radians2) + centerY;

            shapes.polygon([
                { x: point1X, y: point1Y },
                { x: point3X, y: point3Y },
                { x: point4X, y: point4Y },
                { x: point2X, y: point2Y },
            ], this._options);
        }
    }
}