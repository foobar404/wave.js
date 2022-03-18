import { IPolygonOptions, IRectangleOptions, IArcOptions, ICircleOptions, ILineOptions } from "../types";
export declare class Shapes {
    private _canvasContext;
    constructor(canvasContext: CanvasRenderingContext2D);
    toRadians(degrees: number): number;
    toDegrees(radians: number): number;
    private _rotatePoint;
    private _makeGradient;
    private _makeImage;
    private _implementOptions;
    arc(x: number, y: number, diameter: number, startAngleInDegrees: number, endAngleInDegrees: number, options?: IArcOptions): this;
    circle(x: number, y: number, diameter: number, options?: ICircleOptions): this;
    line(fromX: number, fromY: number, toX: number, toY: number, options?: ILineOptions): this;
    polygon(points: {
        x: number;
        y: number;
    }[], options?: IPolygonOptions): this;
    rectangle(x: number, y: number, width: number, height: number, options?: IRectangleOptions): this;
}
