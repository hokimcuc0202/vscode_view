const path = require('path');
console.log(path.resolve(__dirname, 'out/script/'));

module.exports =  {
  entry: path.resolve(__dirname, 'src/script/template.ts'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'out/script/'),
    filename: 'template.min.js'
  },
  module: {
    rules: [
      {
        test: /.ts?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript']
          }
        }
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};