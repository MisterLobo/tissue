import { SessionStorage } from 'quasar'

// eslint-disable-next-line @typescript-eslint/require-await
export default async ({ store, redirect, urlPath, router }) => {
  console.log(urlPath)
  // if (urlPath === '/login') return
  console.log('first')
  if (urlPath.toString().includes('/auth')) return
  if (store.getters['user/isAuthenticated'] !== true) {
    const userToken = SessionStorage.getItem('user_token')
    if (userToken !== undefined && userToken !== null && userToken !== '') {
      store.dispatch('user/check', true)
      console.log(userToken)
      const provider = SessionStorage.getItem('auth_provider')
      store.dispatch('user/fetchUser', { provider, userToken }).then(() => {
        store.dispatch('user/check', false)
        console.log(urlPath)
        router.push('/')
      })
    }
    else {
      if (urlPath === '/login') return
      console.log('Not logged in. Redirecting')
      await redirect('/login')
    }
  }
}
