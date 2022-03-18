export class AudioData {
    public audioBufferData: Uint8Array;

    constructor(audioBufferData: Uint8Array) {
        this.audioBufferData = audioBufferData;
    }

    public getFrequencyBands() {
        let baseLength = Math.floor(this.audioBufferData.length * .0625);
        let lowsLength = Math.floor(this.audioBufferData.length * .0625);
        let midsLength = Math.floor(this.audioBufferData.length * .375);

        return {
            base: this.audioBufferData.slice(0, baseLength),
            lows: this.audioBufferData.slice(baseLength + 1, baseLength + lowsLength),
            mids: this.audioBufferData.slice(baseLength + lowsLength + 1, baseLength + lowsLength + midsLength),
            highs: this.audioBufferData.slice(baseLength + lowsLength + midsLength + 1)
        }
    }
}