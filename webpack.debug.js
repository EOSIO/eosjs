const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        eosjs_api: './src/eosjs-api.ts',
        eosjs_jsonrpc: './src/rpc-web.ts',
        eosjs_jssig: './src/eosjs-jssig.ts',
        eosjs_numeric: './src/eosjs-numeric.ts',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.web.json'
                    }
                },
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            buffer: 'buffer',
            crypto: 'crypto-browserify'
        }
    },
    output: {
        filename: x => x.chunk.name.replace('_', '-') + '.js',
        library: '[name]',
        path: path.resolve(__dirname, 'dist-web'),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'externals',
                    filename: 'externals.js',
                    chunks: 'all'
                },
            },
        },
    }
};
