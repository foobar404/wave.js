var Wave = (function () {
    'use strict';

    function fromElement(element, canvas_id, options) {
        if (typeof element === "string") {
            element = document.getElementById(element);
        }

        let audioCtx, analyser, source;
        if (!this.sources[element.toString()]) {
            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();

            source = audioCtx.createMediaElementSource(element);
            source.connect(analyser);
            source.connect(audioCtx.destination); //playback audio

            this.sources[element.toString()] = {
                "audioCtx": audioCtx,
                "analyser": analyser,
                "source": source
            };
        } else {
            cancelAnimationFrame(this.sources[element.toString()].animation);
            audioCtx = this.sources[element.toString()].audioCtx;
            analyser = this.sources[element.toString()].analyser;
            source = this.sources[element.toString()].source;
        }

        analyser.fftSize = 512;
        let bufferLength = analyser.frequencyBinCount;
        let data = new Uint8Array(bufferLength);

        let animation;
        let self = this;

        function renderFrame() {
            animation = requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(data);
            self.sources[element.toString()].animation = animation;

            self.visualize(data, canvas_id, options);
        }

        element.onplay = function () {
            audioCtx.resume();
            renderFrame();
        };

        element.onended = function () {
            cancelAnimationFrame(animation);
        };
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
            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();

            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            source.connect(audioCtx.destination); //playback audio

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

        analyser.fftSize = 512;
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

    var drawWave = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let point_count = 120;
        let increase = w / point_count;
        let percent = h / 255;

        ctx.moveTo(0, h - data[0] * percent);

        for (let point = 1; point <= point_count; point++) {
            let p = data[point]; //get value
            p *= percent;

            ctx.lineTo(increase * point, h - p); //x,y
        }

        ctx.stroke();

        if (options.colors[1]) {
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.lineTo(0, data[0]);

            ctx.fillStyle = options.colors[1];
            ctx.fill();
        }
    };

    var drawShine = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let cx = w / 2;
        let cy = h / 2;
        let r = h / 4;
        let percent = (h / 2 - r) / 255;
        let point_count = 512;
        let increase = (360 / point_count) * Math.PI / 180;

        for (let point = 1; point <= point_count; point++) {
            let p = data[600 % point]; //get value
            p *= percent;
            point++; //start at 1
            let a = point * increase;

            let sx = cx + r * Math.cos(a);
            let sy = cy + r * Math.sin(a);
            ctx.moveTo(sx, sy);

            let dx = cx + (r + p) * Math.cos(a);
            let dy = cy + (r + p) * Math.sin(a);
            ctx.lineTo(dx, dy);

        }
        ctx.stroke();

        if (options.colors[1]) {
            ctx.arc(cx, cy, r * .90, 0, 2 * Math.PI);
            ctx.fillStyle = options.colors[1];
            ctx.fill();
        }
    };

    var drawRing = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let cx = w / 2;
        let cy = h / 2;
        let r = (h - 10) / 2;
        let offset = r / 5;
        let percent = (r - offset) / 255;
        let point_count = 150;
        let increase = (360 / point_count) * Math.PI / 180;

        ctx.arc(cx, cy, r, 0, 2 * Math.PI, true);

        let fa = 0;
        let fx = cx + (r - (data[0] * percent)) * Math.cos(fa);
        let fy = cy + (r - (data[0] * percent)) * Math.sin(fa);
        ctx.moveTo(fx, fy);

        let q = 0;
        for (let point = 0; point < point_count; point++) {
            q += 1;
            if (point >= point_count / 2) {
                q -= 2;
            }

            let p = data[q]; //get value
            p *= percent;

            let a = point * increase;
            let x = cx + (r - p) * Math.cos(a);
            let y = cy + (r - p) * Math.sin(a);

            ctx.lineTo(x, y);
            ctx.arc(x, y, 2, 0, 2 * Math.PI);

        }
        ctx.lineTo(fx, fy);

        ctx.stroke();
        ctx.fillStyle = options.colors[1] || "#fff0";
        ctx.fill();
    };

    var drawBars = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let point_count = 64;
        let percent = h / 255;
        let increase = w / 64;
        let breakpoint = Math.floor(point_count / options.colors.length);

        for (let point = 1; point <= point_count; point++) {
            let p = data[point]; //get value
            p *= percent;

            let x = increase * point;

            ctx.moveTo(x, h);
            ctx.lineTo(x, h - p);

            if (point % breakpoint === 0) {
                let i = (point / breakpoint) - 1;
                ctx.strokeStyle = options.colors[i];
                ctx.stroke();
                ctx.beginPath();
            }

        }
    };

    var drawDualbars = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let percent = h / 255;
        let increase = w / 128;
        let point_count = 128;
        let min = 5;
        let breakpoint = Math.floor(point_count / options.colors.length);

        for (let point = 1; point <= point_count; point++) {
            let p = data[point]; //get value
            p += min;
            p *= percent;

            let x = increase * point;

            let mid = (h / 2) + (p / 2);

            ctx.moveTo(x, mid);
            ctx.lineTo(x, mid - p);

            if (point % breakpoint === 0) {
                let i = (point / breakpoint) - 1;
                ctx.strokeStyle = options.colors[i];
                ctx.stroke();
                ctx.beginPath();
            }

        }
    };

    var drawOrbs = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let percent = (h - 25) / 255;
        let point_count = 128;
        let increase = w / point_count;
        let min = 5;

        for (let point = 1; point <= point_count; point++) {
            let p = data[point]; //get value
            p += min;
            p *= percent;

            let x = increase * point;
            let mid = (h / 2) + (p / 2);

            ctx.moveTo(x, mid);
            ctx.arc(x, mid + 4, 4, 0, 2 * Math.PI);

            ctx.moveTo(x, mid);
            ctx.lineTo(x, mid - p);

            ctx.moveTo(x, mid - p);
            ctx.arc(x, mid - p - 4, 4, 0, 2 * Math.PI);

        }

        ctx.fillStyle = options.colors[0];
        if (options.colors[1]) ctx.fillStyle = options.colors[1];

        ctx.stroke();
        ctx.fill();
    };

    var drawMatrix = (functionContext) => {
        // let { data, canvas, options, ctx, h, w } = functionContext;

        // let waveSize = 8;
        // let percent = (h / 2) / 255;
        // let increase = w / waveSize;

        // ctx.lineJoin = 'round';

        // for (let color in options.colors) {
        //     let c = options.colors[color];

        //     ctx.moveTo(0, (h / 2));

        //     for (let point = 1; point <= waveSize; point++) {
        //         let p = data[point + (color * waveSize)] * percent;
        //         let x = point * increase;
        //         let ll = point + (color * waveSize);

        //         ctx.lineTo(x, p); //x/2,(h/2),
        //     }
        //     ctx.stroke();
        // }
    };

    var drawFlower = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let min = 5;
        let r = h / 4;
        let offset = r / 2;
        let cx = w / 2;
        let cy = h / 2;
        let point_count = 128;
        let percent = (r - offset) / 255;
        let increase = (360 / point_count) * Math.PI / 180;
        let breakpoint = Math.floor(point_count / options.colors.length);

        for (let point = 1; point <= point_count; point++) {
            let p = (data[point] + min) * percent;
            let a = point * increase;

            let sx = cx + (r - (p - offset)) * Math.cos(a);
            let sy = cy + (r - (p - offset)) * Math.sin(a);
            ctx.moveTo(sx, sy);

            let dx = cx + (r + p) * Math.cos(a);
            let dy = cy + (r + p) * Math.sin(a);
            ctx.lineTo(dx, dy);

            if (point % breakpoint === 0) {
                let i = (point / breakpoint) - 1;
                ctx.strokeStyle = options.colors[i];
                ctx.stroke();
                ctx.beginPath();
            }
        }

        ctx.stroke();
    };

    var drawFlowerBlocks = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;
        let r = h / 4;
        let cx = w / 2;
        let cy = h / 2;
        let point_count = 56;
        let percent = r / 255;
        let increase = (360 / point_count) * Math.PI / 180;

        for (let point = 1; point <= point_count; point++) {
            let p = (data[point]) * percent;
            let a = point * increase;

            let ax = cx + (r - (p / 2)) * Math.cos(a);
            let ay = cy + (r - (p / 2)) * Math.sin(a);
            ctx.moveTo(ax, ay);

            let bx = cx + (r + p) * Math.cos(a);
            let by = cy + (r + p) * Math.sin(a);
            ctx.lineTo(bx, by);

            let dx = cx + (r + p) * Math.cos(a + increase);
            let dy = cy + (r + p) * Math.sin(a + increase);
            ctx.lineTo(dx, dy);

            let ex = cx + (r - (p / 2)) * Math.cos(a + increase);
            let ey = cy + (r - (p / 2)) * Math.sin(a + increase);

            ctx.lineTo(ex, ey);
            ctx.lineTo(ax, ay);
        }

        if (options.colors[1]) {
            ctx.fillStyle = options.colors[1];
            ctx.fill();
        }

        ctx.stroke();
    };

    var drawBarsBlocks = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let percent = h / 255;
        let width = w / 64;

        for (let point = 0; point < 64; point++) {
            let p = data[point]; //get value
            p *= percent;
            let x = width * point;

            ctx.rect(x, h, width, -(p));
        }

        ctx.fillStyle = options.colors[1] || options.colors[0];
        ctx.stroke();
        ctx.fill();
    };

    var drawDualbarsBlocks = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let percent = h / 255;
        let width = w / 50;

        for (let point = 0; point <= 50; point++) {
            let p = data[point]; //get value
            p *= percent;
            let x = width * point;

            ctx.rect(x, (h / 2) + (p / 2), width, -(p));
        }

        if (options.colors[1]) {
            ctx.fillStyle = options.colors[1];
            ctx.fill();
        }

        ctx.stroke();
    };

    var drawStar = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let r = h / 4;
        let offset = r / 4;
        let cx = w / 2;
        let cy = h / 2;
        let point_count = 120;
        let percent = (r - offset - 35) / (255);
        let increase = (360 / point_count) * Math.PI / 180;

        let top = [];
        let bottom = [];

        for (let point = 1; point <= point_count; point++) {
            let p = ((data[200 % point])) * percent;
            let a = point * increase;

            let sx = cx + ((r) - p + offset) * Math.cos(a);
            let sy = cy + ((r) - p + offset) * Math.sin(a);
            ctx.moveTo(sx, sy);
            bottom.push({
                x: sx,
                y: sy
            });

            let dx = cx + (r + p + offset) * Math.cos(a);
            let dy = cy + (r + p + offset) * Math.sin(a);
            ctx.lineTo(dx, dy);
            top.push({
                x: dx,
                y: dy
            });

        }


        ctx.moveTo(top[0].x, top[0].y);
        for (let t in top) {
            t = top[t];

            ctx.lineTo(t.x, t.y);
        }
        ctx.closePath();

        ctx.moveTo(bottom[0].x, bottom[0].y);
        for (let b = bottom.length - 1; b >= 0; b++) {
            b = bottom[b];

            ctx.lineTo(b.x, b.y);
        }
        ctx.closePath();


        if (options.colors[1]) {
            ctx.fillStyle = options.colors[1];
            ctx.fill();
        }
        ctx.stroke();

        //inner color
        ctx.beginPath();
        ctx.moveTo(bottom[0].x, bottom[0].y);
        for (let b in bottom) {
            b = bottom[b];

            ctx.lineTo(b.x, b.y);
        }
        ctx.closePath();


        if (options.colors[2]) {
            ctx.fillStyle = options.colors[2];
            ctx.fill();
        }
        ctx.stroke();
    };

    var drawRoundWave = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let r = h / 4;
        let cx = w / 2;
        let cy = h / 2;
        let point_count = 100;
        let percent = r / 255;
        let increase = (360 / point_count) * Math.PI / 180;
        let p = 0;

        // let z = (data[0] + min + offset) * percent;
        let sx = cx + (r + p) * Math.cos(0);
        let sy = cy + (r + p) * Math.sin(0);
        ctx.moveTo(sx, sy);

        for (let point = 1; point <= point_count; point++) {
            let p = (data[350 % point]) * percent;
            let a = point * increase;

            let dx = cx + (r + p) * Math.cos(a);
            let dy = cy + (r + p) * Math.sin(a);
            ctx.lineTo(dx, dy);
        }

        ctx.closePath();
        ctx.stroke();

        if (options.colors[1]) {
            ctx.fillStyle = options.colors[1];
            ctx.fill();
        }
    };

    var drawWings = (functionContext) => {
        let { options, ctx, h, w } = functionContext;

        let r = h / 4;
        let cx = w / 2;
        let cy = h / 2;

        ctx.arc(cx, cy, r, 0, 2 * Math.PI);

        ctx.lineCap = "round";
        ctx.fillStyle = options.colors[1] || options.colors[0];
        ctx.fill();


        ctx.lineWidth = 10;
        if (options.stroke) ctx.lineWidth = options.stroke;

        ctx.stroke();
    };

    var drawVortex = (functionContext) => {
        let { data, options, ctx, h, w } = functionContext;

        let r = h / 4;
        let cx = w / 2;
        let cy = h / 2;
        let percent = r / 255;
        let point_count = 20;
        let increase = (360 / point_count) * Math.PI / 180;

        for (let point = 1; point <= point_count; point++) {
            let p = (data[point]) * percent;
            let a = point * increase;

            let sx = cx + (r) * Math.cos(a);
            let sy = cy + (r) * Math.sin(a);
            ctx.lineTo(sx, sy);

            let dx = cx + (r + p) * Math.cos(a + (increase * (p / 100)));
            let dy = cy + (r + p) * Math.sin(a + (increase * (p / 100)));
            ctx.lineTo(dx, dy);

        }
        ctx.closePath();


        if (options.colors[1]) {
            ctx.fillStyle = options.colors[1];
            ctx.fill();
        }
        ctx.stroke();
    };

    //options:type,colors,stroke
    function visualize(data, canvas, options = {}) {
        //options
        if (!options.stroke) options.stroke = 1;
        if (!options.colors) options.colors = ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"];

        let c;
        if (typeof canvas == "string") {
            c = document.getElementById(canvas);
        } else {
            c = canvas;
        }

        let ctx = c.getContext("2d");

        let h = c.height;
        let w = c.width;

        //clear canvas
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();

        ctx.strokeStyle = options.colors[0];
        ctx.lineWidth = options.stroke;

        let typeMap = {
            "wave": drawWave,
            "shine": drawShine,
            "ring": drawRing,
            "bars": drawBars,
            "dualbars": drawDualbars,
            "orbs": drawOrbs,
            "matrix": drawMatrix,
            "flower": drawFlower,
            "flower blocks": drawFlowerBlocks,
            "bars blocks": drawBarsBlocks,
            "dualbars blocks": drawDualbarsBlocks,
            "star": drawStar,
            "round wave": drawRoundWave,
            "wings": drawWings,
            "vortex": drawVortex
        };

        const functionContext = {
            data, options, ctx, h, w
        };

        if (options.type instanceof Array) {
            options.type.forEach(type => typeMap[type](functionContext));
        } else {
            typeMap[options.type](functionContext);
        }

    }

    function Wave() {
        this.current_stream = {};
        this.sources = {};
        this.onFileLoad = null;
    }

    Wave.prototype = {
        fromElement,
        fromFile,
        ...fromStream$1,
        visualize
    };

    return Wave;

}());
