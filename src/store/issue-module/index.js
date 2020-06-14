import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

export class CommentClass {
  id
  authorId
  body
  upVotes
  downVotes
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
