export default function fromElement(element_id, canvas_id, options) {

    const waveContext = this;
    let element = document.getElementById(element_id);
    if (!element) return
    element.crossOrigin = "anonymous";

    function run() {

        //track current wave for canvas
        this.activeCanvas = this.activeCanvas || {}
        this.activeCanvas[canvas_id] = JSON.stringify(options)

        //track elements used so multiple elements use the same data
        this.activeElements[element_id] = this.activeElements[element_id] || {}
        if (this.activeElements[element_id].count) this.activeElements[element_id].count += 1
        else this.activeElements[element_id].count = 1

        const currentCount = this.activeElements[element_id].count

        //fix "AudioContext already connected" error
        window.$wave = window.$wave || {}
        window.$wave[element.id] = window.$wave[element.id] || {}

        let audioCtx = window.$wave[element.id].audioCtx || new AudioContext();
        window.$wave[element.id].audioCtx = audioCtx

        let analyser = window.$wave[element.id].analyzer || audioCtx.createAnalyser();
        window.$wave[element.id].analyser = analyser

        let source = window.$wave[element.id].source || audioCtx.createMediaElementSource(element);
        window.$wave[element.id].source = source


        //beep test for ios
        let oscillator = audioCtx.createOscillator();
        oscillator.frequency.value = 1;
        oscillator.connect(audioCtx.destination);
        oscillator.start(0);
        oscillator.stop(0);

        source.connect(analyser)
        source.connect(audioCtx.destination)


        analyser.fftsize = 32768;
        let bufferLength = analyser.frequencyBinCount;
        let data = new Uint8Array(bufferLength);
        let frameCount = 1

        function renderFrame() {
            //only run one wave visual per canvas
            if (JSON.stringify(options) != this.activeCanvas[canvas_id]) {
                return
            }

            requestAnimationFrame(renderFrame);
            frameCount++

            //check if this element is the last to be called 
            if (!(currentCount < this.activeElements[element_id].count)) {
                analyser.getByteFrequencyData(data);
                this.activeElements[element_id].data = data
            }

            this.visualize(this.activeElements[element_id].data, canvas_id, options, frameCount);
        }

        renderFrame = renderFrame.bind(this)
        renderFrame();

    }


    const create = () => {
        //remove all events
        ["touchstart", "touchmove", "touchend", "mouseup", "click", "play"].forEach(event => {
            element.removeEventListener(event, create, { once: true })
        })

        run.call(waveContext)
    }

    //wait for a valid user gesture 
    document.body.addEventListener("touchstart", create, { once: true })
    document.body.addEventListener("touchmove", create, { once: true })
    document.body.addEventListener("touchend", create, { once: true })
    document.body.addEventListener("mouseup", create, { once: true })
    document.body.addEventListener("click", create, { once: true })
    element.addEventListener("play", create, { once: true })

}