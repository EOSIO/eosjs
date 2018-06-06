const path = require('path');

module.exports = {
    entry: {
        eosjs2: './src/index.ts',
        eosjs2_jsonrpc: './src/eosjs2-jsonrpc.ts',
        eosjs2_jssig: './src/eosjs2-jssig.ts',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    output: {
        library: 'eosjs2',
        pathinfo: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: x => x.chunk.id.replace('_', '-') + '-debug.js',
        library: '[id]',
        path: path.resolve(__dirname, 'dist'),
    }
};
