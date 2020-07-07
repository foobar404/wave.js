export default (functionContext) => {
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


    ctx.moveTo(top[0].x, top[0].y)
    for (let t in top) {
        t = top[t];

        ctx.lineTo(t.x, t.y);
    }
    ctx.closePath();

    ctx.moveTo(bottom[0].x, bottom[0].y)
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
    ctx.moveTo(bottom[0].x, bottom[0].y)
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
}
