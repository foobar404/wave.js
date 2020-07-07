export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options
    const helper = new Helper(ctx)

    data = helper.mutateData(data, "organize").vocals
    data = helper.mutateData(data, "shrink", 10)
    data = helper.mutateData(data, "scale", h)
    data = helper.mutateData(data, "amp", 1)
    let points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 })

    let colorIndex = 0
    let colorStop = Math.ceil(data.length / colors.length)
    points.start.forEach((start, i) => {
        if ((i + 1) % colorStop == 0) colorIndex++
        helper.drawRectangle(start, data[i], w / data.length, { color: colors[colorIndex] })
    })

}
