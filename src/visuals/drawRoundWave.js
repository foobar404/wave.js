export default (functionContext) => {
    let { data, options, ctx, h, w } = functionContext;

    let r = h / 4;
    let cx = w / 2;
    let cy = h / 2;
    let point_count = 100;
    let percent = r / 255;
    let increase = (360 / point_count) * Math.PI / 180;
    let min = 0;
    let offset = 0;
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
}
