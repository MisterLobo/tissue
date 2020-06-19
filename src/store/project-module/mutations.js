export function setProject (state, proj) {
  state.project = proj
  state.projects.push(proj)
}
export function setViewProject (state, proj) {
  state.project = proj
}
export function setProjects (state, data) {
  state.projects = data
}
