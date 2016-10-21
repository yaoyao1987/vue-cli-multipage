import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './index'
import Add from './add'
import List from './list'

// 开启debug模式
Vue.config.debug = true

Vue.use(VueRouter)

// 创建一个路由器实例
// 并且配置路由规则
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/index',
      component: Index
    },
    {
      path: '/add',
      component: Add
    },
    {
      path: '/list',
      component: List
    }
  ]
})

// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
/* eslint-disable no-new */
new Vue({
  router: router
}).$mount('#index')
