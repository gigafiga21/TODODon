const Terser = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
    externals: {
        readline: 'require(\'readline\')',
        fs: 'require(\'fs\')'
    },
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: 'tododon.js'
    },
    module: {
        rules: [
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            },
        ],
    },
    optimization: {
        minimizer: [new Terser({terserOptions: {ecma: 6}})],
    },
    target: 'node',
    mode: 'production'
};
