// import something here
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSocialauth from 'vue-social-auth'

Vue.use(VueAxios, axios)
Vue.use(VueSocialauth, {

  providers: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      redirectUri: process.env.GITHUB_CALLBACK_URL // Your client app URL
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      redirectUri: process.env.GOOGLE_AUTH_CALLBACK // Your client app URL
    }
  }
})

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async (/* { app, router, Vue } */) => {
  //
}
