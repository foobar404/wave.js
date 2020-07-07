export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options
    let helper = new Helper(ctx)
    let minDimension = (h < w) ? h : w

    data = helper.mutateData(data, "shrink", 200)
    data = helper.mutateData(data, "split", 2)[0]
    data = helper.mutateData(data, "scale", h / 2)

    let points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data, { offset: 50 })

    helper.drawPolygon(points.end, { close: true })
    helper.drawPolygon(points.start, { close: true })

    for (let i = 0; i < points.start.length; i += 1) {
        let start = points.start[i]
        i++
        let end = points.end[i] || points.end[0]

        helper.drawLine(start, end)
        helper.drawLine(end, points.start[i + 1] || points.start[0])
    }
}
