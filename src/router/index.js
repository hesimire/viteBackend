import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

// 路由信息
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: HomeView,
    children: [
      {
        path: 'system/systemIntroduce',
        component: () => import('../views/system/SystemIntroduceView.vue')
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
        path: 'system/systemUserManage',
        component: () => import('../views/system/SystemUserManageView.vue')
      }
    ]
  },
  {
    path: '/login',
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