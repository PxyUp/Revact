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
            typescript(),
            terser(),
        ],
    },
    {
        input: "src/index.ts",
        output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
        plugins: [
            typescript(),
            terser(),
        ],
    },
]
