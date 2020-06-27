import axios from 'axios'
import { SessionStorage } from 'quasar'

// const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }

/**
 * Save the newly created Project
 * @param data The Project to create
 * @returns {Promise<unknown>}
 */
export function storeProject ({ commit }, data) {
  // const auth = process.env.HAS_AUTH ? { auth: { username: process.env.AUTH_USER, password: process.env.AUTH_PASSWORD } } : null
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  return axios.post('/api/user/projects', { project: data }, { headers: { common: headers } }).then(r => {
    const rddd = r.data.data
    // console.log(rddd)
    const proj = rddd.p
    // console.log(proj)
    const dat = proj
    dat.label = data.title
    dat.value = data.slug
    dat.id = proj.id
    // console.log(dat)
    // console.log(data)
    commit('setProject', dat)
    return new Promise(resolve => resolve(dat))
  }).catch(r => {
    // console.log(JSON.parse(JSON.stringify(r)))
    return new Promise((resolve, reject) => reject(r.response.data.error.message))
  })
}

/**
 * Store the project state for viewing
 * @param commit
 * @param proj
 */
export function viewProject ({ commit }, proj) {
  // console.log('viewProject: ', proj)
  commit('setViewProject', proj)
}

/**
 * Get a project for authenticated user
 * @param name The name of project
 */
export function fetchProject ({ commit }, name) {
  commit('setProject', name)
}

/**
 * Get projects for authenticated user
 * @returns {Promise<AxiosResponse<any> | void>}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function fetchProjects ({ commit }) {
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  return axios.get('/api/user/projects', { headers: { common: headers } }).then(r => {
    // console.log(r)
    const projs = r.data.data
    const { projects } = projs
    console.log(projects)
    commit('setProjects', projects)
    return new Promise(resolve => resolve(projects))
  }).catch(e => console.error(e))
}

/**
 * Get project for a user
 * @param owner Name of owner
 * @param name Name of project
 * @returns {Promise<AxiosResponse<any> | void>}
 */
export function getProject ({ commit }, { owner, name }) {
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return axios.get(`/api/proj/${owner}/${name}`, { headers: { common: headers } }).then(r => {
    console.log(r)
    commit('setProject', name)
  }).catch(e => console.error(e))
}

/**
 * Get projects for a user
 * @param owner Name of owner
 * @returns {Promise<AxiosResponse<any> | void>}
 */
export function getProjects ({ commit }, owner) {
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  return axios.get(`/api/users/${owner}/projects`, { headers: { common: headers } }).then(r => {
    // console.log(r)
    const projs = r.data.data
    // console.log(projs)
    commit('setProjects', projs)
  }).catch(e => console.error(e))
}
