export default (functionContext) => {
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
}
