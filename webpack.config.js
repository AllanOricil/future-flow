const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'future-flow.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'futureFlow',
        libraryTarget: 'umd',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        // Drop only console.logs but leave others
                        pure_funcs: ['console.log'],
                    },
                    mangle: {
                        // Note: I'm not certain this is needed.
                        reserved: ['console.log'],
                    },
                },
            }),
        ],
    },
};