export default function fromFile(file, options = {}) {
    //options
    if (!options.stroke) options.stroke = 10;

    let audio = new Audio();
    audio.src = file;

    let audioCtx = new AudioContext();
    let analyser = audioCtx.createAnalyser();

    let source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);

    analyser.fftSize = 64;
    let bufferLength = analyser.frequencyBinCount;

    let file_data;
    let temp_data = new Uint8Array(bufferLength);
    let getWave;
    let fdi = 0;
    let self = this;

    audio.addEventListener('loadedmetadata', async function () {

        while (audio.duration === Infinity) {
            await new Promise(r => setTimeout(r, 1000));
            audio.currentTime = 10000000 * Math.random();
        }

        audio.currentTime = 0;
        audio.play();
    })

    audio.onplay = function () {
        let findSize = (size) => {

            for (let range = 1; range <= 40; range++) {
                let power = 2 ** range;

                if (size <= power) return power;
            }

        }
        let d = audio.duration;
        audio.playbackRate = 16;

        d = d / audio.playbackRate;

        let drawRate = 20; //ms

        let size = ((d / (drawRate / 1000)) * (analyser.fftSize / 2));
        size = findSize(size);
        file_data = new Uint8Array(size);


        getWave = setInterval(function () {
            analyser.getByteFrequencyData(temp_data);

            for (let data in temp_data) {
                data = temp_data[data];
                file_data[fdi] = data;
                fdi++;
            }

        }, drawRate);


    }

    audio.onended = function () {

        if (audio.currentTime === audio.duration && file_data !== undefined) {

            clearInterval(getWave);

            let canvas = document.createElement("canvas");
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;

            self.visualize(file_data, canvas, options);
            let image = canvas.toDataURL("image/jpg");
            self.onFileLoad(image);

            canvas.remove();
        }

    }

}