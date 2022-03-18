import { IRectangleOptions, IAnimation } from "../types";
import { Shapes } from "../util/Shapes";
import { AudioData } from "../util/AudioData";


/**
 * @source
 */
interface ICubesOptions extends IRectangleOptions {
    count?: number;
    cubeHeight?: number;
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
            count: 32,
            cubeHeight: 50,
            frequencyBand: "mids",
            ...this._options
        };
        const gap = 5;
        const cubeWidth = (width - (gap * this._options.count)) / this._options.count;

        if (this._options?.frequencyBand) audioBufferData = audioData.getFrequencyBands()[this._options?.frequencyBand];

        if (this._options?.mirroredX) {
            let n = 1;
            for (let i = Math.ceil(audioBufferData.length / 2); i < audioBufferData.length; i++) {
                audioBufferData[i] = audioBufferData[Math.ceil(audioBufferData.length / 2) - n];
                n++;
            }
        }

        if (this._options?.top) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];
                let x = (gap + cubeWidth) * i;
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let y = j * (this._options.cubeHeight + gap);
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.right) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];
                let y = i * (this._options.cubeHeight + gap);
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let x = width - ((gap + cubeWidth) * j);
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.bottom || (!this._options?.top && !this._options?.right && !this._options?.left && !this._options?.center)) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];
                let x = (gap + cubeWidth) * i;
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let y = height - (j * (this._options.cubeHeight + gap));
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.left) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];
                let y = i * (this._options.cubeHeight + gap);
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let x = ((gap + cubeWidth) * j);
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }
        }

        if (this._options?.center) {
            for (let i = 0; i < this._options.count; i++) {
                let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                let dataValue = audioBufferData[dataIndex];
                let x = (gap + cubeWidth) * i;
                let cubeCount = Math.ceil(dataValue / cubeWidth);

                for (let j = 0; j < cubeCount; j++) {
                    let y = (height / 2) - (j * (this._options.cubeHeight + gap));
                    shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                }
            }

            if (this._options?.mirroredY) {
                for (let i = 0; i < this._options.count; i++) {
                    let dataIndex = Math.floor(audioBufferData.length / this._options.count) * i;
                    let dataValue = audioBufferData[dataIndex];
                    let x = (gap + cubeWidth) * i;
                    let cubeCount = Math.ceil(dataValue / cubeWidth);

                    for (let j = 0; j < cubeCount; j++) {
                        let y = (height / 2) + (j * (this._options.cubeHeight + gap));
                        shapes.rectangle(x, y, cubeWidth, this._options.cubeHeight, this._options);
                    }
                }
            }
        }
    }
}