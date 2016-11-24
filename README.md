# vue-cli多页面

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## 多页面配置
vue2.0版本多页面入口,是由webpack配置来完成的
比如说，我的项目文件结构如下
```
    webpack
      |---build
      |---src
        |---assets 资源
        |---components组件
        |---module各个模块
          |---index    index模块
            |---index.html
            |---index.js
            |---index.vue
          |---info       info模块
            |---info.html
            |---info.js
            |---info.vue
  ```

修改webpack.base.conf.js文件

    var glob = require('glob'); //这里的glob是nodejs的glob模块，是用来读取webpack入口目录文件的
    var entries = getEntry('./src/module/**/*.js'); // 获得入口js文件
    function getEntry(globPath) {
      var entries = {},
          basename, tmp, pathname;

      glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[pathname] = entry;
      });
      console.log(entries);
      return entries;
    }

    module.exports = {
      entry: entries,
      ***
    }

修改webpack.dev.conf.js文件

    var glob = require('glob');
    module.exports = merge(baseWebpackConfig, {
      devtool: '#eval-source-map',
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ]
    })

    function getEntry(globPath) {
      var entries = {},
        basename, tmp, pathname;

      glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[pathname] = entry;
      });
      console.log(entries);
      return entries;
    }

    var pages = getEntry('./src/module/**/*.html');

    for (var pathname in pages) {
      // 配置生成的html文件，定义路径等
      var conf = {
        filename: pathname + '.html',
        template: pages[pathname], // 模板路径
        chunks: [pathname, 'vendor', 'manifest'], // 每个html引用的js模块
        inject: true              // js插入位置
      };
      // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
      module.exports.plugins.push(new HtmlWebpackPlugin(conf));
    }

修改webpack.prod.conf.js文件

    var glob = require('glob');
    module.exports = merge(baseWebpackConfig, {
      ***
      plugins: [
        ***
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin(path.join(config.build.assetsSubDirectory, '[name].[contenthash].css'))
      ]
    })

    function getEntry(globPath) {
      var entries = {},
        basename, tmp, pathname;

      glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[pathname] = entry;
      });
      console.log(entries);
      return entries;
    }

    var pages = getEntry('./src/module/**/*.html');

    for (var pathname in pages) {
      console.log(pathname);
      // 配置生成的html文件，定义路径等
      var conf = {
        // filename: pathname + '.html',
        filename: pathname + '.html',
        template: pages[pathname], // 模板路径
        chunks: [pathname, 'vendor', 'manifest'], // 每个html引用的js模块
        inject: true              // js插入位置
      };
      // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
      module.exports.plugins.push(new HtmlWebpackPlugin(conf));
    }


## css autoprefix的问题

  外部引入的css未自动添加前缀，这个问题未解决

  build之后组件内部的css未自动添加前缀
  ```
  return {
    css: generateLoaders(['css?-autoprefixer']),
    postcss: generateLoaders(['css?-autoprefixer']),
    less: generateLoaders(['css?-autoprefixer', 'less']),
    sass: generateLoaders(['css?-autoprefixer', 'sass?indentedSyntax']),
    scss: generateLoaders(['css?-autoprefixer', 'sass']),
    stylus: generateLoaders(['css?-autoprefixer', 'stylus']),
    styl: generateLoaders(['css?-autoprefixer', 'stylus'])
  }
  ```

## 参考
[vue-router2.0](http://gold.xitu.io/entry/57fcd8088ac2470058cadd6e)
