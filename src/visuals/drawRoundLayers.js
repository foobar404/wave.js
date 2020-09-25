import Origami from "origamijs";

export default (functionContext) => {
    let { data, options, ctx, h, w, Helper, canvasId } = functionContext;
    let { colors } = options
    let helper = new Helper(ctx)

    let origamiContext = {}
    let origami = Origami.bind(origamiContext)

    origami(ctx)
        .rect(10, 10, 40, 40)
        .draw()


}
