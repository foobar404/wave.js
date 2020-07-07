export default (functionContext) => {
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
}
