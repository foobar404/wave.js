class Wave {
    current_stream = {};
    sources = {};
    onFileLoad;

    constructor() {}

    findSize(size) {

        for (var range = 1; range <= 40; range++) {
            var power = 2 ** range;

            if (size <= power) return power;
        }

    }

    //colors,stroke,wave,skirt,sun,ring,bars,dualbars,matrix,flower,vortex,flower_blocks,bars_blocks,star,wings,round_wave,dualbars_blocks
    //shine,orbs
    visualize(data, canvas, options = {}) {
        //options
        if (!options.stroke) options.stroke = 2;
        if (!options.colors) options.colors = ["rgb(255, 53, 94)"];

        var c;
        if (typeof canvas == "string") {
            c = document.getElementById(canvas);
        } else {
            c = canvas;
        }

        var ctx = c.getContext("2d");

        var h = c.height;
        var w = c.width;


        //clear canvas
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();

        ctx.strokeStyle = options.colors[0];
        ctx.lineWidth = options.stroke;

        if (options.wave) {
            var point_count = 120;
            var increase = w / point_count;
            var percent = h / 255;

            ctx.moveTo(0, h - data[0] * percent);

            for (var point = 1; point <= point_count; point++) {
                p = data[point]; //get value
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


        }

        if (options.shine) {
            var cx = w / 2;
            var cy = h / 2;
            var r = h / 4;
            var percent = (h / 2 - r) / 255;
            var point_count = 512;
            var increase = (360 / point_count) * Math.PI / 180;

            for (var point = 1; point <= point_count; point++) {
                p = data[600 % point]; //get value
                p *= percent;
                point++; //start at 1
                var a = point * increase;

                var sx = cx + r * Math.cos(a);
                var sy = cy + r * Math.sin(a);
                ctx.moveTo(sx, sy);

                var dx = cx + (r + p) * Math.cos(a);
                var dy = cy + (r + p) * Math.sin(a);
                ctx.lineTo(dx, dy);

            }
            ctx.stroke();

            if (options.colors[1]) {
                ctx.arc(cx, cy, r * .90, 0, 2 * Math.PI);
                ctx.fillStyle = options.colors[1];
                ctx.fill();
            }

        }

        if (options.ring) {
            var cx = w / 2;
            var cy = h / 2;
            var r = (h - 10) / 2;
            var offset = r / 5;
            var percent = (r - offset) / 255;
            var point_count = 150;
            var increase = (360 / point_count) * Math.PI / 180;


            ctx.arc(cx, cy, r, 0, 2 * Math.PI, true);

            var fa = 0;
            var fx = cx + (r - (data[0] * percent)) * Math.cos(fa);
            var fy = cy + (r - (data[0] * percent)) * Math.sin(fa);
            ctx.moveTo(fx, fy);

            var q = 0;
            for (var point = 0; point < point_count; point++) {
                q += 1
                if (point >= point_count / 2) {
                    q -= 2;
                }

                var p = data[q]; //get value
                p *= percent;

                var a = point * increase;
                var x = cx + (r - p) * Math.cos(a);
                var y = cy + (r - p) * Math.sin(a);

                ctx.lineTo(x, y);
                ctx.arc(x, y, 2, 0, 2 * Math.PI);

            }
            ctx.lineTo(fx, fy);

            ctx.stroke();
            ctx.fillStyle = options.colors[1] || "#fff0";
            ctx.fill()

        }

        if (options.bars) {
            var point_count = 64;
            var percent = h / 255;
            var increase = w / 64;
            var breakpoint = Math.floor(point_count / options.colors.length);

            for (var point = 1; point <= point_count; point++) {
                p = data[point]; //get value
                p *= percent;

                var x = increase * point;

                ctx.moveTo(x, h);
                ctx.lineTo(x, h - p);

                if (point % breakpoint == 0) {
                    var i = (point / breakpoint) - 1;
                    ctx.strokeStyle = options.colors[i];
                    ctx.stroke();
                    ctx.beginPath();
                }

            }



        }

        if (options.dualbars) {
            var percent = h / 255;
            var increase = w / 128;
            var point_count = 128;
            var min = 5;
            var breakpoint = Math.floor(point_count / options.colors.length);

            for (var point = 1; point <= point_count; point++) {
                p = data[point]; //get value
                p += min;
                p *= percent;

                var x = increase * point;

                var mid = (h / 2) + (p / 2);

                ctx.moveTo(x, mid);
                ctx.lineTo(x, mid - p);

                if (point % breakpoint == 0) {
                    var i = (point / breakpoint) - 1;
                    ctx.strokeStyle = options.colors[i];
                    ctx.stroke();
                    ctx.beginPath();
                }

            }

        }

        if (options.orbs) {
            var percent = (h - 25) / 255;
            var point_count = 128;
            var increase = w / point_count;
            var min = 5;

            for (var point = 1; point <= point_count; point++) {
                p = data[point]; //get value
                p += min;
                p *= percent;

                var x = increase * point;
                var mid = (h / 2) + (p / 2);

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
        }

        if (options.matrix) {
            var waveSize = 8;
            var percent = (h / 2) / 255;
            var increase = w / waveSize;

            ctx.lineJoin = 'round';

            for (var color in options.colors) {
                c = options.colors[color];

                ctx.moveTo(0, (h / 2));

                for (var point = 1; point <= waveSize; point++) {
                    var p = data[point + (color * waveSize)] * percent;
                    var x = point * increase;


                    var ll = point + (color * waveSize);
                    console.log(ll);


                    ctx.lineTo(x, p); //x/2,(h/2),


                }

                ctx.stroke();

            }

        }

        if (options.flower) {
            var min = 5;
            var r = h / 4;
            var offset = r / 2;
            var cx = w / 2;
            var cy = h / 2;
            var point_count = 128;
            var percent = (r - offset) / 255;
            var increase = (360 / point_count) * Math.PI / 180;
            var breakpoint = Math.floor(point_count / options.colors.length);

            for (var point = 1; point <= point_count; point++) {
                var p = (data[point] + min) * percent;
                var a = point * increase;

                var sx = cx + (r - (p - offset)) * Math.cos(a);
                var sy = cy + (r - (p - offset)) * Math.sin(a);
                ctx.moveTo(sx, sy);

                var dx = cx + (r + p) * Math.cos(a);
                var dy = cy + (r + p) * Math.sin(a);
                ctx.lineTo(dx, dy);

                if (point % breakpoint == 0) {
                    var i = (point / breakpoint) - 1;
                    ctx.strokeStyle = options.colors[i];
                    ctx.stroke();
                    ctx.beginPath();
                }
            }

            ctx.stroke();
        }

//        if (options.vortex) {
//            var r = h / 4;
//            var cx = w / 2;
//            var cy = h / 2;
//            var percent = r / 255;
//            var point_count = 20;
//            var increase = (360 / point_count) * Math.PI / 180;
//
//            for (var point = 1; point <= point_count; point++) {
//                var p = (data[point]) * percent;
//                var a = point * increase;
//
//                var sx = cx + (r) * Math.cos(a);
//                var sy = cy + (r) * Math.sin(a);
//                ctx.lineTo(sx, sy);
//
//                var dx = cx + (r + p) * Math.cos(a + (increase * (p / 100)));
//                var dy = cy + (r + p) * Math.sin(a + (increase * (p / 100)));
//                ctx.lineTo(dx, dy);
//
//            }
//            ctx.closePath();
//
//
//            if (options.colors[1]) {
//                ctx.fillStyle = options.colors[1];
//                ctx.fill();
//            }
//            ctx.stroke();
//        }

        if (options.flower_blocks) {
            var min = 5;
            var r = h / 4;
            var offset = r / 2;
            var cx = w / 2;
            var cy = h / 2;
            var point_count = 56;
            var percent = r / 255;
            var increase = (360 / point_count) * Math.PI / 180;

            for (var point = 1; point <= point_count; point++) {
                var p = (data[point]) * percent;
                var a = point * increase;

                var ax = cx + (r - (p / 2)) * Math.cos(a);
                var ay = cy + (r - (p / 2)) * Math.sin(a);
                ctx.moveTo(ax, ay);

                var bx = cx + (r + p) * Math.cos(a);
                var by = cy + (r + p) * Math.sin(a);
                ctx.lineTo(bx, by);

                var dx = cx + (r + p) * Math.cos(a + increase);
                var dy = cy + (r + p) * Math.sin(a + increase);
                ctx.lineTo(dx, dy);

                var ex = cx + (r - (p / 2)) * Math.cos(a + increase);
                var ey = cy + (r - (p / 2)) * Math.sin(a + increase);

                ctx.lineTo(ex, ey);
                ctx.lineTo(ax, ay);
            }

            if (options.colors[1]) {
                ctx.fillStyle = options.colors[1];
                ctx.fill();
            }

            ctx.stroke();
        }

        if (options.bars_blocks) {
            var percent = h / 255;

            var width = w / 64;

            for (var point = 0; point < 64; point++) {
                p = data[point]; //get value
                p *= percent;

                var x = width * point;

                ctx.rect(x, h, width, -(p));

            }

            ctx.fillStyle = options.colors[1] || options.colors[0];
            ctx.stroke();
            ctx.fill();
        }

        if (options.dualbars_blocks) {
            var percent = h / 255;
            var width = w / 50;

            for (var point = 0; point <= 50; point++) {
                p = data[point]; //get value
                p *= percent;

                var x = width * point;

                ctx.rect(x, (h / 2) + (p / 2), width, -(p));

            }

            if (options.colors[1]) {
                ctx.fillStyle = options.colors[1];
                ctx.fill();
            }

            ctx.stroke();

        }

        if (options.star) {
            var r = h / 4;
            var offset = r / 4;
            var cx = w / 2;
            var cy = h / 2;
            var point_count = 120;
            var percent = (r - offset - 35) / (255);
            var increase = (360 / point_count) * Math.PI / 180;

            var top = [];
            var bottom = [];

            for (var point = 1; point <= point_count; point++) {
                var p = ((data[200 % point])) * percent;
                var a = point * increase;

                var sx = cx + ((r) - p + offset) * Math.cos(a);
                var sy = cy + ((r) - p + offset) * Math.sin(a);
                ctx.moveTo(sx, sy);
                bottom.push({
                    x: sx,
                    y: sy
                });

                var dx = cx + (r + p + offset) * Math.cos(a);
                var dy = cy + (r + p + offset) * Math.sin(a);
                ctx.lineTo(dx, dy);
                top.push({
                    x: dx,
                    y: dy
                });

            }


            ctx.moveTo(top[0].x, top[0].y)
            for (var t in top) {
                t = top[t];

                ctx.lineTo(t.x, t.y);
            }
            ctx.closePath();

            ctx.moveTo(bottom[0].x, bottom[0].y)
            for (var b = bottom.length - 1; b >= 0; b++) {
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
            ctx.moveTo(bottom[0].x, bottom[0].y)
            for (var b in bottom) {
                b = bottom[b];

                ctx.lineTo(b.x, b.y);
            }
            ctx.closePath();


            if (options.colors[2]) {
                ctx.fillStyle = options.colors[2];
                ctx.fill();
            }
            ctx.stroke();
        }

        if (options.wings) {
            var r = h / 4;
            var cx = w / 2;
            var cy = h / 2;
            var width = (w / 2) - r;

            ctx.arc(cx, cy, r, 0, 2 * Math.PI);

            ctx.lineCap = "round";
            ctx.fillStyle = options.colors[1] || options.colors[0];
            ctx.fill();

            for (var wing = 1; wing <= 16; wing++) {

            }


            ctx.lineWidth = 10;
            if (options.stroke) ctx.lineWidth = options.stroke;

            ctx.stroke();
        }

        if (options.round_wave) {
            var r = h / 4;
            var cx = w / 2;
            var cy = h / 2;
            var point_count = 100;
            var percent = r / 255;
            var increase = (360 / point_count) * Math.PI / 180;

            var z = (data[0] + min + offset) * percent;
            var sx = cx + (r + p) * Math.cos(0);
            var sy = cy + (r + p) * Math.sin(0);
            ctx.moveTo(sx, sy);

            for (var point = 1; point <= point_count; point++) {
                var p = (data[350 % point]) * percent;
                var a = point * increase;

                var dx = cx + (r + p) * Math.cos(a);
                var dy = cy + (r + p) * Math.sin(a);
                ctx.lineTo(dx, dy);
            }

            ctx.closePath();
            ctx.stroke();

            if (options.colors[1]) {
                ctx.fillStyle = options.colors[1];
                ctx.fill();
            }
        }
    }

    fromFile(file, options = {}) {
        //options
        if (!options.stroke) options.stroke = 10;

        var audio = new Audio();
        audio.src = file;

        var audioCtx = new AudioContext();
        var analyser = audioCtx.createAnalyser();

        var source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);

        analyser.fftSize = 64;
        var bufferLength = analyser.frequencyBinCount;

        var file_data;
        var temp_data = new Uint8Array(bufferLength);
        var getWave;
        var fdi = 0;
        var self = this;

        audio.addEventListener('loadedmetadata', async function () {

            while (audio.duration === Infinity) {
                await new Promise(r => setTimeout(r, 1000));
                audio.currentTime = 10000000 * Math.random();
            }

            audio.currentTime = 0;
            audio.play();
        })

        audio.onplay = function () {
            var d = audio.duration;
            audio.playbackRate = 16;

            d = d / audio.playbackRate;

            var drawRate = 20; //ms

            var size = ((d / (drawRate / 1000)) * (analyser.fftSize / 2));
            size = self.findSize(size);
            file_data = new Uint8Array(size);


            getWave = setInterval(function () {
                analyser.getByteFrequencyData(temp_data);

                for (var data in temp_data) {
                    data = temp_data[data];
                    file_data[fdi] = data;
                    fdi++;
                }

            }, drawRate);


        }

        audio.onended = function () {

            if (audio.currentTime == audio.duration && file_data != undefined) {

                clearInterval(getWave);

                var canvas = document.createElement("canvas");
                canvas.height = window.innerHeight;
                canvas.width = window.innerWidth;

                self.visualize(file_data, canvas, options);

                //var p = document.getElementById(canvas_id);
                var image = canvas.toDataURL("image/jpg");
                self.onFileLoad(image);

                canvas.remove();
            }

        }

    }

    fromStream(stream, canvas_id, options = {}, muted = true) {

        this.current_stream.id = canvas_id;
        this.current_stream.options = options;

        var audioCtx, analyser, source;
        if (!this.sources[stream.toString()]) {
            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();

            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            source.connect(audioCtx.destination); //playback audio

            this.sources[e.toString()] = {
                "audioCtx": audioCtx,
                "analyser": analyser,
                "source": source
            }
        } else {
            cancelAnimationFrame(this.sources[stream.toString()].animation);
            audioCtx = this.sources[stream.toString()].audioCtx;
            analyser = this.sources[stream.toString()].analyser;
            source = this.sources[stream.toString()].source;
        }

        if (!muted) source.connect(audioCtx.destination); //playback audio

        analyser.fftSize = 512;
        if (options.ring || options.round_wave || options.flower_blocks || options.bars || options.bars_blocks) analyser.fftSize = 1024;
        if (options.wave || options.dualbars || options.orbs || options.flower) analyser.fftSize = 2048;
        if (options.star || options.shine) analyser.fftSize = 4096;


        var bufferLength = analyser.frequencyBinCount;
        this.current_stream.data = new Uint8Array(bufferLength);

        var frame_count = 1;
        var c = 1;
        var self = this;

        function renderFrame() {
            self.current_stream.animation = requestAnimationFrame(self.current_stream.loop);
            self.sources[stream.toString()]["animation"] = self.current_stream.animation;
            analyser.getByteFrequencyData(self.current_stream.data);


            c++;
            if (c % frame_count == 0) { //every * frame
                self.visualize(self.current_stream.data, self.current_stream.id, self.current_stream.options);
            }

        }

        this.current_stream.loop = renderFrame;
        renderFrame();

    }

    stopStream() {
        cancelAnimationFrame(this.current_stream.animation);
    }

    playStream() {
        this.current_stream.loop();
    }

    fromElement(e, canvas_id, options) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }


        var audioCtx, analyser, source;
        if (!this.sources[e.toString()]) {
            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();

            source = audioCtx.createMediaElementSource(e);
            source.connect(analyser);
            source.connect(audioCtx.destination); //playback audio

            this.sources[e.toString()] = {
                "audioCtx": audioCtx,
                "analyser": analyser,
                "source": source
            }
        } else {
            cancelAnimationFrame(this.sources[e.toString()].animation);
            audioCtx = this.sources[e.toString()].audioCtx;
            analyser = this.sources[e.toString()].analyser;
            source = this.sources[e.toString()].source;
        }


        analyser.fftSize = 512;
        if (options.ring || options.round_wave || options.flower_blocks || options.bars || options.bars_blocks) analyser.fftSize = 1024;
        if (options.wave || options.dualbars || options.orbs || options.flower) analyser.fftSize = 2048;
        if (options.star || options.shine) analyser.fftSize = 4096;

        var bufferLength = analyser.frequencyBinCount;
        var data = new Uint8Array(bufferLength);
        var frame_count = 1;
        var c = 1;

        var animation;
        var self = this;


        function renderFrame() {
            animation = requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(data);
            self.sources[e.toString()]["animation"] = animation;

            c++;
            if (c % frame_count == 0) { //every * frame
                self.visualize(data, canvas_id, options);
            }
        }

        e.onplay = function () {
            audioCtx.resume();
            renderFrame();
        }

        e.onended = function () {
            cancelAnimationFrame(animation);
        }
    }
}
window.Wave = Wave;

