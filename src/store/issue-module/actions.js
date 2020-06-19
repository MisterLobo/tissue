import axios from 'axios'
import { SessionStorage } from 'quasar'
export function storeIssue ({ commit }, { data, owner, projectName }) {
  // console.log(data, projectName)
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  return axios.post(`/api/proj/${owner}/${projectName}/issues`, { issue: data }, { headers: { common: headers } }).then(r => {
    const rddd = r.data.data
    const { issue, thread } = rddd
    const { project } = issue
    // console.log(rddd)
    commit('setThread', thread)
    commit('setIssue', issue)
    commit('setComments', thread.comments)
    commit('setAuthor', issue.author)
    const labels = issue.comments ? JSON.parse(issue.comments) : []
    const assignees = issue.assignees ? JSON.parse(issue.assignees) : []
    const participants = issue.participants ? JSON.parse(issue.participants) : []
    commit('setMeta', { labels, assignees, participants })
    return new Promise(resolve => resolve({ issue, thread, project }))
  }) // .catch(e => console.error(e))
}
export function fetchIssues ({ commit }, { owner, proj }) {
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  return axios.get(`/api/proj/${owner}/${proj}/issues`, { headers: { common: headers } }).then(r => {
    const rdd = r.data.data
    // console.log(rdd)
    const { list } = rdd
    commit('setIssues', { list })
    return new Promise(resolve => resolve(rdd))
  }).catch(e => console.error(e))
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function fetchIssue ({ commit }, { owner, project, id }) {
  // console.log(owner, project, id)
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  return axios.get(`/api/proj/${owner}/${project}/issues/${id}`, { headers: { common: headers } }).then(r => {
    const rdd = r.data.data.r
    const me = r.data.data.u
    const rr = {
      issue: rdd.i,
      thread: rdd.t,
      owner: rdd.o,
      project: rdd.p
    }
    // console.log(rdd)
    commit('setMyVotes', me.votes)
    const meta = rr.issue.meta
    // console.log(meta)
    commit('setMeta', meta)
    return new Promise(resolve => resolve(rr))
  }).catch(e => console.error(e))
}
export function viewIssueThread ({ commit }, { thread, issue, owner, project }) {
  // console.log(thread, issue, owner, project)
  commit('setThread', thread)
  commit('setComments', thread.comments)
  commit('setIssue', issue)
  commit('setProject', project)
  commit('setAuthor', owner)
  return new Promise(resolve => resolve(true))
}
export function storeThread ({ commit }, data) {
  commit('setThread', data)
}
export function storeComment ({ commit }, { owner, project, issueId, vote }) {
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return axios.post(`/api/proj/${owner}/${project}/issues/${issueId}/comments`, { payload: { body: vote } }, { headers: { common: headers } }).then(r => {
    const { thread, comment } = r.data.data
    const { comments } = thread
    // commit('setThread', thread)
    commit('pushComment', comment)
    commit('setComment', comment)
    return new Promise(resolve => resolve({ thread, comments, comment }))
  })
}
export function addComment ({ commit }, data) {
  commit('pushComment', data)
}
export function addVote ({ commit }, { body, owner, project, commentId }) {
  const headers = { Authorization: `Bearer ${SessionStorage.getItem('access_token')}` }
  return axios.post(`/api/proj/${owner}/${project}/issues/comments/${commentId}/votes`, { payload: { body } }, { headers: { common: headers } }).then(r => {
    const rdd = r.data.data
    const { comment, vote } = rdd
    commit('setVote', vote)
    commit('setComment', comment)
    return new Promise(resolve => resolve(comment))
  })
}
