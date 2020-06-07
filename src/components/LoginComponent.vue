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

    AuthProvider (provider) {
      if (process.env.DEV) {
        console.log(process.env.NODE_ENV)
        console.log(process.env.AUTH_API_URL)
        console.log(process.env.GITHUB_CALLBACK_URL)
      }
      this.$auth.authenticate(provider).then(response => {
        this.SocialLogin(provider, response)
      }).catch(err => {
        console.log({ err: err })
      })
    },

    SocialLogin (provider, response) {
      this.$http.post(process.env.AUTH_API_URL + provider, response).then(response => {
        console.log(response.data)
        const user = response.data
        this.$store.dispatch('user/storeUser', user)
        const userstate = this.getUser
        console.log(userstate)
        this.$router.push('/')
      }).catch(err => {
        console.log({ err: err })
      })
    }

  }
}
</script>
