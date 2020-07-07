export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options
    let helper = new Helper(ctx)

    data = helper.mutateData(data, "shrink", 1 / 8)
    data = helper.mutateData(data, "split", 2)[0]
    data = helper.mutateData(data, "scale", h)

    let points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 })

    let index = 0
    let prevPoint = null
    points.start.forEach((start, i) => {
        if (prevPoint) {
            helper.drawLine(prevPoint, start)
        }
        helper.drawLine(start, points.end[i])
        prevPoint = points.end[i]

        index++
    })


}
