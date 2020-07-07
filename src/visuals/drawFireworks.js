export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options
    const helper = new Helper(ctx)

    data = helper.mutateData(data, "shrink", 200).slice(0, 120)
    data = helper.mutateData(data, "mirror")
    data = helper.mutateData(data, "scale", (h / 4) + ((h / 4) * .35))

    let points = helper.getPoints("circle", h / 2, [w / 2, h / 2], data.length, data, { offset: 35, rotate: 270 })

    points.start.forEach((start, i) => {
        helper.drawLine(start, points.end[i])
    })

    helper.drawPolygon(points.start, { close: true })

    points.end.forEach((end, i) => {
        helper.drawCircle(end, h * .01, { color: colors[0] })
    })
}
