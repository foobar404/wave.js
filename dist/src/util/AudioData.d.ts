export declare class AudioData {
    audioBufferData: Uint8Array;
    constructor(audioBufferData: Uint8Array);
    getFrequencyBands(): {
        base: Uint8Array;
        lows: Uint8Array;
        mids: Uint8Array;
        highs: Uint8Array;
    };
}
