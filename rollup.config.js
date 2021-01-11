import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';

const minName = pkg.browser.split('.');
const minified = minName[0] + '.min.js';
const projectName = pkg.name;

export default [
  // browser-friendly UMD build
  {
    input: 'src/ioc-container.js',
    output: {
      name: projectName,
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve(),
      commonjs(),
      eslint({
        fix: true
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ],
  },

  // browser-friendly minified UMD build
  {
    input: 'src/ioc-container.js',
    output: {
      name: projectName,
      file: minified,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      eslint({
        fix: true
      }),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/ioc-container.js',
    external: [],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  }
];
