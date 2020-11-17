'use strict';

function fromElement(element_id, canvas_id, options) {
  const globalAccessKey = [options.globalAccessKey || '$wave'];
  const initGlobalObject = (elementId) => {
    window[globalAccessKey] = window[globalAccessKey] || {};
    window[globalAccessKey][elementId] =
      window[globalAccessKey][elementId] || {};
  };

  const getGlobal =
    options['getGlobal'] ||
    function (elementId, accessKey) {
      initGlobalObject(elementId);
      return window[globalAccessKey][elementId][accessKey];
    };

  const setGlobal =
    options['setGlobal'] ||
    function (elementId, accessKey, value) {
      let returnValue = getGlobal(elementId);
      if (!returnValue) {
        window[globalAccessKey][elementId][accessKey] =
          window[globalAccessKey][elementId][accessKey] || value;
        returnValue = window[globalAccessKey][elementId][accessKey];
      }
      return returnValue;
    };

  const waveContext = this;
  let element = document.getElementById(element_id);
  if (!element) return;
  element.crossOrigin = 'anonymous';

  function run() {
    //user gesture has happened
    this.activated = true;

    //track current wave for canvas
    this.activeCanvas = this.activeCanvas || {};
    this.activeCanvas[canvas_id] = JSON.stringify(options);

    //track elements used so multiple elements use the same data
    this.activeElements[element_id] = this.activeElements[element_id] || {};
    if (this.activeElements[element_id].count)
      this.activeElements[element_id].count += 1;
    else this.activeElements[element_id].count = 1;

    const currentCount = this.activeElements[element_id].count;

    const audioCtx = setGlobal(element.id, 'audioCtx', new AudioContext());
    const analyser = setGlobal(
      element.id,
      'analyser',
      audioCtx.createAnalyser()
    );

    let source = getGlobal(element.id, 'source');
    if (source) {
      if (source.mediaElement !== element) {
        source = audioCtx.createMediaElementSource(element);
      }
    } else {
      source = audioCtx.createMediaElementSource(element);
    }
    setGlobal(element.id, 'source', source);

    //beep test for ios
    const oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = 1;
    oscillator.connect(audioCtx.destination);
    oscillator.start(0);
    oscillator.stop(0);

    source.connect(analyser);
    source.connect(audioCtx.destination);

    analyser.fftsize = 32768;
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    let frameCount = 1;

    function renderFrame() {
      //only run one wave visual per canvas
      if (JSON.stringify(options) !== this.activeCanvas[canvas_id]) {
        return;
      }

      //if the element or canvas go out of scope, stop animation
      if (
        !document.getElementById(element_id) ||
        !document.getElementById(canvas_id)
      )
        return;

      requestAnimationFrame(renderFrame);
      frameCount++;

      //check if this element is the last to be called
      if (!(currentCount < this.activeElements[element_id].count)) {
        analyser.getByteFrequencyData(data);
        this.activeElements[element_id].data = data;
      }

      this.visualize(
        this.activeElements[element_id].data,
        canvas_id,
        options,
        frameCount
      );
    }

    renderFrame = renderFrame.bind(this);
    renderFrame();
  }

  const create = () => {
    //remove all events
    ['touchstart', 'touchmove', 'touchend', 'mouseup', 'click', 'play'].forEach(
      (event) => {
        element.removeEventListener(event, create, { once: true });
      }
    );

    run.call(waveContext);
  };

  if (this.activated || options['skipUserEventsWatcher']) {
    run.call(waveContext);
  } else {
    //wait for a valid user gesture
    document.body.addEventListener('touchstart', create, { once: true });
    document.body.addEventListener('touchmove', create, { once: true });
    document.body.addEventListener('touchend', create, { once: true });
    document.body.addEventListener('mouseup', create, { once: true });
    document.body.addEventListener('click', create, { once: true });
    element.addEventListener('play', create, { once: true });
  }
}

function fromFile(file, options = {}) {
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
    });

    audio.onplay = function () {
        let findSize = (size) => {

            for (let range = 1; range <= 40; range++) {
                let power = 2 ** range;

                if (size <= power) return power;
            }

        };
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


    };

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

    };

}

function fromStream(stream, canvas_id, options = {}) {

    this.current_stream.id = canvas_id;
    this.current_stream.options = options;

    let audioCtx, analyser, source;
    if (!this.sources[stream.toString()]) {
        audioCtx = options.context || new AudioContext();
        analyser = audioCtx.createAnalyser();

        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        this.sources[stream.toString()] = {
            "audioCtx": audioCtx,
            "analyser": analyser,
            "source": source
        };
    } else {
        cancelAnimationFrame(this.sources[stream.toString()].animation);
        audioCtx = this.sources[stream.toString()].audioCtx;
        analyser = this.sources[stream.toString()].analyser;
        source = this.sources[stream.toString()].source;
    }

    analyser.fftsize = 32768;
    let bufferLength = analyser.frequencyBinCount;
    this.current_stream.data = new Uint8Array(bufferLength);

    let self = this;

    function renderFrame() {
        self.current_stream.animation = requestAnimationFrame(self.current_stream.loop);
        self.sources[stream.toString()].animation = self.current_stream.animation;
        analyser.getByteFrequencyData(self.current_stream.data);

        self.visualize(self.current_stream.data, self.current_stream.id, self.current_stream.options);
    }

    this.current_stream.loop = renderFrame;
    renderFrame();

}

function stopStream() {
    cancelAnimationFrame(this.current_stream.animation);
}

function playStream() {
    this.current_stream.loop();
}

var fromStream$1 = {
    fromStream,
    stopStream,
    playStream
};

var drawDualbarsBlocks = (functionContext) => {
  let { data, options, ctx, h, w } = functionContext;

  let percent = h / 255;
  let width = w / 50;
  let skip = true;
  for (let point = 0; point <= 50; point++) {
    let p = data[point]; //get value
    p *= percent;
    let x = width * point;

    if (skip) {
      ctx.rect(x, h / 2 + p / 2, width, -p);
      skip = false;
    } else {
      skip = true;
    }
  }

  if (options.colors[1]) {
    ctx.fillStyle = options.colors[1];
    ctx.fill();
  }

  ctx.stroke();
};

//options:type,colors,stroke
function visualize(data, canvasId, options = {}, frame) {
  //make a clone of options
  options = { ...options };
  //options
  if (!options.stroke) options.stroke = 1;
  if (!options.colors) options.colors = ['#ff9234', '#ff9234'];
  let canvas = document.getElementById(canvasId);

  if (!canvas) return;

  let ctx = canvas.getContext('2d');
  let h = canvas.height;
  let w = canvas.width;

  ctx.strokeStyle = options.colors[0];
  ctx.lineWidth = options.stroke;

  const functionContext = {
    data,
    options,
    ctx,
    h,
    w,
    Helper: this.Helper,
    canvasId,
  };
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  drawDualbarsBlocks(functionContext);
}

function Wave() {
  this.current_stream = {};
  this.sources = {};
  this.onFileLoad = null;
  this.activeElements = {};
  this.activated = false;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

Wave.prototype = {
  fromElement,
  fromFile,
  ...fromStream$1,
  visualize,
};

module.exports = Wave;
