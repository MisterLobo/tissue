export function storeIssue ({ commit }, data) {
  commit('setIssue', data)
}
export function storeThread ({ commit }, data) {
  commit('setThread', data)
}
export function storeComment ({ commit }, data) {
  commit('setComment', data)
}
export function addComment ({ commit }, data) {
  commit('pushComment', data)
}
export function addVote ({ commit }, vote) {
  commit('setVote', vote)
}
