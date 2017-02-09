var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
        // 解决npm run dev 和 npm run build 编译后前缀不一样的问题
        if (loader === 'css-loader') {
            extraParamChar = '?-autoprefixer&'
        }
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  // var output = []
  // var loaders = exports.cssLoaders(options)
  // for (var extension in loaders) {
  //   var loader = loaders[extension]
  //   output.push({
  //     test: new RegExp('\\.' + extension + '$'),
  //     loader: loader
  //   })
  // }
  var output = [];
  var loaders = exports.cssLoaders(options);
  for (var extension in loaders) {
      // var loader = loaders[extension];
      // 解决.js文件引入scss无法添加前缀问题
      var loader = loaders[extension].split('!');
      // 解决.js文件引入scss无法添加前缀问题
      var isPreProcesser = ['less', 'sass', 'scss' ,'stylus', 'styl'].some(function (v) {
          return v === extension
      })
      // 解决.js文件引入scss无法添加前缀问题
      if (isPreProcesser) {
          loader.splice(-1, 0, 'postcss-loader')
      }
      output.push({
          test: new RegExp('\\.' + extension + '$'),
          // loader: loader
          // 解决.js文件引入scss无法添加前缀问题
          loader: loader.join('!')
      })
  }
  return output
}
