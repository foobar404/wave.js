export default (functionContext) => {
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
        q += 1
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
    ctx.fill()
}
