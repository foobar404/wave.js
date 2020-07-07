export default (functionContext) => {
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
}
