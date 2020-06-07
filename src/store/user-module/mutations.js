export function setUserState (state, data) {
  state.user = data
  state.isAuth = !!data
}
