import html from 'rollup-plugin-bundle-html';
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
    output: {
        file: "./tests/build/bundle.js",
        format: 'iife',
        name: 'testBundle',
    },
    plugins: [
        typescript(),
          terser(),
          html({
            template: './tests/fixture/index.html',
            dest: "./tests/build",
            filename: 'index.html',
            inject: 'body',
        }),
    ],
}
