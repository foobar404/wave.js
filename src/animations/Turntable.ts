import { IPolygonOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


/**
 * @source
 */
export interface ITurntableOptions extends IPolygonOptions {
    count?: number;
    cubeHeight?: number;
    diameter?: number;
    gap?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    rotate?: number;
}

/** 
 * These are the options for the Turntable animation [[ITurntableOptions]]
 */
export class Turntable implements IAnimation {
    private _options: ITurntableOptions;

    constructor(options?: ITurntableOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        this._options = {
            count: 20,
            rotate: 0,
            diameter: height / 3,
            cubeHeight: 20,
            frequencyBand: "mids",
            gap: 5,
            ...this._options
        };
        const centerX = width / 2;
        const centerY = height / 2;
        const degrees = (360 / this._options.count);

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        for (let i = 0; i < this._options.count; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
            let dataValue = audioData.data[dataIndex];

            for (let j = 0; j < dataValue / this._options.cubeHeight; j++) {
                let diameter1 = this._options.diameter + (this._options.cubeHeight * j) + this._options.gap;
                let diameter2 = this._options.diameter + (this._options.cubeHeight * (j + 1));

                let radians1 = shapes.toRadians((degrees * i) + this._options.rotate + (this._options.gap / 4));
                let radians2 = shapes.toRadians((degrees * (i + 1)) + this._options.rotate);

                let point1X = (diameter1 / 2) * Math.cos(radians1) + centerX;
                let point1Y = (diameter1 / 2) * Math.sin(radians1) + centerY;
                let point2X = (diameter1 / 2) * Math.cos(radians2) + centerX;
                let point2Y = (diameter1 / 2) * Math.sin(radians2) + centerY;

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
}