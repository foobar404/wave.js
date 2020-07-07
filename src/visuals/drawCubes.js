export default (functionContext) => {
    let { data, options, ctx, h, w, Helper } = functionContext;
    let { colors } = options;
    let helper = new Helper(ctx);

    data = helper.mutateData(data, "organize").base

    data = helper.mutateData(data, "shrink", 20).slice(0, 19)
    data = helper.mutateData(data, "scale", h)

    let points = helper.getPoints("line", w, [0, h], data.length, data)

    let spacing = 5;
    let squareSize = (w / 20) - spacing
    let colorIndex = 0

    points.start.forEach((start, i) => {
        let squareCount = Math.ceil(data[i] / squareSize)

        //find color stops from total possible squares in bar 
        let totalSquares = (h - (spacing * (h / squareSize))) / squareSize
        let colorStop = Math.ceil(totalSquares / colors.length)

        for (let j = 1; j <= squareCount; j++) {
            let origin = [start[0], (start[1] - (squareSize * j) - (spacing * j))]
            helper.drawSquare(origin, squareSize, { color: colors[colorIndex], lineColor: "black" })
            if (j % colorStop == 0) {
                colorIndex++
                if (colorIndex >= colors.length) colorIndex = colors.length - 1
            }
        }
        colorIndex = 0
    })
}
