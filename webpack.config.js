const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { ProvidePlugin } = require('webpack')

const developmentConfig = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    // TODO: Figure out if we need to replace this. If you haven't noticed, just delete it
    // contentBase: path.join(__dirname, 'build'),
    compress: true,
    historyApiFallback: true,

    port: 8080,
  },
}

module.exports = {
  mode: 'production',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      '@root': path.resolve(__dirname, 'src/'),
      '@constants': path.resolve(__dirname, 'src/constants.ts'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@libs': path.resolve(__dirname, 'src/libs/'),
      '@parser': path.resolve(__dirname, 'src/parser/'),
      '@state': path.resolve(__dirname, 'src/state/'),
      '@views': path.resolve(__dirname, 'src/views/'),
    },
    fallback: {
      https: require.resolve('https-browserify/'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify/'),
      buffer: require.resolve('buffer/'),
      fs: false,
    },
  },
  performance: {
    hints: false,
  },
  cache: {
    type: 'memory',
  },
  plugins: [
    new CopyPlugin({ patterns: ['public'] }),
    new Dotenv(),
    new ProvidePlugin({ process: ['process'] }),
  ],
  ...(process.env.NODE_ENV !== 'production' ? developmentConfig : {}),
}
