# vue-cli多页面

## 更新
1. css autoprefix的问题
  @luchanan的方案，具体可以参考[https://github.com/luchanan/vue2.0-multi-page](https://github.com/luchanan/vue2.0-multi-page)

2. [Issues#22多页面多路由进入子路由页面直接刷新出错](https://github.com/yaoyao1987/vue-cli-multipage/issues/22#issuecomment-278212911)
  @Deguang提到需要做http server配置，文档地址[http://router.vuejs.org/zh-cn/essentials/history-mode.html](http://router.vuejs.org/zh-cn/essentials/history-mode.html)
  我在dev-server.js中简单得修改了以下代码
  ```
  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')({
    rewrites: [
      { from: /\/add$/, to: '/module/index.html'},
      { from: /\/list$/, to: '/module/index.html'}
    ]
  }))
  ```
3. [Issues#21build之后的vendor.js把所有页面引入的库都放进去了]https://github.com/yaoyao1987/vue-cli-multipage/issues/21

  以下修改方法并没有解决根本问题，只能控制vendor.js不会加载所有node_modules中的模块

  在webpack.prod.conf.js中修改

  ```
  // split vendor js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, '../node_modules')
        ) === 0
      )
    }
  })
  ```
  改为
  ```
  new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: ['index','info'], //提取哪些模块共有的部分
      minChunks: 2 // 提取至少2个模块共有的部分
  })
  ```

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

## 参考
[vue-router2.0](http://gold.xitu.io/entry/57fcd8088ac2470058cadd6e)
[luchanan的vue多页面配置](https://github.com/luchanan/vue2.0-multi-page)
