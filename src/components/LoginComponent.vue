<template>
  <div class="self-center">
    <q-btn icon="mdi-github" @click="AuthProvider('github')">Log in with Github</q-btn>
    <q-btn icon="mdi-google" @click="AuthProvider('google')">Log in with Google</q-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'LoginComponent',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState'
    }),
    ...mapActions({
      newUser: 'user/storeUser'
    })
  },
  methods: {
    authenticate (data) {
      this.$store.dispatch('user/authenticateUser', data).then((r) => {
        console.log(r)
        this.$router.push('/').catch(e => console.log({ e }))
      }).catch(e => console.error(e))
    },
    AuthProvider (provider) {
      if (process.env.DEV) {
        console.log(process.env.NODE_ENV)
        console.log(process.env.AUTH_API_URL)
        console.log(process.env.GITHUB_CALLBACK_URL)
        console.log(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
      }
      this.$auth.authenticate(provider).then(response => {
        this.SocialLogin(provider, response)
      }).catch(err => {
        console.error(err)
      })
    },

    SocialLogin (provider, response) {
      this.$store.dispatch('user/authenticateSocialUser', { provider, preAuth: response }).then((u, a) => {
        console.log(u)
        // this.authenticate(provider, { email: u.email, name: u.name, token: u.token })
        this.$store.dispatch('user/storeUser', u).catch(e => console.error(e))
        const data = {
          email: u.email,
          name: u.name,
          accessToken: a,
          token: u.token
        }
        this.authenticate(data)
        // this.$router.push('/').catch(e => console.log({ e }))
      }).catch(e => console.error(e))
    }

  }
}
</script>
