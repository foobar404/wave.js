export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options

    let helper = new Helper(ctx)
    let minDimension = (h < w) ? h : w

    data = helper.mutateData(data, "organize")
    data.vocals = helper.mutateData(data.vocals, "scale", (minDimension / 2) / 2)
    data.base = helper.mutateData(data.base, "scale", (minDimension / 2) / 2)

    let outerBars = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals);
    let innerWave = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals, { offset: 100 });
    let thinLine = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.base.length, data.base, { offset: 100 });

    outerBars.start.forEach((start, i) => {
        helper.drawLine(start, outerBars.end[i], { lineColor: colors[0] })
    })

    helper.drawPolygon(innerWave.start, { close: true, lineColor: colors[1], color: colors[3], radius: 5 })
    helper.drawPolygon(thinLine.start, { close: true, lineColor: colors[2], color: colors[4], radius: 5 })
}
