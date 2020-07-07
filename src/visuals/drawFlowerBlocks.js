export default (functionContext) => {
    let { data, options, ctx, h, w } = functionContext;

    let min = 5;
    let r = h / 4;
    let offset = r / 2;
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
}
