<template>
  <q-page padding>
    <div class="row items-center justify-evenly" style="height: 30vh;">
      <router-view />
    </div>
  </q-page>
</template>

<script>
export default {
  preFetch ({ store, /* currentRoute, previousRoute, */ redirect }) {
    // fetch data, validate route and optionally redirect to some other route...

    // ssrContext is available only server-side in SSR mode

    // No access to "this" here as preFetch() is called before
    // the component gets instantiated.

    // Return a Promise if you are running an async job
    // Example:
    if (store.getters['user/isAuthenticated'] === false && store.getters['user/isChecked'] === false) {
      console.log('second')
      console.log('Not logged in. Redirecting ..')
      return redirect('/login')
    }
    // return store.dispatch('fetchItem', currentRoute.params.id)
  },
  name: 'IssuesPage'
}
</script>
