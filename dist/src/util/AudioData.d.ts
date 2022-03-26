export declare class AudioData {
    data: Uint8Array;
    constructor(audioBufferData: Uint8Array);
    setFrequencyBand(band: string): void;
    scaleData(maxSize: number): void;
}
