import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'
// 登录页
import Login from '@/views/login/Login.vue'
// 首页
import Index from '@/views/index/Index.vue'
// 商品管理页
import Goods from '@/views/goods/Goods.vue'
// 服务说明页
import ServiceDeclare from '@/views/service_declare/ServiceDeclare.vue'
// 订单管理页
import Order from '@/views/order/Order.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      // 默认重定向到首页
      redirect: "/index",
      children: [
        {
          path: '/index',
          name: 'index',
          component: Index
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/serviceDeclare',
          name: 'serviceDeclare',
          component: ServiceDeclare
        },
        {
          path: '/order',
          name: 'order',
          component: Order
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
})
