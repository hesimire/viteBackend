import { defineStore } from 'pinia'
import { useRoute, useRouter } from "vue-router";

export const userStore = defineStore('userPinia', {
  state: () => {
    return {
      user: {},
      isLogin: false
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {

    myLogin(userInfo) {
      this.user = userInfo;
      this.isLogin = true;
      return Promise.resolve({
        err_code:0
      })
    },

    signOut() {
     this.$reset();
     localStorage.removeItem('piniaUserState')
    }

  },
})