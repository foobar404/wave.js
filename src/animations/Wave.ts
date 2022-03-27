import { IPolygonOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


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
export class Wave implements IAnimation {
    private _options: IWaveOptions;

    constructor(options?: IWaveOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const audioData = new AudioData(audioBufferData);
        const shapes = new Shapes(canvas);
        this._options = {
            count: 64,
            frequencyBand: "mids",
            ...this._options
        };

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        if (this._options.mirroredX) {
            let n = 1;
            for (let i = Math.ceil(audioData.data.length / 2); i < audioData.data.length; i++) {
                audioData.data[i] = audioData.data[Math.ceil(audioData.data.length / 2) - n];
                n++;
            }
        }

        if (this._options.top) {
            let points: { x: number, y: number }[] = [{ x: 0, y: 0 }];
            for (let i = 0; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                points.push({
                    x: Math.floor(width / this._options.count) * i,
                    y: dataValue
                });
            }
            points.push({ x: width, y: 0 });
            shapes.polygon(points, this._options);
        }

        if (this._options.right) {
            let points: { x: number, y: number }[] = [{ x: width, y: 0 }];
            for (let i = 0; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                points.push({
                    x: width - dataValue,
                    y: Math.floor(width / this._options.count) * i
                });
            }
            points.push({ x: width, y: height });
            shapes.polygon(points, this._options);
        }

        if (this._options.bottom || (!this._options.top && !this._options.right && !this._options.left && !this._options.center)) {
            let points: { x: number, y: number }[] = [{ x: 0, y: height }];
            for (let i = 0; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                points.push({
                    x: Math.floor(width / this._options.count) * i,
                    y: height - dataValue
                });
            }
            points.push({ x: width, y: height });
            shapes.polygon(points, this._options);
        }

        if (this._options.left) {
            let points: { x: number, y: number }[] = [{ x: 0, y: 0 }];
            for (let i = 0; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                points.push({
                    x: dataValue,
                    y: Math.floor(width / this._options.count) * i
                });
            }
            points.push({ x: 0, y: height });
            shapes.polygon(points, this._options);
        }

        if (this._options.center) {
            let points: { x: number, y: number }[] = [{ x: 0, y: height / 2 }];
            for (let i = 0; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                points.push({
                    x: Math.floor(width / this._options.count) * i,
                    y: (height / 2) - dataValue
                });
            }
            points.push({ x: width, y: height / 2 });
            shapes.polygon(points, this._options);

            if (this._options.mirroredY) {
                points = [{ x: 0, y: height / 2 }];
                for (let i = 0; i <= this._options.count; i++) {
                    let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                    let dataValue = audioData.data[dataIndex];
                    points.push({
                        x: Math.floor(width / this._options.count) * i,
                        y: (height / 2) + dataValue
                    });
                }
                points.push({ x: width, y: height / 2 });
                shapes.polygon(points, this._options);
            }
        }
    }
}