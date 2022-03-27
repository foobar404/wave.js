import { IRectangleOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


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
export class Cubes implements IAnimation {
    private _options: ICubesOptions;

    constructor(options?: ICubesOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const { height, width } = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        this._options = {
            count: 20,
            frequencyBand: "mids",
            gap: 5,
            ...this._options
        };
        const cubeWidth = Math.floor((width - (this._options.gap * this._options.count)) / this._options.count);
        if (!this._options?.cubeHeight) this._options.cubeHeight = cubeWidth;

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        if (this._options?.mirroredX) {
            let n = 1;
            for (let i = Math.ceil(audioData.data.length / 2); i < audioData.data.length; i++) {
                audioData.data[i] = audioData.data[Math.ceil(audioData.data.length / 2) - n];
                n++;
            }
        }

        if (this._options?.top) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                let x = (this._options.gap + cubeWidth) * i;
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let y = j * (this._options.cubeHeight + this._options.gap);
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.right) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                let y = i * (this._options.cubeHeight + this._options.gap);
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let x = width - ((this._options.gap + cubeWidth) * j);
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.bottom || (!this._options?.top && !this._options?.right && !this._options?.left && !this._options?.center)) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                let x = (this._options.gap + cubeWidth) * i;
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let y = height - (j * (this._options.cubeHeight + this._options.gap));
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.left) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                let y = i * (this._options.cubeHeight + this._options.gap);
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let x = ((this._options.gap + cubeWidth) * j);
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.center) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                let x = (this._options.gap + cubeWidth) * i;
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let y = (height / 2) - (j * (this._options.cubeHeight + this._options.gap));
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }

            if (this._options?.mirroredY) {
                for (let i = 0; i < this._options.count; i++) {
                    let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                    let dataValue = audioData.data[dataIndex];
                    let x = (this._options.gap + cubeWidth) * i;
                    let cubeCount = Math.ceil(dataValue / cubeWidth);

                    for (let j = 0; j < cubeCount; j++) {
                        let y = (height / 2) + (j * (this._options.cubeHeight + this._options.gap));
                        shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                    }
                }
            }
        }
    }
}