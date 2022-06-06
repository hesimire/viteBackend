<script>
import { toRef, ref } from "vue";
export default {
  name: "systemIntroduceView",
  setup() {
    return {
      title: ref(1),
    };
  },
};
</script>

<template>
  <section class="box1">
    <h2>系统介绍</h2>
    <p>本系统是由Vite + Vue3 + VueRouter + Vuex + koa2构成系统, 服务器部署在阿里云上</p>
    <p>后台系统可以对前端uniApp-H5端展示 进行管理</p>
    <p>系统管理</p>
    <p>用户管理</p>
    <p>商品管理</p>
  </section>
</template>

<style lang="less">
.box1{
  height: 1000px;
}
</style>
