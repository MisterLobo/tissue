import { createComment } from 'src/models'

export function setIssue (state, data) {
  data.id = 1
  state.issue = data
  // state.issues.pop() // to maintain only one item in the array
  state.issues.push(data)
}
export function setThread (state, data) {
  state.issueThread = data
}
export function pushComment (state, data) {
  state.comments.push(data)
}
export function setComment (state, data) {
  state.comment = data
}
export function setVote (state, data) {
  const { vote, voter, commentId } = data
  // let cmt = state.issueThread.comments.filter((v, i, a) => v.id === commentId)[0]
  const cmt = state.comments.filter((v) => v.id === commentId)
  const comment = cmt.length > 0 ? cmt[0] : null
  if (comment) {
    if ((comment.hasVoted === false || vote !== comment.myVote) && vote !== '') {
      if (vote === 'up') {
        comment.upVotes += 1
        if (comment.myVote === 'down') comment.downVotes -= 1
      }
      else /* if (vote === 'down') */ {
        comment.downVotes += 1
        if (comment.myVote === 'up') comment.upVotes -= 1
      }
      comment.hasVoted = true
      comment.myVote = vote
      if (comment.voters) {
        const myVote = comment.voters.filter((v) => v.voterId === voter)
        console.log(myVote)
        const first = myVote.length > 0 ? myVote[0] : null
        console.log(first)
        if (first !== null) {
          first.vote = vote
        }
        else comment.voters.push({ voterId: voter, vote })
      }
      else {
        comment.voters = [
          {
            voterId: voter,
            vote
          }
        ]
      }
      state.comments.filter((v) => v.id === commentId)[commentId] = createComment(comment)
    }
  }
  // state.comment.upVotes = state.comment.hasVoted === false ? (vote === 'up' ? state.comment.upVotes + 1 : state.comment.upVotes) : state.comment.upVotes
  // state.comment.downVotes = vote === 'down' ? state.comment.downVotes + 1 : state.comment.downVotes
  // state.comment.hasVoted = vote !== ''
  // state.comment.myVote = vote
}
