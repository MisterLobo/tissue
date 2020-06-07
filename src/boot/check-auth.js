// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
// eslint-disable-next-line @typescript-eslint/require-await
export default async ({ store, redirect, urlPath }) => {
  console.log(urlPath)
  if (urlPath === '/login') return
  if (urlPath !== '/' && urlPath.contains('/auth')) return
  if (store.getters['user/isAuthenticated'] !== true) {
    console.log('Not logged in. Redirecting')
    await redirect('/login')
  }
}
