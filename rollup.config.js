import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'src/index.js',
    plugins: [
      babel({
        babelrc: false,
        presets: [["env", { "modules": false }], "react"],
        plugins: ['transform-class-properties', 'external-helpers']
      }),
      resolve()
    ],
    output: [
      {
        file: 'dist/esm/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/umd/index.js',
        format: 'umd'
      }
    ],
    external: [
      'react',
      'prop-types',
      'react-advancer',
      'lodash.noop',
      'styled-components',
      'es-components'
    ]
  }
];
