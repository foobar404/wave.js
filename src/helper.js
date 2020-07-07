function Helper(ctx) {
    this.ctx = ctx
    this.mainColor = "black"
}

Helper.prototype = {
    __toRadians__(degree) {
        return (degree * Math.PI) / 180;
    },
    __rotatePoint__([pointX, pointY], [originX, originY], degree) {
        //clockwise
        let angle = this.__toRadians__(degree)
        let rotatedX = Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX;
        let rotatedY = Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY;

        return [rotatedX, rotatedY]
    },
    mutateData(data, type, extra = null) {
        if (type === "mirror") {
            let rtn = []

            for (let i = 0; i < data.length; i += 2) {
                rtn.push(data[i])
            }

            rtn = [...rtn, ...rtn.reverse()]
            return rtn
        }

        if (type === "shrink") {
            //resize array by % of current array 
            if (extra < 1) {
                extra = data.length * extra
            }

            let rtn = []
            let splitAt = Math.floor(data.length / extra)

            for (let i = 1; i <= extra; i++) {
                let arraySection = data.slice(i * splitAt, (i * splitAt) + splitAt)
                let middle = arraySection[Math.floor(arraySection.length / 2)]
                rtn.push(middle)
            }

            return rtn
        }

        if (type === "split") {
            let size = Math.floor(data.length / extra)
            let rtn = []
            let temp = []

            let track = 0
            for (let i = 0; i <= size * extra; i++) {
                if (track === size) {
                    rtn.push(temp)
                    temp = []
                    track = 0
                }

                temp.push(data[i])
                track++
            }

            return rtn
        }

        if (type === "scale") {
            let scalePercent = extra / 255
            if (extra <= 3 && extra >= 0) scalePercent = extra
            let rtn = data.map(value => value * scalePercent)
            return rtn
        }

        if (type === "organize") {
            let rtn = {}
            rtn.base = data.slice(60, 120)
            rtn.vocals = data.slice(120, 255)
            rtn.mids = data.slice(255, 2000)
            return rtn
        }

        if (type === "reverb") {
            let rtn = []
            data.forEach((val, i) => {
                rtn.push(val - (data[i + 1] || 0))
            })
            return rtn
        }

        if (type === "amp") {
            let rtn = []
            data.forEach(val => {
                rtn.push(val * (extra + 1))
            })
            return rtn
        }

        if (type === "min") {
            let rtn = []
            data.forEach(value => {
                if (value < extra) value = extra
                rtn.push(value)
            })
            return rtn
        }
    },
    getPoints(shape, size, [originX, originY], pointCount, endPoints, options = {}) {
        let { offset = 0, rotate = 0, customOrigin = [] } = options
        let rtn = {
            start: [],
            end: []
        }

        if (shape === "circle") {

            let degreePerPoint = 360 / pointCount
            let radianPerPoint = this.__toRadians__(degreePerPoint)
            let radius = size / 2

            for (let i = 1; i <= pointCount; i++) {
                let currentRadian = radianPerPoint * i
                let currentEndPoint = endPoints[i - 1]
                let pointOffset = endPoints[i - 1] * (offset / 100)

                let x = originX + (radius - pointOffset) * Math.cos(currentRadian)
                let y = originY + (radius - pointOffset) * Math.sin(currentRadian)
                let point1 = this.__rotatePoint__([x, y], [originX, originY], rotate)

                rtn.start.push(point1)

                x = originX + ((radius - pointOffset) + currentEndPoint) * Math.cos(currentRadian)
                y = originY + ((radius - pointOffset) + currentEndPoint) * Math.sin(currentRadian)
                let point2 = this.__rotatePoint__([x, y], [originX, originY], rotate)

                rtn.end.push(point2)

            }

            return rtn
        }

        if (shape === "line") {
            let increment = size / pointCount

            originX = customOrigin[0] || originX
            originY = customOrigin[1] || originY

            for (let i = 0; i <= pointCount; i++) {
                let degree = rotate
                let pointOffset = endPoints[i] * (offset / 100)

                let startingPoint = this.__rotatePoint__([originX + (i * increment), originY - pointOffset],
                    [originX, originY], degree)
                rtn.start.push(startingPoint)

                let endingPoint = this.__rotatePoint__([originX + (i * increment), (originY + endPoints[i]) - pointOffset],
                    [originX, originY], degree)
                rtn.end.push(endingPoint)
            }

            return rtn

        }

    },
    drawCircle([x, y], diameter, options = {}) {
        let { color, lineColor = this.ctx.strokeStyle } = options

        this.ctx.beginPath();
        this.ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
        this.ctx.strokeStyle = lineColor
        this.ctx.stroke();
        this.ctx.fillStyle = color
        if (color) this.ctx.fill()
    },
    drawOval([x, y], height, width, options = {}) {
        let { rotation = 0, color, lineColor = this.ctx.strokeStyle } = options;
        if (rotation) rotation = this.__toRadians__(rotation);

        this.ctx.beginPath();
        this.ctx.ellipse(x, y, width, height, rotation, 0, 2 * Math.PI);
        this.ctx.strokeStyle = lineColor
        this.ctx.stroke();
        this.ctx.fillStyle = color
        if (color) this.ctx.fill()
    },
    drawSquare([x, y], diameter, options = {}) {
        this.drawRectangle([x, y], diameter, diameter, options)
    },
    drawRectangle([x, y], height, width, options = {}) {
        let { color, lineColor = this.ctx.strokeStyle, radius = 0, rotate = 0 } = options

        // if (width < 2 * radius) radius = width / 2;
        // if (height < 2 * radius) radius = height / 2;

        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        let p1 = this.__rotatePoint__([x + width, y], [x, y], rotate)
        let p2 = this.__rotatePoint__([x + width, y + height], [x, y], rotate)
        this.ctx.arcTo(p1[0], p1[1], p2[0], p2[1], radius);

        let p3 = this.__rotatePoint__([x + width, y + height], [x, y], rotate)
        let p4 = this.__rotatePoint__([x, y + height], [x, y], rotate)
        this.ctx.arcTo(p3[0], p3[1], p4[0], p4[1], radius);

        let p5 = this.__rotatePoint__([x, y + height], [x, y], rotate)
        let p6 = this.__rotatePoint__([x, y], [x, y], rotate)
        this.ctx.arcTo(p5[0], p5[1], p6[0], p6[1], radius);

        let p7 = this.__rotatePoint__([x, y], [x, y], rotate)
        let p8 = this.__rotatePoint__([x + width, y], [x, y], rotate)
        this.ctx.arcTo(p7[0], p7[1], p8[0], p8[1], radius);
        this.ctx.closePath();

        this.ctx.strokeStyle = lineColor;
        this.ctx.stroke()
        this.ctx.fillStyle = color
        if (color) this.ctx.fill()

    },
    drawLine([fromX, fromY], [toX, toY], options = {}) {
        let { lineColor = this.ctx.strokeStyle } = options

        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.strokeStyle = lineColor
        this.ctx.stroke();
    },
    drawPolygon(points, options = {}) {
        let { color, lineColor = this.ctx.strokeStyle, radius = 0, close = false } = options

        function getRoundedPoint(x1, y1, x2, y2, radius, first) {
            let total = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
            let idx = first ? radius / total : (total - radius) / total;

            return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
        }

        function getRoundedPoints(pts, radius) {
            let len = pts.length
            let res = new Array(len);

            for (let i2 = 0; i2 < len; i2++) {
                let i1 = i2 - 1;
                let i3 = i2 + 1;

                if (i1 < 0) i1 = len - 1;
                if (i3 == len) i3 = 0;

                let p1 = pts[i1];
                let p2 = pts[i2];
                let p3 = pts[i3];

                let prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
                let nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
                res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
            }
            return res;
        };

        if (radius > 0) {
            points = getRoundedPoints(points, radius);
        }

        let i, pt, len = points.length;
        for (i = 0; i < len; i++) {
            pt = points[i];
            if (i == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(pt[0], pt[1]);
            } else {
                this.ctx.lineTo(pt[0], pt[1]);
            }
            if (radius > 0) {
                this.ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
            }
        }

        if (close) this.ctx.closePath();
        this.ctx.strokeStyle = lineColor
        this.ctx.stroke();

        this.ctx.fillStyle = color
        if (color) this.ctx.fill()
    }

}


export default Helper