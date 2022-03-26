import { ILineOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


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
export class Square implements IAnimation {
    private _options: ISquareOptions;

    constructor(options?: ISquareOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        this._options = {
            count: 40,
            diameter: height / 3,
            frequencyBand: "mids",
            ...this._options
        };
        const sideLength = this._options.count / 4;
        const centerX = width / 2;
        const centerY = height / 2;

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        for (let i = 0; i < sideLength; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
            let dataValue = audioData.data[dataIndex];

            let xIncease = this._options.diameter / sideLength;
            let startX = (centerX - (this._options.diameter / 2)) + (xIncease * i);
            let startY = centerY - (this._options.diameter / 2);

            shapes.line(startX, startY, startX, startY - dataValue, this._options);
        }

        for (let i = 0; i < sideLength; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * (i * 2);
            let dataValue = audioData.data[dataIndex];

            let yIncease = this._options.diameter / sideLength;
            let startX = centerX + (this._options.diameter / 2);
            let startY = (centerY - (this._options.diameter / 2)) + (yIncease * i);

            shapes.line(startX, startY, startX + dataValue, startY, this._options);
        }

        for (let i = 0; i < sideLength; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * (i * 3);
            let dataValue = audioData.data[dataIndex];

            let xIncease = this._options.diameter / sideLength;
            let startX = (centerX - (this._options.diameter / 2)) + (xIncease * i);
            let startY = centerY + (this._options.diameter / 2);

            shapes.line(startX, startY, startX, startY + dataValue, this._options);
        }

        for (let i = 0; i < sideLength; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * (i * 4);
            let dataValue = audioData.data[dataIndex];

            let yIncease = this._options.diameter / sideLength;
            let startX = centerX - (this._options.diameter / 2);
            let startY = (centerY - (this._options.diameter / 2)) + (yIncease * i);

            shapes.line(startX, startY, startX - dataValue, startY, this._options);
        }
    }
}