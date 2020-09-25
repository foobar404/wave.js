var Wave = (function () {
    'use strict';

    function fromElement(element_id, canvas_id, options) {
        const globalAccessKey = [options.globalAccessKey || '$wave'];
        const initGlobalObject = (elementId) => {
            window[globalAccessKey] = window[globalAccessKey] || {};
            window[globalAccessKey][elementId] = window[globalAccessKey][elementId] || {};
        };

        const getGlobal = options['getGlobal'] || function(elementId, accessKey) {
            initGlobalObject(elementId);
            return window[globalAccessKey][elementId][accessKey];
        };

        const setGlobal = options['setGlobal'] || function(elementId, accessKey, value) {
            let returnValue = getGlobal(elementId);
            if(!returnValue) {
                window[globalAccessKey][elementId][accessKey] = window[globalAccessKey][elementId][accessKey] || value;
                returnValue = window[globalAccessKey][elementId][accessKey];
            }
            return returnValue;
        };

        const waveContext = this;
        let element = document.getElementById(element_id);
        if (!element) return
        element.crossOrigin = "anonymous";

        function run() {
            //user gesture has happened
            this.activated = true;

            //track current wave for canvas
            this.activeCanvas = this.activeCanvas || {};
            this.activeCanvas[canvas_id] = JSON.stringify(options);

            //track elements used so multiple elements use the same data
            this.activeElements[element_id] = this.activeElements[element_id] || {};
            if (this.activeElements[element_id].count) this.activeElements[element_id].count += 1;
            else this.activeElements[element_id].count = 1;

            const currentCount = this.activeElements[element_id].count;

            const audioCtx = setGlobal(element.id, 'audioCtx', new AudioContext());
            const analyser = setGlobal(element.id, 'analyser', audioCtx.createAnalyser());

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
                    return
                }

                //if the element or canvas go out of scope, stop animation
                if (!document.getElementById(element_id) || !document.getElementById(canvas_id))
                    return

                requestAnimationFrame(renderFrame);
                frameCount++;

                //check if this element is the last to be called 
                if (!(currentCount < this.activeElements[element_id].count)) {
                    analyser.getByteFrequencyData(data);
                    this.activeElements[element_id].data = data;
                }

                this.visualize(this.activeElements[element_id].data, canvas_id, options, frameCount);
            }

            renderFrame = renderFrame.bind(this);
            renderFrame();

        }


        const create = () => {
            //remove all events
            ["touchstart", "touchmove", "touchend", "mouseup", "click", "play"].forEach(event => {
                element.removeEventListener(event, create, { once: true });
            });

            run.call(waveContext);
        };

        if (this.activated || options['skipUserEventsWatcher']) {
            run.call(waveContext);
        } else {
            //wait for a valid user gesture 
            document.body.addEventListener("touchstart", create, { once: true });
            document.body.addEventListener("touchmove", create, { once: true });
            document.body.addEventListener("touchend", create, { once: true });
            document.body.addEventListener("mouseup", create, { once: true });
            document.body.addEventListener("click", create, { once: true });
            element.addEventListener("play", create, { once: true });
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

    var drawWave = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;
        const helper = new Helper(ctx);

        // data = helper.mutateData(data, "shrink", 200)
        data = helper.mutateData(data, "split", 4)[0];
        data = helper.mutateData(data, "scale", h);

        let points = helper.getPoints("line", w, [0, h], data.length, data, { offset: 100 });
        points.start = points.start.slice(0, points.end.length - 1);
        points.start.push([w, h]);
        points.start.push([0, h]);

        helper.drawPolygon(points.start, { lineColor: colors[0], color: colors[1], radius: (h * .008) });


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
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;
        const helper = new Helper(ctx);

        data = helper.mutateData(data, "organize").mids;
        data = helper.mutateData(data, "split", 2)[0];
        data = helper.mutateData(data, "shrink", 100);
        data = helper.mutateData(data, "mirror");
        data = helper.mutateData(data, "scale", h);
        data = helper.mutateData(data, "amp", .75);

        let points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });
        points.start.forEach((start, i) => {
            helper.drawLine(start, points.end[i], { lineColor: colors[0] });

            helper.drawCircle(start, h * .01, { color: colors[1] || colors[0] });
            helper.drawCircle(points.end[i], h * .01, { color: colors[1] || colors[0] });
        });
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

    var drawRings = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;
        let helper = new Helper(ctx);
        let minDimension = (h < w) ? h : w;

        data = helper.mutateData(data, "organize");
        data = [data.mids, data.vocals];

        data[0] = helper.mutateData(data[0], "scale", minDimension / 4);
        data[1] = helper.mutateData(data[1], "scale", minDimension / 8);

        data[0] = helper.mutateData(data[0], "shrink", 1 / 5);
        data[0] = helper.mutateData(data[0], "split", 2)[0];

        data[0] = helper.mutateData(data[0], "reverb");
        data[1] = helper.mutateData(data[1], "reverb");


        let outerCircle = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data[0].length, data[0]);
        let innerCircle = helper.getPoints("circle", minDimension / 4, [w / 2, h / 2], data[1].length, data[1]);

        helper.drawPolygon(outerCircle.end, { close: true, radius: 4, lineColor: colors[0], color: colors[1] });
        helper.drawPolygon(innerCircle.end, { close: true, radius: 4, lineColor: colors[2], color: colors[3] });

        let middle = ((minDimension / 4) + (minDimension / 2)) / 2;
        let largerInner = data[1] = helper.mutateData(data[1], "scale", ((minDimension / 4) - (minDimension / 2)));
        let innerBars = helper.getPoints("circle", middle, [w / 2, h / 2], data[1].length, largerInner);
        innerBars.start.forEach((start, i) => {
            helper.drawLine(start, innerBars.end[i], { lineColor: colors[4] || colors[2] });
        });
    };

    var drawShineRings = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;

        let helper = new Helper(ctx);
        let minDimension = (h < w) ? h : w;

        data = helper.mutateData(data, "organize");
        data.vocals = helper.mutateData(data.vocals, "scale", (minDimension / 2) / 2);
        data.base = helper.mutateData(data.base, "scale", (minDimension / 2) / 2);

        let outerBars = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals);
        let innerWave = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals, { offset: 100 });
        let thinLine = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.base.length, data.base, { offset: 100 });

        outerBars.start.forEach((start, i) => {
            helper.drawLine(start, outerBars.end[i], { lineColor: colors[0] });
        });

        helper.drawPolygon(innerWave.start, { close: true, lineColor: colors[1], color: colors[3], radius: 5 });
        helper.drawPolygon(thinLine.start, { close: true, lineColor: colors[2], color: colors[4], radius: 5 });
    };

    var drawCubes = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;
        let helper = new Helper(ctx);

        data = helper.mutateData(data, "organize").base;

        data = helper.mutateData(data, "shrink", 20).slice(0, 19);
        data = helper.mutateData(data, "scale", h);

        let points = helper.getPoints("line", w, [0, h], data.length, data);

        let spacing = 5;
        let squareSize = (w / 20) - spacing;
        let colorIndex = 0;

        points.start.forEach((start, i) => {
            let squareCount = Math.ceil(data[i] / squareSize);

            //find color stops from total possible squares in bar 
            let totalSquares = (h - (spacing * (h / squareSize))) / squareSize;
            let colorStop = Math.ceil(totalSquares / colors.length);

            for (let j = 1; j <= squareCount; j++) {
                let origin = [start[0], (start[1] - (squareSize * j) - (spacing * j))];
                helper.drawSquare(origin, squareSize, { color: colors[colorIndex], lineColor: "black" });
                if (j % colorStop == 0) {
                    colorIndex++;
                    if (colorIndex >= colors.length) colorIndex = colors.length - 1;
                }
            }
            colorIndex = 0;
        });
    };

    var drawBigBars = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;
        const helper = new Helper(ctx);

        data = helper.mutateData(data, "organize").vocals;
        data = helper.mutateData(data, "shrink", 10);
        data = helper.mutateData(data, "scale", h);
        data = helper.mutateData(data, "amp", 1);
        let points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });

        let colorIndex = 0;
        let colorStop = Math.ceil(data.length / colors.length);
        points.start.forEach((start, i) => {
            if ((i + 1) % colorStop == 0) colorIndex++;
            helper.drawRectangle(start, data[i], w / data.length, { color: colors[colorIndex] });
        });

    };

    var drawShockwave = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;

        let helper = new Helper(ctx);

        data = helper.mutateData(data, "shrink", 300);
        data = helper.mutateData(data, "scale", h / 2);
        data = helper.mutateData(data, "split", 4).slice(0, 3);

        let colorIndex = 0;
        data.forEach((points) => {
            let wavePoints = helper.getPoints("line", w, [0, h / 2], points.length, points);
            helper.drawPolygon(wavePoints.end, { lineColor: colors[colorIndex], radius: (h * .015) });

            let invertedPoints = helper.getPoints("line", w, [0, h / 2], points.length, points, { offset: 100 });
            helper.drawPolygon(invertedPoints.start, { lineColor: colors[colorIndex], radius: (h * .015) });
            colorIndex++;
        });
    };

    var drawFireworks = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;
        const helper = new Helper(ctx);

        data = helper.mutateData(data, "shrink", 200).slice(0, 120);
        data = helper.mutateData(data, "mirror");
        data = helper.mutateData(data, "scale", (h / 4) + ((h / 4) * .35));

        let points = helper.getPoints("circle", h / 2, [w / 2, h / 2], data.length, data, { offset: 35, rotate: 270 });

        points.start.forEach((start, i) => {
            helper.drawLine(start, points.end[i]);
        });

        helper.drawPolygon(points.start, { close: true });

        points.end.forEach((end, i) => {
            helper.drawCircle(end, h * .01, { color: colors[0] });
        });
    };

    var drawStatic = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let helper = new Helper(ctx);

        data = helper.mutateData(data, "shrink", 1 / 8);
        data = helper.mutateData(data, "split", 2)[0];
        data = helper.mutateData(data, "scale", h);

        let points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });
        let prevPoint = null;
        points.start.forEach((start, i) => {
            if (prevPoint) {
                helper.drawLine(prevPoint, start);
            }
            helper.drawLine(start, points.end[i]);
            prevPoint = points.end[i];
        });


    };

    var drawWeb = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let { colors } = options;
        const helper = new Helper(ctx);
        let minDimension = (h < w) ? h : w;

        data = helper.mutateData(data, "shrink", 100);
        data = helper.mutateData(data, "split", 2)[0];
        data = helper.mutateData(data, "scale", h / 4);

        let dataCopy = data;

        let points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
        helper.drawPolygon(points.end, { close: true });

        points.start.forEach((start, i) => {
            helper.drawLine(start, points.end[i]);
        });

        data = helper.mutateData(data, "scale", .7);
        points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
        helper.drawPolygon(points.end, { close: true });

        data = helper.mutateData(data, "scale", .3);
        points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
        helper.drawPolygon(points.end, { close: true });

        helper.drawCircle([w / 2, h / 2], minDimension / 2, { color: colors[2] });

        dataCopy = helper.mutateData(dataCopy, "scale", 1.4);
        points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], dataCopy.length, dataCopy);
        points.end.forEach((end, i) => {
            helper.drawCircle(end, minDimension * .01, { color: colors[1], lineColor: colors[1] || colors[0] });
        });
    };

    var drawStitches = (functionContext) => {
        let { data, options, ctx, h, w, Helper } = functionContext;
        let helper = new Helper(ctx);
        let minDimension = (h < w) ? h : w;

        data = helper.mutateData(data, "shrink", 200);
        data = helper.mutateData(data, "split", 2)[0];
        data = helper.mutateData(data, "scale", h / 2);

        let points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data, { offset: 50 });

        helper.drawPolygon(points.end, { close: true });
        helper.drawPolygon(points.start, { close: true });

        for (let i = 0; i < points.start.length; i += 1) {
            let start = points.start[i];
            i++;
            let end = points.end[i] || points.end[0];

            helper.drawLine(start, end);
            helper.drawLine(end, points.start[i + 1] || points.start[0]);
        }
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var origami_1 = createCommonjsModule(function (module, exports) {
    /*!
     * Origami.js 0.5.0
     * https://origamijs.com/
     *
     * Copyright Raphael Amorim 2016
     * Released under the GPL-4.0 license
     *
     * Date: 2016-09-23T03:42Z
     */

    (function( window ) {

    /**
     * Config object: Maintain internal state
     * Later exposed as Origami.config
     * `config` initialized at top of scope
     */

    var Origami = {
      // Current Paper
      paper: null
    };

    var config = {
      // Document Styles
      documentStyles: [],

      // Virtual Styles
      virtualStyles: {},

      // All contexts saved
      contexts: [],

      // Origami Shapes Defaults
      defaults: {
        arc: {
          background: 'rgba(0, 0, 0, 0)',
          strokeStyle: 'rgba(0, 0, 0, 0)',
          lineWidth: null,
        },
        rect: {
          background: 'rgba(0, 0, 0, 0)',
          strokeStyle: 'rgba(0, 0, 0, 0)',
          lineWidth: null,
        },
        polygon: {
          background: 'rgba(0, 0, 0, 0)',
          strokeStyle: 'rgba(0, 0, 0, 0)',
          lineWidth: null,
        },
        line: {
          strokeStyle: 'rgba(0, 0, 0, 0)',
          lineWidth: null,
        },
        text: {
          font: '14px Helvetica',
          strokeStyle: 'rgba(0, 0, 0, 0)',
          color: '#000',
          lineWidth: null,
        }
      }
    };

    var prefix = "[origami.js]";

    Origami.warning = function warning(message, obj){
        if (console && console.warn)
            console.warn(prefix, message, obj);
    };

    Origami.error = function error(message){
        throw new Error(prefix.concat(' ' + message));
    };
    Origami.init = function(el) {
      if (el.canvas) {
        el = el.canvas;
      } else {
        el = document.querySelector(el);
      }

      if (!el)
        this.error('Please use a valid selector or canvas context');

      var existentContext = exists(el, config.contexts);
      if (existentContext) {
        this.paper = existentContext;
        return this;
      }

      if (!el.getContext)
        this.error('Please verify if it\'s a valid canvas element');

      el.width = el.clientWidth;
      el.height = el.clientHeight;
      var context = el.getContext('2d');
      var current = {
        element: el,
        queue: [],
        index: config.contexts.length,
        flip: false,
        frame: null,
        ctx: context,
        width: el.width,
        height: el.height,
      };

      config.contexts.push(current);
      this.paper = current;
      return this;
    };

    Origami.styles = function() {
      if (!config.virtualStyles.length)
        defineDocumentStyles();

      var selectors = arguments;
      if (!selectors.length) {
        config.virtualStyles['empty'] = true;
        return this;
      }

      for (var i = 0; i < selectors.length; i++) {
        var style = styleRuleValueFrom(selectors[i], (config.documentStyles[0] || []));
        config.virtualStyles[selectors[i]] = style;
      }
      return this;
    };

    Origami.getPaper = function() {
      return this.paper;
    };

    Origami.canvasCtx = function() {
      return this.paper.ctx;
    };

    Origami.getContexts = function() {
      return config.contexts;
    };

    Origami.cleanContexts = function() {
      config.contexts = [];
    };

    Origami.createComponent = function(component, fn) {
      Origami[component] = function(props) {
        fn.bind(this, this, props)();
        return this;
      };
    };

    Origami.fn = {};

    Origami.draw = function(options) {
      var self = this,
        customRender = false,
        ctx = self.paper.ctx;

      if (typeof(options) === 'string') {
        customRender = new origami.fn[options](self.paper);
        self.paper['ctx'] = customRender;
      }

      var abs = new Screen(self.paper),
        queueList = self.paper.queue;

      for (var i = 0; i < queueList.length; i++) {
        if (queueList[i].loaded === false || queueList[i].failed) {
          Origami.warning('couldn\'t able to load:', queueList[i].params);
        }
        abs[queueList[i].assign](queueList[i].params);
      }
      self.paper.queue = [];

      if (customRender) {
        customRender.draw();
        self.paper.ctx = ctx;
      }

      if (typeof(options) === 'function')
        options();
    };

    Origami.load = function(fn) {
      var mOrigami = clone(this);
      mOrigami.paper = this.paper;
      var loadInterval = setInterval(function() {
        var dataLoad = mOrigami.paper.queue.filter(function(item) {
          return (item.loaded === false && !item.failed);
        });

        // When already loaded
        if (!dataLoad.length) {
          clearInterval(loadInterval);
          fn.bind(mOrigami, mOrigami)();
        }
      }, 1);
    };

    function Queue(assign, params, loaded) {
      this.paper.queue.push({
        assign: assign,
        params: params,
        loaded: loaded
      });
    }

    var queue = Queue.bind(Origami);

    // Utilities.js

    var hasOwn = Object.prototype.hasOwnProperty;

    /**
     * Check if element exists in a Array of NodeItems
     * @param {NodeItem} current nodeItem to check
     * @param {Array} array of NodeItems
     * @returns {NodeItem} NodeItem exitent in array
     */
    function exists(el, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].element.isEqualNode(el))
          return arr[i];
      }
      return false;
    }

    /**
     * Filter arguments by rules
     * @param {Array} methods arguments
     * @param {Object} rules to apply
     * @returns {Object} arguments filtered
     */
    function argsByRules(argsArray, rules) {
      var params = rules || ['x', 'y', 'width', 'height'],
        args = {};

      for (var i = 0; i < argsArray.length; i++) {
        if (typeof(argsArray[i]) === "object")
          args["style"] = argsArray[i];
        else
        if (params.length)
          args[params.shift()] = argsArray[i];
      }

      args.style = normalizeStyle(args.style);

      if ((typeof(args.x) === 'string') && (typeof(args.y) === 'string'))
        args = smartCoordinates(args);

      return args;
    }

    function getBorderStyleObject(prop) {
      return normalizeStyle({border: prop});
    }

    function normalizeStyle(style) {
      if (!style)
        style = {};

      var borderSize = (style.borderSize || null),
        borderColor = (style.borderColor || null),
        borderStyle = (style.borderStyle || []);

      if (style.border) {
        var border = [],
          borderString = style.border;

        // 0 - Size: [0-9]px
        border = border.concat(style.border.match(/[0-9]*\.?[0-9]px?/i));
        borderString = borderString.replace(/[0-9]*\.?[0-9]px?/i, '');

        // 1 - Style
        border = border.concat(borderString.match(/solid|dashed|dotted/i));
        borderString = borderString.replace(/solid|dashed|dotted/i, '');

        // 2 - Color
        border = border.concat(borderString.match(/[^\s]+/i));

        if (!borderSize)
          borderSize = border[0];
        if (!borderColor)
          borderColor = border[2];

        borderStyle = border[1];
      }

      if (borderSize)
        borderSize = borderSize.replace(/[^0-9]/g, '');

      if (typeof(borderStyle) === 'string') {
        if (borderStyle === 'dashed')
          borderStyle = [12];
        else if (borderStyle === 'dotted')
          borderStyle = [3];
        else
          borderStyle = [];
      }

      style['borderSize'] = borderSize;
      style['borderStyle'] = borderStyle;
      style['borderColor'] = borderColor;
      return style;
    }

    /**
     * Return args object with new coordinates based on behavior
     * @returns {Object} args
     */
    function smartCoordinates(args) {
      var x = args.x,
        y = args.y;

      var paper = Origami.getPaper(),
        elmWidth = paper.element.width,
        elmHeight = paper.element.height,
        radius = (args.r || 0);

      var width = (args.width || radius),
        height = (args.height || width);

      var axis = {
        x: [ 'right', 'center', 'left' ],
        y: [ 'top', 'center', 'bottom' ]
      };

      if (axis.x.indexOf(x) !== -1) {
        if (x === 'right')
          x = Math.floor(elmWidth - width);
        else if (x === 'center')
          if (radius)
            x = Math.floor(elmWidth / 2);
          else
            x = Math.floor((elmWidth / 2) - (width / 2));
        else if (x === 'left')
          x = radius;
      } else if ((x + '').substr(-1) === '%') {
        x = (elmWidth * parseInt(x, 10)) / 100;
      } else {
        x = 0;
      }

      if (axis.y.indexOf(y) !== -1) {
        if (y === 'top')
          y = radius;
        else if (y === 'center')
          if (radius)
            y = Math.floor(elmHeight / 2);
          else
            y = Math.floor((elmHeight / 2) - (height / 2));
        else if (y === 'bottom')
          y = Math.floor(elmHeight - height);
      } else if ((y + '').substr(-1) === '%') {
        y = (elmHeight * parseInt(y, 10)) / 100;
      } else {
        y = 0;
      }

      args.y = y;
      args.x = x;
      return args;
    }

    /**
     * Return all documentStyles to a especified origami context
     * @returns undefined
     */
    function defineDocumentStyles() {
      for (var i = 0; i < document.styleSheets.length; i++) {
        var mysheet = document.styleSheets[i],
          myrules = mysheet.cssRules ? mysheet.cssRules : mysheet.rules;
        config.documentStyles.push(myrules);
      }
    }

    /**
     * Merge defaults with user options
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    function extend(a, b, undefOnly) {
      for (var prop in b) {
        if (hasOwn.call(b, prop)) {

          // Avoid "Member not found" error in IE8 caused by messing with window.constructor
          // This block runs on every environment, so `global` is being used instead of `window`
          // to avoid errors on node.
          if (prop !== "constructor" || a !== commonjsGlobal) {
            if (b[prop] === undefined) {
              delete a[prop];
            } else if (!(undefOnly && typeof a[prop] !== "undefined")) {
              a[prop] = b[prop];
            }
          }
        }
      }
      return a;
    }

    /**
     * Get Style Rule from a specified element
     * @param {String} selector from element
     * @param {Array} Document Style Rules
     * @returns {Object} Merged values of defaults and options
     */
    function styleRuleValueFrom(selector, documentStyleRules) {
      for (var j = 0; j < documentStyleRules.length; j++) {
        if (documentStyleRules[j].selectorText && documentStyleRules[j].selectorText.toLowerCase() === selector) {
          return documentStyleRules[j].style;
        }
      }
    }

    /**
     * Clone a object
     * @param {Object} object
     * @returns {Object} cloned object
     */
    function clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    }

    function Screen(currentContext) {
      this.paper = currentContext;
    }

    Screen.prototype.translate = function(params) {
      this.paper.ctx.translate(params.x, params.y);
    };

    Screen.prototype.background = function(params) {
      this.paper.element.style.backgroundColor = params.color;
    };

    Screen.prototype.restore = function() {
      this.paper.ctx.restore();
    };

    Screen.prototype.save = function() {
      this.paper.ctx.save();
    };

    Screen.prototype.composition = function(params) {
      this.paper.ctx.globalCompositeOperation = params.globalComposite;
    };

    Screen.prototype.rotate = function(params) {
      this.paper.ctx.rotate(params.degrees);
    };

    Screen.prototype.scale = function(params) {
      this.paper.ctx.scale(params.width, params.height);
    };

    Screen.prototype.flip = function(params) {
      this.paper.flip = 'horizontal';
      if (params.type && typeof(params.type) === 'string')
        this.paper.flip = params.type;
    };

    Screen.prototype.flipEnd = function() {
      this.paper.flip = false;
    };

    Screen.prototype.clear = function() {
      this.paper.ctx.clearRect(0, 0, this.paper.width, this.paper.height);
    };

    function ArcShape(params) {
      var args = params.args,
        style = args.style,
        def = config.defaults.arc;

      this.paper.ctx.beginPath();
      this.paper.ctx.setLineDash(style.borderStyle);
      this.paper.ctx.arc(args.x, args.y, (args.r || def.radius), (args.sAngle || 0), (args.eAngle || 2 * Math.PI));
      this.paper.ctx.fillStyle = (style.background || style.bg) ? (style.background || style.bg) : def.background;
      this.paper.ctx.fill();
      this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
      this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
      this.paper.ctx.stroke();
      this.paper.ctx.setLineDash([]);
      this.paper.ctx.closePath();
    }

    Screen.prototype.arc = ArcShape;

    Origami.arc = function() {
      var args = [].slice.call(arguments);
      args = argsByRules(args, ['x', 'y', 'r', 'sAngle', 'eAngle']);

      queue('arc', {
        args: args
      });
      return this;
    };

    function ImageShape(params) {
      var image = params.image,
        x = params.x,
        y = params.y,
        width = params.width,
        height = params.height;

      this.paper.ctx.save();
      if (this.paper.flip) {
        if (this.paper.flip === 'horizontal') {
          this.paper.ctx.scale(-1, 1);
          width = width * -1;
          x = x * -1;
        }
        if (this.paper.flip === 'vertical') {
          this.paper.ctx.scale(1, -1);
          height = height * -1;
          y = y * -1;
        }
      }

      this.paper.ctx.beginPath();
      this.paper.ctx.drawImage(image, Math.floor((x || 0)), Math.floor((y || 0)), width, height);
      this.paper.ctx.closePath();
      this.paper.ctx.restore();
    }

    Screen.prototype.image = ImageShape;

    Origami.image = function(image, x, y, width, height) {
      var self = this;
      if (!image)
        return this;

      if (typeof(image) === 'string') {
        var img = new Image();
        img.src = image;
        image = img;
      }

      var item = {
        image: image,
        x: x,
        y: y,
        width: width,
        height: height
      };

      if ((typeof(item.x) === 'string') && (typeof(item.y) === 'string'))
        item = smartCoordinates(item);

      if (image.complete) {
        item.width = width || image.naturalWidth;
        item.height = height || image.naturalHeight;

        queue('image', item);
        return self;
      }

      queue('image', item, false);
      var reference = (self.paper.queue.length - 1),
        currentQueue = config.contexts[this.paper.index].queue[reference];

      image.addEventListener('load', function() {
        if (!currentQueue)
          return false;
        currentQueue.params.width = (item.width || image.naturalWidth);
        currentQueue.params.height = (item.height || image.naturalHeight);
        currentQueue.loaded = true;
      });

      image.addEventListener('error', function() {
        if (!currentQueue)
          return false;
        currentQueue.failed = true;
      });

      return self;
    };

    function LineShape(params) {
      var def = config.defaults.line,
          style = params.style,
          pointA = params.pointA,
          pointB = params.pointB;

      this.paper.ctx.beginPath();
      this.paper.ctx.setLineDash(style.borderStyle);
      this.paper.ctx.moveTo((pointA.x || 0), (pointA.y || 0));
      this.paper.ctx.lineTo((pointB.x || 0), (pointB.y || 0));

      this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
      this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
      this.paper.ctx.stroke();
      this.paper.ctx.setLineDash([]);
      this.paper.ctx.closePath();
    }

    Screen.prototype.line = LineShape;

    Origami.line = function(pointA, pointB, style) {
      style = normalizeStyle(style);

      queue('line', {
        pointA: pointA,
        pointB: pointB,
        style: style
      });
      return this;
    };

    function PolygonShape(params) {
      var args = params.args,
        style = params.style,
        def = config.defaults.polygon;

      this.paper.ctx.beginPath();
      this.paper.ctx.setLineDash(style.borderStyle);
      this.paper.ctx.fillStyle = (style.background) ? style.background : def.background;
      this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
      this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;

      for (var p = 0; p < args.length; p++) {
        if (!args[p].x)
          continue;

        if (p)
          this.paper.ctx.lineTo(args[p].x, args[p].y);
        else
          this.paper.ctx.moveTo(args[p].x, args[p].y);
      }

      this.paper.ctx.fill();
      this.paper.ctx.stroke();
      this.paper.ctx.setLineDash([]);
      this.paper.ctx.closePath();
    }

    Screen.prototype.polygon = PolygonShape;

    Origami.polygon = function() {
      var args = [].slice.call(arguments),
        settedArgs = argsByRules(args);

      queue('polygon', {
        style: settedArgs.style,
        args: args
      });
      return this;
    };

    function RectShape(params) {
      var def = config.defaults.rect,
        style = params.style,
        args = params.args;

      this.paper.ctx.beginPath();
      this.paper.ctx.setLineDash(style.borderStyle);
      this.paper.ctx.fillStyle = (style.background) ? style.background : def.background;
      this.paper.ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

      this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
      this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
      this.paper.ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
      this.paper.ctx.setLineDash([]);
      this.paper.ctx.closePath();
    }

    Screen.prototype.rect = RectShape;

    Origami.rect = function() {
      var args = [].slice.call(arguments);
      args = argsByRules(args);

      queue('rect', {
        style: args.style,
        args: args
      });
      return this;
    };

    Origami.border = function() {
      var args = [].slice.call(arguments);
      args = argsByRules(args);

      queue('rect', {
        style: args.style,
        args: {
          x: 0,
          y: 0,
          width: this.paper.width,
          height: this.paper.height
        }
      });
      return this;
    };

    function CSSShape(style) {
      var self = this,
        style = config.virtualStyles[style];

      if (!style)
        return self;

      // TODO: Draw in all canvas
      var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        self.paper.width + 'px" height="' + self.paper.height + 'px">' +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml">' +
        '<div style="' + style.cssText + '"></div>' +
        '</div></foreignObject>' +
        '</svg>';

      var DOMURL = window.URL || window.webkitURL || window,
        img = new Image(),
        svg = new Blob([data], {
          type: 'image/svg+xml;charset=utf-8'
        });

      var url = DOMURL.createObjectURL(svg);
      img.src = url;

      img.addEventListener('load', function() {
        self.paper.ctx.beginPath();
        self.paper.ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
        self.paper.ctx.closePath();
      });

      return self;
    }

    Screen.prototype.CSSShape = CSSShape;

    Origami.shape = function(style) {
      queue('CSSShape', style);
      return this;
    };

    function SpriteShape(params) {
      var properties = params.properties,
        dw = params.width / properties.frames;

      drawSprite.call(this, {
        image: params.image,
        posX: 0,
        posY: 0,
        frame: properties.frames,
        loop: properties.loop,
        width: dw,
        widthTotal: params.width,
        height: params.height,
        dx: params.x,
        dy: params.y,
        speed: properties.speed,
        animation: null
      });
    }

    function drawSprite(sprite) {
      var self = this;

      if (sprite.posX === sprite.widthTotal) {
        if (sprite.loop === false) {
          window.cancelAnimationFrame(sprite.animation);
          return;
        }
        sprite.posX = 0;
      }

      self.paper.ctx.clearRect(sprite.dx, sprite.dy, sprite.width, sprite.height);

      self.paper.ctx.beginPath();
      self.paper.ctx.drawImage(sprite.image, sprite.posX, sprite.posY,
        sprite.width, sprite.height, sprite.dx, sprite.dy,
        sprite.width, sprite.height);
      self.paper.ctx.closePath();

      sprite.posX = sprite.posX + sprite.width;

      setTimeout(function() {
        sprite.animation = window.requestAnimationFrame(drawSprite.bind(self, sprite));
      }, sprite.speed);
    }

    Screen.prototype.sprite = SpriteShape;

    Origami.sprite = function(x, y, properties) {
      var self = this;

      if (!properties || !properties.src)
        return this;

      var image = new Image(),
        frames = (properties.frames || 0),
        loop = (properties.loop || true),
        speed = (properties.speed || 10);

      image.src = properties.src;

      var item = {
        x: x,
        y: y,
        image: image,
        properties: properties,
        width: 0,
        height: 0
      };

      if (image.complete) {
        item.width = image.naturalWidth;
        item.height = image.naturalHeight;
        queue('sprite', item);
        return self;
      }

      queue('sprite', item, false);
      var reference = (self.paper.queue.length - 1),
        currentQueue = config.contexts[this.paper.index].queue[reference];

      image.addEventListener('load', function() {
        if (!currentQueue)
          return false;
        currentQueue.params.width = image.naturalWidth;
        currentQueue.params.height = image.naturalHeight;
        currentQueue.loaded = true;
      });

      image.addEventListener('error', function() {
        if (!currentQueue)
          return false;
        currentQueue.failed = true;
      });

      return this;
    };

    function TextShape(params) {
      var def = config.defaults.text,
        text = params.text,
        x = params.x,
        y = params.y,
        style = params.style;

      this.paper.ctx.beginPath();
      this.paper.ctx.setLineDash(style.borderStyle);
      this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
      this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
      this.paper.ctx.font = (style.font || def.font);
      this.paper.ctx.fillStyle = (style.color || def.color);
      this.paper.ctx.textAlign = (style.align || def.align);
      this.paper.ctx.fillText(text, x, y);
      this.paper.ctx.strokeText(text, x, y);
      this.paper.ctx.fill();
      this.paper.ctx.stroke();
      this.paper.ctx.setLineDash([]);
      this.paper.ctx.closePath();
    }

    Screen.prototype.text = TextShape;

    Origami.text = function(text, x, y, style) {
      style = normalizeStyle(style);

      var item = {
        text: text,
        x: x,
        y: y,
        style: style
      };

      if ((typeof(item.x) === 'string') && (typeof(item.y) === 'string'))
        item = smartCoordinates(item);

      queue('text', item);
      return this;
    };

    function ChartLine(config) {
      var ctx = this.paper.ctx,
        width = this.paper.width,
        height = this.paper.height;

      var line = getBorderStyleObject(config.line || "1px solid #000");
      var lineVariance = 2;

      var xPadding = 40;
      var yPadding = 40;
      var data = [];

      var gridLines = {
        vertical: true,
        horizontal: true
      };

      if (config.gridLines) {
        if (config.gridLines.vertical === false)
          gridLines.vertical = false;

        if (config.gridLines.horizontal === false)
          gridLines.horizontal = false;
      }

      for (var i = 0; i < config.labels.length; i++) {
        data.push({
          X: config.labels[i],
          Y: config.data[i]
        });
      }

      function getMaxY() {
        var max = 0;

        for (var i = 0; i < data.length; i++) {
          if (data[i].Y > max) {
            max = data[i].Y;
          }
        }

        max += 10 - max % 10;
        return max;
      }

      function getXPixel(val) {
        return ((width - xPadding) / data.length) * val + xPadding;
      }

      function getYPixel(val) {
        return height - (((height - yPadding) / getMaxY()) * val) - yPadding;
      }

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = '#999';
      ctx.font = 'normal 12px Helvetica';
      ctx.fillStyle = '#5e5e5e';
      ctx.textAlign = "center";

      ctx.beginPath();
      ctx.moveTo(xPadding, yPadding / lineVariance);
      ctx.lineTo(xPadding, height - yPadding);
      ctx.lineTo(width - (xPadding / lineVariance), height - yPadding);
      ctx.stroke();

      // Data
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (var i = 0; i < getMaxY(); i += 10) {
        if (gridLines.horizontal) {
          ctx.beginPath();
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = '#e7e7e7';
          ctx.moveTo(xPadding - 5, getYPixel(i));
          ctx.lineTo(width - (xPadding / lineVariance), getYPixel(i));
          ctx.stroke();
        }

        ctx.fillText(i, xPadding - 10, getYPixel(i));
      }

      // Labels
      ctx.textAlign = "left";
      for (var i = 0; i < data.length; i++) {
        if (gridLines.vertical) {
          ctx.beginPath();
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = '#e7e7e7';
          ctx.moveTo(getXPixel(i), height - yPadding + 10);
          ctx.lineTo(getXPixel(i), yPadding / lineVariance);
          ctx.stroke();
        }

        ctx.fillText(data[i].X, getXPixel(i), height - yPadding + 20);
      }

      ctx.beginPath();
      ctx.lineWidth = line.borderSize;
      ctx.setLineDash(line.borderStyle);
      ctx.strokeStyle = line.borderColor;
      ctx.moveTo(getXPixel(0), getYPixel(data[0].Y));

      for (var i = 1; i < data.length; i++) {
        ctx.lineTo(getXPixel(i), getYPixel(data[i].Y));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      if (config.points) {
        ctx.fillStyle = (config.pointsColor) ? config.pointsColor : 'rgb(75,75,75)';
        for (var i = 0; i < data.length; i++) {
          ctx.beginPath();
          ctx.arc(getXPixel(i), getYPixel(data[i].Y), 3, 0, Math.PI * 2, true);
          ctx.fill();
        }
      }
    }

    Screen.prototype.chartLine = ChartLine;

    Origami.chartLine = function(config) {
      queue('chartLine', config);
      return this;
    };
    // Resource.js

    Origami.background = function(color) {
      queue('background', {
        color: color
      });
      return this;
    };

    Origami.restore = function() {
      queue('restore');
      return this;
    };

    Origami.save = function() {
      queue('save');
      return this;
    };

    Origami.composition = function(globalComposite) {
      queue('composition', {
        globalComposite: globalComposite
      });
      return this;
    };

    Origami.translate = function(x, y) {
      if (x === undefined || x === null) {
        x = 'reset';
      }

      if (typeof(x) === 'string') {
        if (x === 'center') {
          x = context.width / 2;
          y = context.height / 2;
        }
        if (x === 'reset') {
          x = -context.width / 2;
          y = -context.height / 2;
        }
      }

      queue('translate', {
        x: x,
        y: y
      });
      return this;
    };

    Origami.rotate = function(degrees) {
      if (typeof(degrees) === 'undefined')
        degrees = 'slow';

      if (typeof(degrees) === 'string') {
        // Slow
        if (degrees === 'slow')
          degrees = ((2 * Math.PI) / 60) * new Date().getSeconds() +
          ((2 * Math.PI) / 60000) * new Date().getMilliseconds();

        // Normal
        else if (degrees === 'normal')
          degrees = ((2 * Math.PI) / 30) * new Date().getSeconds() +
          ((2 * Math.PI) / 30000) * new Date().getMilliseconds();

        // Fast
        else if (degrees === 'fast')
          degrees = ((2 * Math.PI) / 6) * new Date().getSeconds() +
          ((2 * Math.PI) / 6000) * new Date().getMilliseconds();
      }

      queue('rotate', {
        degrees: degrees
      });
      return this;
    };

    Origami.stopRender = function() {
      window.cancelAnimationFrame(this.paper.frame);
      this.paper.frame = false;
    };

    Origami.play = function() {
      this.paper.frame = 1;
      return this;
    };

    Origami.startRender = function(fn) {
      var self = this;
      if (self.paper.frame === false)
        return;

      self.draw(function() {
        self.paper.frame = window.requestAnimationFrame(fn.bind(this));
      });
    };

    Origami.scale = function(width, height) {
      queue('scale', {
        width: width,
        height: height
      });
      return this;
    };

    Origami.flip = function(type) {
      queue('flip', {
        type: type
      });
      return this;
    };

    Origami.flipEnd = function() {
      queue('flipEnd');
      return this;
    };

    Origami.clear = function() {
      queue('clear');
      return this;
    };

    Origami.on = function(ev, fn) {
      this.paper.element.addEventListener(ev, fn);
      return this;
    };

    var factory = extend(Origami.init.bind(this), Origami);

    // For consistency with CommonJS environments' exports
    if (  module && module.exports ){
        module.exports = factory;
    }

    // For CommonJS with exports, but without module.exports, like Rhino
    else if (  exports ) {
        exports.origami = factory;
    }

    // For browser, export only select globals
    else if ( typeof window === "object" ) {
        window.origami = extend(Origami.init.bind(Origami), Origami);
    }

    // Get a reference to the global object
    }( (function() {
        return this;
    })() ));
    });
    var origami_2 = origami_1.origami;

    var drawRoundLayers = (functionContext) => {
        let { data, options, ctx, h, w, Helper, canvasId } = functionContext;
        let helper = new Helper(ctx);

        let origamiContext = {};
        let origami = origami_1.bind(origamiContext);

        origami(ctx)
            .rect(10, 10, 40, 40)
            .draw();


    };

    //options:type,colors,stroke
    function visualize(data, canvasId, options = {}, frame) {
        //make a clone of options
        options = { ...options };
        //options
        if (!options.stroke) options.stroke = 1;
        if (!options.colors) options.colors = ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"];


        let canvas = document.getElementById(canvasId);

        if (!canvas) return;

        let ctx = canvas.getContext("2d");
        let h = canvas.height;
        let w = canvas.width;



        ctx.strokeStyle = options.colors[0];
        ctx.lineWidth = options.stroke;

        let typeMap = {
            "bars": drawBars,
            "bars blocks": drawBarsBlocks,
            "big bars": drawBigBars,
            "cubes": drawCubes,
            "dualbars": drawDualbars,
            "dualbars blocks": drawDualbarsBlocks,
            "fireworks": drawFireworks,
            "flower": drawFlower,
            "flower blocks": drawFlowerBlocks,
            "orbs": drawOrbs,
            "ring": drawRing,
            "rings": drawRings,
            "round layers": drawRoundLayers,
            "round wave": drawRoundWave,
            "shine": drawShine,
            "shine rings": drawShineRings,
            "shockwave": drawShockwave,
            "star": drawStar,
            "static": drawStatic,
            "stitches": drawStitches,
            "wave": drawWave,
            "web": drawWeb
        };

        let frameRateMap = {
            "bars": 1,
            "bars blocks": 1,
            "big bars": 1,
            "cubes": 1,
            "dualbars": 1,
            "dualbars blocks": 1,
            "fireworks": 1,
            "flower": 1,
            "flower blocks": 1,
            "ring": 1,
            "rings": 1,
            "round layers": 1,
            "round wave": 1,
            "orbs": 1,
            "shine": 1,
            "shine rings": 1,
            "shockwave": 1,
            "star": 1,
            "static": 1,
            "stitches": 1,
            "wave": 1,
            "web": 1
        };

        const functionContext = {
            data, options, ctx, h, w, Helper: this.Helper, canvasId
        };

        if (typeof options.type == "string") options.type = [options.type];

        options.type.forEach(type => {
            //abide by the frame rate
            if (frame % frameRateMap[type] === 0) {
                //clear canvas
                ctx.clearRect(0, 0, w, h);
                ctx.beginPath();

                typeMap[type](functionContext);
            }
        });

    }

    function Helper(ctx) {
        this.ctx = ctx;
        this.mainColor = "black";
    }

    Helper.prototype = {
        __toRadians__(degree) {
            return (degree * Math.PI) / 180;
        },
        __rotatePoint__([pointX, pointY], [originX, originY], degree) {
            //clockwise
            let angle = this.__toRadians__(degree);
            let rotatedX = Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX;
            let rotatedY = Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY;

            return [rotatedX, rotatedY]
        },
        mutateData(data, type, extra = null) {
            if (type === "mirror") {
                let rtn = [];

                for (let i = 0; i < data.length; i += 2) {
                    rtn.push(data[i]);
                }

                rtn = [...rtn, ...rtn.reverse()];
                return rtn
            }

            if (type === "shrink") {
                //resize array by % of current array 
                if (extra < 1) {
                    extra = data.length * extra;
                }

                let rtn = [];
                let splitAt = Math.floor(data.length / extra);

                for (let i = 1; i <= extra; i++) {
                    let arraySection = data.slice(i * splitAt, (i * splitAt) + splitAt);
                    let middle = arraySection[Math.floor(arraySection.length / 2)];
                    rtn.push(middle);
                }

                return rtn
            }

            if (type === "split") {
                let size = Math.floor(data.length / extra);
                let rtn = [];
                let temp = [];

                let track = 0;
                for (let i = 0; i <= size * extra; i++) {
                    if (track === size) {
                        rtn.push(temp);
                        temp = [];
                        track = 0;
                    }

                    temp.push(data[i]);
                    track++;
                }

                return rtn
            }

            if (type === "scale") {
                let scalePercent = extra / 255;
                if (extra <= 3 && extra >= 0) scalePercent = extra;
                let rtn = data.map(value => value * scalePercent);
                return rtn
            }

            if (type === "organize") {
                let rtn = {};
                rtn.base = data.slice(60, 120);
                rtn.vocals = data.slice(120, 255);
                rtn.mids = data.slice(255, 2000);
                return rtn
            }

            if (type === "reverb") {
                let rtn = [];
                data.forEach((val, i) => {
                    rtn.push(val - (data[i + 1] || 0));
                });
                return rtn
            }

            if (type === "amp") {
                let rtn = [];
                data.forEach(val => {
                    rtn.push(val * (extra + 1));
                });
                return rtn
            }

            if (type === "min") {
                let rtn = [];
                data.forEach(value => {
                    if (value < extra) value = extra;
                    rtn.push(value);
                });
                return rtn
            }
        },
        getPoints(shape, size, [originX, originY], pointCount, endPoints, options = {}) {
            let { offset = 0, rotate = 0, customOrigin = [] } = options;
            let rtn = {
                start: [],
                end: []
            };

            if (shape === "circle") {

                let degreePerPoint = 360 / pointCount;
                let radianPerPoint = this.__toRadians__(degreePerPoint);
                let radius = size / 2;

                for (let i = 1; i <= pointCount; i++) {
                    let currentRadian = radianPerPoint * i;
                    let currentEndPoint = endPoints[i - 1];
                    let pointOffset = endPoints[i - 1] * (offset / 100);

                    let x = originX + (radius - pointOffset) * Math.cos(currentRadian);
                    let y = originY + (radius - pointOffset) * Math.sin(currentRadian);
                    let point1 = this.__rotatePoint__([x, y], [originX, originY], rotate);

                    rtn.start.push(point1);

                    x = originX + ((radius - pointOffset) + currentEndPoint) * Math.cos(currentRadian);
                    y = originY + ((radius - pointOffset) + currentEndPoint) * Math.sin(currentRadian);
                    let point2 = this.__rotatePoint__([x, y], [originX, originY], rotate);

                    rtn.end.push(point2);

                }

                return rtn
            }

            if (shape === "line") {
                let increment = size / pointCount;

                originX = customOrigin[0] || originX;
                originY = customOrigin[1] || originY;

                for (let i = 0; i <= pointCount; i++) {
                    let degree = rotate;
                    let pointOffset = endPoints[i] * (offset / 100);

                    let startingPoint = this.__rotatePoint__([originX + (i * increment), originY - pointOffset],
                        [originX, originY], degree);
                    rtn.start.push(startingPoint);

                    let endingPoint = this.__rotatePoint__([originX + (i * increment), (originY + endPoints[i]) - pointOffset],
                        [originX, originY], degree);
                    rtn.end.push(endingPoint);
                }

                return rtn

            }

        },
        drawCircle([x, y], diameter, options = {}) {
            let { color, lineColor = this.ctx.strokeStyle } = options;

            this.ctx.beginPath();
            this.ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();
            this.ctx.fillStyle = color;
            if (color) this.ctx.fill();
        },
        drawOval([x, y], height, width, options = {}) {
            let { rotation = 0, color, lineColor = this.ctx.strokeStyle } = options;
            if (rotation) rotation = this.__toRadians__(rotation);

            this.ctx.beginPath();
            this.ctx.ellipse(x, y, width, height, rotation, 0, 2 * Math.PI);
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();
            this.ctx.fillStyle = color;
            if (color) this.ctx.fill();
        },
        drawSquare([x, y], diameter, options = {}) {
            this.drawRectangle([x, y], diameter, diameter, options);
        },
        drawRectangle([x, y], height, width, options = {}) {
            let { color, lineColor = this.ctx.strokeStyle, radius = 0, rotate = 0 } = options;

            // if (width < 2 * radius) radius = width / 2;
            // if (height < 2 * radius) radius = height / 2;

            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            let p1 = this.__rotatePoint__([x + width, y], [x, y], rotate);
            let p2 = this.__rotatePoint__([x + width, y + height], [x, y], rotate);
            this.ctx.arcTo(p1[0], p1[1], p2[0], p2[1], radius);

            let p3 = this.__rotatePoint__([x + width, y + height], [x, y], rotate);
            let p4 = this.__rotatePoint__([x, y + height], [x, y], rotate);
            this.ctx.arcTo(p3[0], p3[1], p4[0], p4[1], radius);

            let p5 = this.__rotatePoint__([x, y + height], [x, y], rotate);
            let p6 = this.__rotatePoint__([x, y], [x, y], rotate);
            this.ctx.arcTo(p5[0], p5[1], p6[0], p6[1], radius);

            let p7 = this.__rotatePoint__([x, y], [x, y], rotate);
            let p8 = this.__rotatePoint__([x + width, y], [x, y], rotate);
            this.ctx.arcTo(p7[0], p7[1], p8[0], p8[1], radius);
            this.ctx.closePath();

            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();
            this.ctx.fillStyle = color;
            if (color) this.ctx.fill();

        },
        drawLine([fromX, fromY], [toX, toY], options = {}) {
            let { lineColor = this.ctx.strokeStyle } = options;

            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);
            this.ctx.lineTo(toX, toY);
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();
        },
        drawPolygon(points, options = {}) {
            let { color, lineColor = this.ctx.strokeStyle, radius = 0, close = false } = options;

            function getRoundedPoint(x1, y1, x2, y2, radius, first) {
                let total = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                let idx = first ? radius / total : (total - radius) / total;

                return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
            }

            function getRoundedPoints(pts, radius) {
                let len = pts.length;
                let res = new Array(len);

                for (let i2 = 0; i2 < len; i2++) {
                    let i1 = i2 - 1;
                    let i3 = i2 + 1;

                    if (i1 < 0) i1 = len - 1;
                    if (i3 == len) i3 = 0;

                    let p1 = pts[i1];
                    let p2 = pts[i2];
                    let p3 = pts[i3];

                    let prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
                    let nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
                    res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
                }
                return res;
            }
            if (radius > 0) {
                points = getRoundedPoints(points, radius);
            }

            let i, pt, len = points.length;
            for (i = 0; i < len; i++) {
                pt = points[i];
                if (i == 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(pt[0], pt[1]);
                } else {
                    this.ctx.lineTo(pt[0], pt[1]);
                }
                if (radius > 0) {
                    this.ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
                }
            }

            if (close) this.ctx.closePath();
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();

            this.ctx.fillStyle = color;
            if (color) this.ctx.fill();
        }

    };

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
        Helper
    };

    return Wave;

}());
