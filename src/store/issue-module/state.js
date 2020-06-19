export default function () {
  return {
    issue: null,
    issues: [],
    issueThread: {
      issueId: 0,
      comments: []
    },
    comments: [],
    labels: [],
    assignees: [],
    participants: [],
    comment: null,
    voted: false,
    vote: null,
    author: null,
    project: null,
    myvotes: []
  }
}
