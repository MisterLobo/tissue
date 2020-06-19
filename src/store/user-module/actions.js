import axios from 'axios'
import { SessionStorage, Cookies } from 'quasar'
/*
  Save user state
 */
export function storeUser ({ commit }, user) {
  commit('setUserState', user)
}
/*
  Request csrf token to authenticate user
 */
export function authenticateUser (context, { email, name, token, accessToken }) {
  const auth = process.env.HAS_AUTH ? { auth: { username: process.env.AUTH_USER, password: process.env.AUTH_PASSWORD } } : null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return axios.get('/sanctum/csrf-cookie', auth).then(r => {
    const payload = {
      email,
      name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: accessToken,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_token: token
    }
    const xsrf = Cookies.get('XSRF-TOKEN')
    const atoken = SessionStorage.getItem('access_token')
    // console.log('atoken: ', atoken)
    // console.log('xsrf: ', xsrf)
    const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
    // return axios.post('/api/login', payload)
    // const headers = { Authorization: `Bearer ${Cookies.get('XSRF-TOKEN')}` }
    return axios.post('/api/login', payload, { headers: { common: headers } })
  }).catch(e => new Promise((resolve, reject) => reject(e)))
}
export function authenticateSocialUser (context, { provider, preAuth }) {
  const auth = process.env.HAS_AUTH === true ? { auth: { username: process.env.AUTH_USER, password: process.env.AUTH_PASSWORD } } : null
  return axios.post(`${process.env.AUTH_API_URL}${provider}`, preAuth, auth).then(r => {
    // console.log(r.data.data)
    const { user, accessToken } = r.data.data
    /* if (user.nickname === null) {
      user.nickname = user.name.toString().trim().replace(' ', '').toString()
    } */
    SessionStorage.set('auth_provider', provider)
    SessionStorage.set('user_token', user.token)
    SessionStorage.set('access_token', accessToken)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve) => resolve(user, accessToken))
  }).catch(e => new Promise((resolve, reject) => reject(e)))
}
/*
  Fetch User information using token stored in SessionStorage
 */
export function fetchUser ({ commit }, { provider, userToken }) {
  // const userToken = SessionStorage.getItem('user_token')
  // const csrfToken = Cookies.get('XSRF-TOKEN')
  const auth = process.env.HAS_AUTH === true ? { username: process.env.AUTH_USER, password: process.env.AUTH_PASSWORD } : null
  // console.log(auth)
  const headers = { Authorization: `Bearer ${userToken}` }
  return axios.post(`/social/getuser/${provider}`, { token: userToken }, { headers })
    .then(response => {
      const user = response.data
      commit('setUserState', user)
    }).catch(err => {
      console.log(err)
    })
}
export function check ({ commit }, value) {
  commit('setCheckState', value)
}
