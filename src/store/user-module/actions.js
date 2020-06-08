import axios from 'axios'
import { SessionStorage } from 'quasar'

export function storeUser ({ commit }, user) {
  commit('setUserState', user)
}
export function fetchUser ({ commit }, { provider, token }) {
  console.log('token: ', token)
  const userToken = SessionStorage.getItem('user_token')
  return axios.post(`${process.env.API_URL}/social/getuser/${provider}`, { token: userToken })
    .then(response => {
      const user = response.data
      console.log('user: ', user)
      commit('setUserState', user)
    }).catch(err => {
      console.log({ err: err })
    })
}
export function check({ commit }, value) {
  commit('setCheckState', value)
}
