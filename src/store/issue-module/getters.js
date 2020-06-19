export function getCreatedIssue (state) {
  return state.issue
}
export function getIssueThread (state) {
  return state.issueThread
}
export function getThreadComments (state) {
  const comments = []
  state.comments.forEach(c => {
    const cc = Object.assign({}, c)
    // eslint-disable-next-line @typescript-eslint/camelcase
    cc.created_at = new Date(c.created_at)
    // eslint-disable-next-line @typescript-eslint/camelcase
    cc.updated_at = new Date(c.updated_at)
    console.log(cc)
    comments.push(cc)
  })
  console.log(comments)
  return comments
}
export function getComment (state) {
  return state.comment
}
export function getCommentById (state, id) {
  return state.comments.filter((v) => v.id === id)[0]
}
export function getProject (state) {
  return state.project
}
export function getAuthor (state) {
  return state.author
}
export function getMyVotes (state) {
  return state.myvotes
}
export function getMeta (state) {
  return { labels: state.labels, assignees: state.assignees, participants: state.participants }
}
