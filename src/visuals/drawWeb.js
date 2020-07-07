export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options
    const helper = new Helper(ctx)
    let minDimension = (h < w) ? h : w

    data = helper.mutateData(data, "shrink", 100)
    data = helper.mutateData(data, "split", 2)[0]
    data = helper.mutateData(data, "scale", h / 4)

    let dataCopy = data

    let points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data)
    helper.drawPolygon(points.end, { close: true })

    points.start.forEach((start, i) => {
        helper.drawLine(start, points.end[i])
    })

    data = helper.mutateData(data, "scale", .7)
    points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data)
    helper.drawPolygon(points.end, { close: true })

    data = helper.mutateData(data, "scale", .3)
    points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data)
    helper.drawPolygon(points.end, { close: true })

    helper.drawCircle([w / 2, h / 2], minDimension / 2, { color: colors[2] })

    dataCopy = helper.mutateData(dataCopy, "scale", 1.4)
    points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], dataCopy.length, dataCopy)
    points.end.forEach((end, i) => {
        helper.drawCircle(end, minDimension * .01, { color: colors[1], lineColor: colors[1] || colors[0] })
    })
}
