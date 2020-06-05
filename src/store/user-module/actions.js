export function storeUser ({ commit }, user) {
  commit('setUserState', user)
}
