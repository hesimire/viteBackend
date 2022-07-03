<template>
  <!-- 登录页 -->
  <section class="loginPage">
    <!-- 登录框 -->
    <section class="loginBoxContainer">
      <section class="login-title">
        <h2>商城后台管理</h2>
      </section>
      <!-- 登录表单 -->
      <a-form
        :model="formState"
        layout="horizontal"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <!-- 账号框 -->
        <a-form-item name="account" :rules="[{ message: '请输入账号' }]">
          <a-input
            v-model:value="formState.account"
            size="large"
            placeholder="admin"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <!-- 密码框 -->
        <a-form-item name="password" :rules="[{ message: '请输入密码' }]">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="123456"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item name="captchaInput" :rules="[{ message: '请输入验证码' }]">
          <a-input
            v-model:value="formState.captchaInput"
            size="large"
            placeholder="验证码"
            class="hei45"
          >
            <template #suffix>
              <div
                v-html="formState.captchaIMG"
                class="captchaIMG"
                @click="setCaptcha"
              ></div>
            </template>
          </a-input>
        </a-form-item>
        <!-- 按钮组 -->
        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            class="login-form-button hei45"
            block
            :loading="iconLoading"
          >
            登录
          </a-button>
          <!-- Or
          <a href="">register now!</a> -->
        </a-form-item>
      </a-form>
    </section>
  </section>
</template>
<script>
import {
  defineComponent,
  reactive,
  computed,
  ref,
  watch,
  onMounted,
} from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import request from "../api";
import VueRouter from "../router/index";
import { userStore } from "../store/user";
export default defineComponent({
  name: "LoginViews",
  components: {
    UserOutlined,
    LockOutlined,
  },

  setup() {
    // 表格内容
    const formState = reactive({
      account: "admin",
      password: "123456",
      remember: true,
      captchaIMG: "",
      text: "",
      captchaInput: "",
    });

    // 按钮加载状态
    const iconLoading = ref(false);

    const userPinia = userStore();

    console.log("userPinia:", userPinia);

    watch(userPinia, (newValue, oldValue) => {
      localStorage.setItem("piniaUserState", JSON.stringify(newValue));
    });

    // 登录方法
    const onFinish = async (values) => {
      if (
        formState.captchaInput.toLowerCase() === formState.text.toLowerCase()
      ) {
        iconLoading.value = true;
        const res = await request.post("/api/routeUsers/login", values);
        console.log(res.data);
        if (res.status == 200 && res.data.err_code == 0) {
          let result = await userPinia.myLogin(res.data.userData);
          if (result.err_code == 0) {
            iconLoading.value = false;
            VueRouter.push({
              path: "/home",
            });
          }
        } else {
          console.log("登录失败");
          message.error(res.data.message);
          iconLoading.value = false;
        }
      } else {
        message.error("验证码输入错误");
        iconLoading.value = false;
      }
    };

    //错误处理
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    // 判断登录按钮
    const disabled = computed(() => {
      return !(
        formState.account &&
        formState.password &&
        formState.captchaInput
      );
    });

    // 获取验证码
    const setCaptcha = async () => {
      const res = await request.get("/api/svg/captcha");
      formState.captchaIMG = res.data.img;
      formState.text = res.data.text;
    };
    setCaptcha();

    onMounted(() => {
      let userState = localStorage.getItem("piniaUserState");
      console.log(userState);
    });

    return {
      formState,
      onFinish,
      onFinishFailed,
      disabled,
      setCaptcha,
      iconLoading,
    };
  },
});
</script>
<style lang="less" scoped>
.loginPage {
  width: 100vw;
  height: 100vh;
  padding-top: 240px;
  .loginBoxContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .login-form {
    width: 400px;
  }

  .login-title {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 10px;
  }

  .hei45 {
    height: 45px;
  }
  .captchaIMG {
    cursor: pointer;
  }
}
</style>
