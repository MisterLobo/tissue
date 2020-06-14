export function getCreatedIssue (state) {
  return state.issue
}
export function getIssueThread (state) {
  return state.issueThread
}
export function getThreadComments (state) {
  return state.comments
}
export function getComment (state) {
  return state.comment
}
export function getCommentById (state, id) {
  return state.comments.filter((v) => v.id === id)[0]
}
