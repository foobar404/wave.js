export type FillOption = string | { gradient: string[], rotate?: number } | { image: string };
export type Glow = { strength: number, color: string };

export interface IArcOptions {
    glow?: Glow;
    lineColor?: FillOption;
    lineWidth?: number;
    rounded?: boolean;
}

export interface ICircleOptions {
    fillColor?: FillOption;
    glow?: Glow;
    lineColor?: FillOption;
    lineWidth?: number;
}

export interface ILineOptions {
    glow?: Glow;
    lineColor?: FillOption;
    lineWidth?: number;
    rounded?: boolean;
}

export interface IPolygonOptions {
    fillColor?: FillOption;
    glow?: Glow;
    lineColor?: FillOption;
    lineWidth?: number;
    rounded?: boolean;
}

export interface IRectangleOptions {
    glow?: Glow;
    fillColor?: FillOption;
    lineColor?: FillOption;
    lineWidth?: number;
    radius?: number;
}

export interface IAnimation {
    draw: (audioBufferData: Uint8Array, canvasElement: CanvasRenderingContext2D) => void;
}

