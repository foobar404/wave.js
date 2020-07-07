export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options
    const helper = new Helper(ctx)

    // data = helper.mutateData(data, "shrink", 200)
    data = helper.mutateData(data, "split", 4)[0]
    data = helper.mutateData(data, "scale", h)

    let points = helper.getPoints("line", w, [0, h], data.length, data, { offset: 100 })
    points.start = points.start.slice(0, points.end.length - 1)
    points.start.push([w, h])
    points.start.push([0, h])

    helper.drawPolygon(points.start, { lineColor: colors[0], color: colors[1], radius: (h * .008) })


}