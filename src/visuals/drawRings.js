export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options
    let helper = new Helper(ctx)
    let minDimension = (h < w) ? h : w

    data = helper.mutateData(data, "organize")
    data = [data.mids, data.vocals]

    data[0] = helper.mutateData(data[0], "scale", minDimension / 4)
    data[1] = helper.mutateData(data[1], "scale", minDimension / 8)

    data[0] = helper.mutateData(data[0], "shrink", 1 / 5)
    data[0] = helper.mutateData(data[0], "split", 2)[0]

    data[0] = helper.mutateData(data[0], "reverb")
    data[1] = helper.mutateData(data[1], "reverb")


    let outerCircle = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data[0].length, data[0])
    let innerCircle = helper.getPoints("circle", minDimension / 4, [w / 2, h / 2], data[1].length, data[1])

    helper.drawPolygon(outerCircle.end, { close: true, radius: 4, lineColor: colors[0], color: colors[1] })
    helper.drawPolygon(innerCircle.end, { close: true, radius: 4, lineColor: colors[2], color: colors[3] })

    let middle = ((minDimension / 4) + (minDimension / 2)) / 2
    let largerInner = data[1] = helper.mutateData(data[1], "scale", ((minDimension / 4) - (minDimension / 2)))
    let innerBars = helper.getPoints("circle", middle, [w / 2, h / 2], data[1].length, largerInner)
    innerBars.start.forEach((start, i) => {
        helper.drawLine(start, innerBars.end[i], { lineColor: colors[4] || colors[2] })
    })
}
