export function setUserState (state, data) {
  state.user = data
  state.isAuth = !!data
}
export function setCheckState(state, value) {
  state.isChecked = value
}
