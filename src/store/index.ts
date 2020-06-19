import { store } from 'quasar/wrappers'
import Vuex from 'vuex'

import user from './user-module'
import issue from './issue-module'
import project from './project-module'
import comment from './comment-module'
import thread from './issuethread-module'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StoreInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown;
}

export default store(function ({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store<StoreInterface>({
    modules: {
      user,
      issue,
      project,
      comment,
      thread
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  })

  return Store
})
