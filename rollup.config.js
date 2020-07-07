// import { terser } from "rollup-plugin-terser";
// import babel from '@rollup/plugin-babel';

export default {
    input: "./src/index.js",
    output: [{
        file: './dist/bundle.iife.js',
        format: 'iife',
        name: 'Wave'
    }, {
        file: './dist/bundle.cjs.js',
        format: 'cjs'
    }],
    // plugins: [babel({
    //     presets: [
    //         [
    //             "@babel/preset-env",
    //             {
    //                 "targets": {
    //                     "browsers": [
    //                         "safari 6",
    //                         "cover 99.5%"
    //                     ]
    //                 },
    //                 debug: false
    //             }
    //         ]
    //     ]
    // }), terser()]
}

