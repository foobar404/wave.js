import { CleanWebpackPlugin } from "clean-webpack-plugin";
export const mode: string;
export const entry: string;
export namespace module {
    const rules: {
        test: RegExp;
        use: string;
        exclude: RegExp;
    }[];
}
export namespace resolve {
    const extensions: string[];
}
export namespace output {
    const path: string;
    const libraryTarget: string;
    const filename: string;
    const globalObject: string;
}
export const plugins: CleanWebpackPlugin[];
