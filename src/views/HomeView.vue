<template>
  <section class="homePage">
    <a-layout>
      <!-- 头部组件 -->
      <a-layout-header class="header">
        <section class="flexRow">
          <img src="@/assets/logo.png" alt="商城首页图标" />
          <h1>商城管理系统</h1>
        </section>
        <section class="isLoginSection flexRow">
          <span v-if="!isLogin">未登录</span>
          <div v-else>
            <span> 欢迎 {{ userStatus }}</span>
            <a-button type="link" @click="signOut">退出登录</a-button>
          </div>
        </section>
      </a-layout-header>
      <a-layout>
        <!-- 侧边栏组件 -->
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            v-model:openKeys="openKeys"
            mode="inline"
            :style="{ height: '100%', borderRight: 0 }"
            @openChange="onOpenChange"
          >
            <a-sub-menu key="sub1">
              <template #title>
                <span>
                  <user-outlined />
                  系统
                </span>
              </template>
              <a-menu-item key="1">
                <router-link to="/home/system/systemIntroduce"
                  >系统介绍</router-link
                >
              </a-menu-item>
              <a-menu-item key="2">
                <router-link to="/home/system/systemManage"
                  >系统管理</router-link
                >
              </a-menu-item>
              <a-menu-item key="3">
                <router-link to="/home/system/systemUserManage"
                  >系统用户管理</router-link
                >
              </a-menu-item>
              <!-- <a-menu-item key="3">option3</a-menu-item> -->
              <!-- <a-menu-item key="4">option4</a-menu-item> -->
            </a-sub-menu>
            <a-sub-menu key="sub2">
              <template #title>
                <span>
                  <laptop-outlined />
                  用户
                </span>
              </template>
              <a-menu-item key="5">
                <router-link to="/home/user/usersList">消费者管理</router-link>
              </a-menu-item>
              <a-menu-item key="6">
                <router-link to="/home/cart/cart">订单管理</router-link>
              </a-menu-item>
              <!-- <a-menu-item key="6">option6</a-menu-item> -->
              <!-- <a-menu-item key="7">option7</a-menu-item> -->
              <!-- <a-menu-item key="8">option8</a-menu-item> -->
            </a-sub-menu>
            <a-sub-menu key="sub3">
              <template #title>
                <span>
                  <notification-outlined />
                  商品
                </span>
              </template>
              <a-menu-item key="9">
                <router-link to="/home/shops/shops">商品管理</router-link>
              </a-menu-item>
              <a-menu-item key="10">
                <router-link to="/home/shops/addShop">商品新增</router-link>
              </a-menu-item>
              <!-- <a-menu-item key="10">热门商品管理</a-menu-item> -->
              <!-- <a-menu-item key="11">option11</a-menu-item> -->
              <!-- <a-menu-item key="12">option12</a-menu-item> -->
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <!-- 主题区域 -->
        <a-layout style="padding: 0 24px 24px">
          <!-- 面包屑导航 -->
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>List</a-breadcrumb-item>
            <a-breadcrumb-item>App</a-breadcrumb-item>
          </a-breadcrumb>
          <!-- 主题内容区域 -->
          <a-layout-content
            :style="{
              background: '#fff',
              padding: '24px',
              margin: 0,
              minHeight: '280px',
              overflowY: 'scroll',
            }"
          >
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </section>
</template>

<script>
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons-vue";
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  computed,
} from "vue";
import { userStore } from "../store/user";
import { storeToRefs } from "pinia";
// import VueRouter from "../router/index";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "homeView",
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
  },

  setup() {
    const route = useRoute()

    const userRouter = [
      {
        id: 1,
        pId:0,
        name:'系统'
      },
      {
        id:2,
        pId:1,
        name:'系统介绍'
      },
      {
        
      }
    ]


    console.log(route);
    const router = useRouter();
    const userPinia = userStore();
    const { isLogin } = storeToRefs(userPinia);

    // 管理员区别方法
    const userStatus = computed({
      get: () => {
        if (userPinia.$state.user.status == "0") {
          return "系统管理员";
        } else {
          return "普通管理员";
        }
      },
      set: () => {},
    });
    // 退出登录方法
    const signOut = () => {
      userPinia.signOut();
    };

    onMounted(() => {
      let userInfo = JSON.parse(localStorage.getItem("piniaUserState"));
      if (userInfo) {
        userPinia.myLogin(userInfo.user);
        userPinia.$state.isLogin = true;
      } else {
        router.push({
          name:'login'
        })
      }
    });

    const state = reactive({
      rootSubmenuKeys: ["sub1", "sub2", "sub3"],
      openKeys: ["sub1"],
      selectedKeys: ["1"],
    });

    // 侧边栏聚焦父级方法
    const onOpenChange = () => {
      const latestOpenKey2 = state.openKeys[state.openKeys.length - 1];
      console.log(latestOpenKey2);
      if (latestOpenKey2) {
        state.openKeys = [latestOpenKey2];
      }
    };

    return {
      selectedKeys1: ref([]),
      ...toRefs(state),
      onOpenChange,
      isLogin,
      userStatus,
      signOut,
    };
  },
});
</script>
<style lang="less">
.homePage {
  width: 100vw;
  height: 100vh;
  .ant-layout {
    height: 100%;
  }
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
  }
  h1 {
    color: white;
    font-weight: bold;
    font-size: 35px;
    margin-bottom: 0;
    margin-left: 30px;
  }
}

.flexRow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.isLoginSection {
  color: white;
}
/* #components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
} */
</style>
