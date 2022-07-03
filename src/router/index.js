import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SystemIntroduceView from '../views/system/SystemIntroduceView.vue'

// 路由信息
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: HomeView,
    redirect: '/home/system/systemIntroduce',
    children: [
      {
        path: 'system/systemIntroduce',
        component: SystemIntroduceView,
        name: 'SystemIntroduceView'
      },
      {
        path: 'system/systemManage',
        component: () => import('../views/system/SystemManageView.vue')
      },
      {
        path: 'user/usersList',
        component: () => import('../views/user/UsersListView.vue')
      },
      {
        path: 'cart/cart',
        component: () => import('../views/cart/CartView.vue')
      },
      {
        path: 'system/systemUserManage',
        component: () => import('../views/system/SystemUserManageView.vue')
      },
      {
        path: 'shops/shops',
        component: () => import('../views/shop/ShopViews.vue')
      },
      {
        path: 'shops/addShop',
        component: () => import('../views/shop/AddShopView.vue')
      }
    ]
  },
  {
    path: '/login',
    name:'login',
    component: LoginView
  }
]

// 路由实例
const Router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由全局前置守卫
Router.beforeEach((to, from) => {
  // console.log(to);
  // console.log(from);
  return true;
})

export default Router;