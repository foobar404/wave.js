import { ILineOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


/**
 * @source
 */
interface ILinesOptions extends ILineOptions {
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
export class Lines implements IAnimation {
    private _options: ILinesOptions;

    constructor(options?: ILinesOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        this._options = {
            count: 64,
            frequencyBand: "mids",
            ...this._options
        };

        if (this._options?.frequencyBand) audioBufferData = audioData.getFrequencyBands()[this._options?.frequencyBand];

        if (this._options?.mirroredX) {
            let n = 1;
            for (let i = Math.ceil(audioBufferData.length / 2); i < audioBufferData.length; i++) {
                audioBufferData[i] = audioBufferData[Math.ceil(audioBufferData.length / 2) - n];
                n++;
            }
        }

        if (this._options?.top) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];

                let fromX = (width / this._options.count) * i;
                let fromY = 0;
                let toX = fromX;
                let toY = dataValue;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.right) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];

                let fromX = width;
                let fromY = (height / this._options.count) * i;
                let toX = width - dataValue;
                let toY = fromY;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.bottom || (!this._options?.top && !this._options?.right && !this._options?.left && !this._options?.center)) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];

                let fromX = (width / this._options.count) * i;
                let fromY = height;
                let toX = fromX;
                let toY = fromY - dataValue;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.left) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];

                let fromX = 0;
                let fromY = (height / this._options.count) * i;
                let toX = dataValue;
                let toY = fromY;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.center) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];

                let fromX = (width / this._options.count) * i;
                let fromY = height / 2;
                let toX = fromX;
                let toY = fromY - dataValue;

                shapes.line(fromX, fromY, toX, toY, this._options);

                if (this._options?.mirroredY) {
                    fromX = (width / this._options.count) * i;
                    fromY = height / 2;
                    toX = fromX;
                    toY = fromY + dataValue;

                    shapes.line(fromX, fromY, toX, toY, this._options);
                }
            }
        }
    }
}

