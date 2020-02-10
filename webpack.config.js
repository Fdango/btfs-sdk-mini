const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      library: 'BTFS',
      libraryTarget: 'umd',
      filename: 'btfs-mini.js'
    },
    target: "web",
    optimization: {
      minimize: false
    }
  
};