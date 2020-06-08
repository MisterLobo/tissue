<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-toolbar-title @click="goHome" class="cursor-pointer">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Tissue - Issue Tracker App
        </q-toolbar-title>
        <q-bar class="bg-transparent">
          <q-space />
          <q-btn flat v-if="$q.screen.gt.sm" to="/" exact>
            Home
          </q-btn>
          <q-btn flat v-if="$q.screen.gt.sm" to="/login" exact>
            Log In
          </q-btn>
          <!--<q-btn flat v-if="$q.screen.gt.sm" :to="{ name: 'chat' }" exact>
            Sign Up
            <q-tooltip>Messages</q-tooltip>
          </q-btn>-->
        </q-bar>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      left: false,
      right: false
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>
