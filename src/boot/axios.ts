import axios, { AxiosInstance } from 'axios'
import { boot } from 'quasar/wrappers'

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  axios.defaults.withCredentials = true
  axios.defaults.baseURL = process.env.API_URL
  Vue.prototype.$axios = axios
})
