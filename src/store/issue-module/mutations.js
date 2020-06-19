export function setIssues (state, { list }) {
  state.issues = list
}
export function setIssue (state, data) {
  // data.id = 1
  state.issue = data
  // state.issues.pop() // to maintain only one item in the array
  // state.issues.push(data)
}
export function setThread (state, data) {
  state.issueThread = data
}
export function setAuthor (state, data) {
  state.author = data
}
export function setProject (state, data) {
  state.project = data
}
export function setComments (state, data) {
  state.comments = data
}
export function pushComment (state, data) {
  state.comments.push(data)
}
export function setComment (state, data) {
  state.comment = data
}
export function setMeta (state, { labels, assignees, participants }) {
  state.labels = labels
  state.assignees = assignees
  state.participants = participants
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setVote (state, data) {
  state.vote = data
}
export function setMyVotes (state, data) {
  data.forEach(d => {
    state.myvotes.push(d.vote)
  })
  console.log(state.myvotes)
}
