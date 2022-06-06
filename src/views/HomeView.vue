<script>
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref, reactive, toRefs } from "vue";
export default defineComponent({
  name: "homeView",
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
  },

  setup() {
    const asideListData = [
      {
        id: 1,
        pid: 0,
        name: "系统",
        path: "/system",
        children: [
          { id: 2, pid: 1, name: "系统介绍", children: [] },
          { id: 3, pid: 1, name: "系统管理", children: [] },
        ],
      },
    ];

    const state = reactive({
      rootSubmenuKeys: ["sub1", "sub2", "sub3"],
      openKeys: ["sub1"],
      selectedKeys: [],
    });

    // 侧边栏聚焦父级方法
    const onOpenChange = () => {
      const latestOpenKey2 = state.openKeys[state.openKeys.length - 1];
      if (latestOpenKey2) {
        state.openKeys = [latestOpenKey2];
      }
    };

    return {
      selectedKeys1: ref(["2"]),
      ...toRefs(state),
      onOpenChange,
    };
  },
});
</script>
<template>
  <section class="homePage">
    <a-layout>
      <!-- 头部组件 -->
      <a-layout-header class="header">
        <div class="logo" />
        <a-menu
          v-model:selectedKeys="selectedKeys1"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
          theme="dark"
        >
          <a-menu-item key="1">nav 1</a-menu-item>
          <a-menu-item key="2">nav 2</a-menu-item>
          <a-menu-item key="3">nav 3</a-menu-item>
        </a-menu>
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
                <router-link to="/home/user/usersList">订单管理</router-link>
              </a-menu-item>
              <a-menu-item key="7">
                <router-link to="/home/user/usersList">购物车管理</router-link>
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
              <a-menu-item key="9">商品管理</a-menu-item>
              <a-menu-item key="10">热门商品管理</a-menu-item>
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

<style lang="less">
.homePage {
  width: 100vw;
  height: 100vh;
  .ant-layout {
    height: 100%;
  }
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
