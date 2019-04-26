import copy from 'rollup-plugin-copy';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default [
    {
        input: "src/index.ts",
        output: {
            file: "./lib/revact.umd.js",
            format: 'umd',
            name: 'revact',
        },
        plugins: [
            typescript({
                tsconfig: 'tsconfig.lib.json'
            }),
            terser(),
            copy({
                "./package.json": "./lib/package.json",
                "./README.md": "./lib/README.md",
                './LICENSE': './lib/LICENSE',
                verbose: true
            }),
        ],
    },
    {
        input: "src/index.ts",
        output: [
			{ file: './lib/' + pkg.module, format: 'es' }
		],
        plugins: [
            typescript(),
        ],
    },
    {
        input: "src/index.ts",
        output: [
			{ file: './lib/' + pkg.es2015, format: 'es' }
		],
        plugins: [
            typescript({
                tsconfig: 'tsconfig.lib.json',
                tsconfigOverride: {
                    compilerOptions: {
                        target: "es2015"
                    }
                }
            }),
        ],
    },
]
