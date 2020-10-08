export default (functionContext) => {
  let { data, options, ctx, h, w } = functionContext;

  let percent = h / 255;
  let width = w / 50;
  let skip = true;
  for (let point = 0; point <= 50; point++) {
    let p = data[point]; //get value
    p *= percent;
    let x = width * point;

    if (skip) {
      ctx.rect(x, h / 2 + p / 2, width, -p);
      skip = false;
    } else {
      skip = true;
    }
  }

  if (options.colors[1]) {
    ctx.fillStyle = options.colors[1];
    ctx.fill();
  }

  ctx.stroke();
};
