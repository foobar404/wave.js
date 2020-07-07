export default (functionContext) => {
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
}
