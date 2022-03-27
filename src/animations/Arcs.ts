import { IArcOptions, ICircleOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


/**
 * @source
 */
export interface IArcsOptions extends IArcOptions, ICircleOptions {
    count?: number;
    diameter?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
}

/** 
 * These are the options for the Arcs animation [[IArcsOptions]]
 */
export class Arcs implements IAnimation {
    private _options: IArcsOptions;

    constructor(options?: IArcsOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        const centerY = height / 2;
        const centerX = width / 2;
        this._options = {
            count: 30,
            diameter: height / 3,
            lineWidth: 3,
            frequencyBand: "mids",
            rounded: true,
            ...this._options
        }

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        for (let i = 0; i <= this._options.count / 2; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
            let dataValue = audioData.data[dataIndex];

            let centerPoint = ((width - this._options.diameter) / this._options.count) * i;
            let startAngle = 180 - (45 / ((255 / dataValue) / 2));
            let endAngle = 180 + (45 / ((255 / dataValue) / 2));
            let diameter2 = dataValue * 2;

            shapes.arc(centerPoint + (diameter2 / 2), centerY, diameter2, startAngle, endAngle, this._options);
        }

        let dataIndex = Math.floor(audioData.data.length / 2);
        let dataValue = audioData.data[dataIndex];
        shapes.circle(centerX, centerY, this._options.diameter * (dataValue / 255), this._options);

        for (let i = this._options.count / 2; i <= this._options.count; i++) {
            let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
            let dataValue = audioData.data[dataIndex];

            let centerPoint = (((width - this._options.diameter) / this._options.count) * i) + this._options.diameter;
            let startAngle = 180 - (45 / ((255 / dataValue) / 2));
            let endAngle = 180 + (45 / ((255 / dataValue) / 2));
            let diameter2 = dataValue * 2;

            shapes.arc(centerPoint - (diameter2 / 2), centerY, diameter2, startAngle + 180, endAngle + 180, this._options);
        }
    }
}