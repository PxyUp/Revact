import copy from 'rollup-plugin-copy';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default [
    {
        input: "src/index.ts",
        output: {
            file: "./lib/fast-dom.js",
            format: 'umd',
            name: 'fast-dom',
        },
        plugins: [
            typescript({
                tsconfig: 'tsconfig.lib.json'
            }),
            terser(),
            copy({
                "./package.json": "./lib/package.json",
                verbose: true
            }),
        ],
    },
    {
        input: "src/index.ts",
        output: [
			{ file: './lib/' + pkg.main, format: 'cjs' },
			{ file: './lib/' + pkg.module, format: 'es' }
		],
        plugins: [
            typescript(),
            terser(),
        ],
    },
]
