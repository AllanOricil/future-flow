const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'future-flow.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'futureFlow',
        libraryTarget: 'umd',
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
};