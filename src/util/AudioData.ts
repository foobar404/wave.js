export class AudioData {
    public data: Uint8Array;

    constructor(audioBufferData: Uint8Array) {
        this.data = audioBufferData;
    }

    public setFrequencyBand(band: string) {
        let baseLength = Math.floor(this.data.length * .0625);
        let lowsLength = Math.floor(this.data.length * .0625);
        let midsLength = Math.floor(this.data.length * .375);

        interface IBands { [s: string]: Uint8Array };
        let bands: IBands = {
            base: this.data.slice(0, baseLength),
            lows: this.data.slice(baseLength + 1, baseLength + lowsLength),
            mids: this.data.slice(baseLength + lowsLength + 1, baseLength + lowsLength + midsLength),
            highs: this.data.slice(baseLength + lowsLength + midsLength + 1)
        };

        this.data = bands[band];
    }

    public scaleData(maxSize: number) {
        if(!(maxSize < 255)) return;

        this.data = this.data.map(value => {
            let percent = Math.round((value / 255) * 100) / 100;
            return maxSize * percent;
        })
    }
}