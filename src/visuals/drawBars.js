export default (functionContext) => {
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
}
