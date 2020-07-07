export default (functionContext) => {
    let { data, options, ctx, h, w } = functionContext;

    let percent = h / 255;
    let width = w / 64;

    for (let point = 0; point < 64; point++) {
        let p = data[point]; //get value
        p *= percent;
        let x = width * point;

        ctx.rect(x, h, width, -(p));
    }

    ctx.fillStyle = options.colors[1] || options.colors[0];
    ctx.stroke();
    ctx.fill();
}
