import axios from "axios";

// 创建请求实例
const request = axios.create({
  // baseURL: 'http:192.168.1.4:3001',
  timeout: 6000
});

// 修改实例默认值
// request.defaults.headers.common['Authorization'] = AUTH_TOKEN || '';
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截
request.interceptors.request.use((config) => {
  // console.log("请求拦截配置" + config);
  // 返回配置
  return config;
})

// 响应拦截
request.interceptors.response.use((res) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return res;
}, (err) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return Promise.reject(err);
})

// 导出实例
export default request;