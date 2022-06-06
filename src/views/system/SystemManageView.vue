<script>
import { toRef, ref } from "vue";
export default {
  name: "systemManageView",
  setup() {
    return {
      title: ref(1),
    };
  },
};
</script>

<template>
  <section class="box1">
    <h2>系统管理</h2>
  </section>
</template>

<style lang="less">
.box1{
  height: 1000px;
}
</style>