<template>
  <q-layout view="hHh LpR lFr">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Issue Tracker
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat icon="add" v-if="$q.screen.gt.sm">
            <q-tooltip>Create</q-tooltip>
            <q-menu anchor="bottom right" self="top right" :offset="[0, 20]">
              <q-item clickable>
                <q-item-section>
                  <q-item-label>Project</q-item-label>
                  <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label>Team</q-item-label>
                  <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label>Issue</q-item-label>
                  <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                </q-item-section>
              </q-item>
            </q-menu>
          </q-btn>
          <q-btn round dense flat icon="mdi-cart" v-if="$q.screen.gt.sm" :to="{ name: 'myCart' }" exact>
            <q-tooltip>My Cart</q-tooltip>
          </q-btn>
          <q-btn round dense flat icon="message" v-if="$q.screen.gt.sm" :to="{ name: 'chat' }" exact>
            <q-tooltip>Messages</q-tooltip>
          </q-btn>
          <div>
            <q-btn round dense flat icon="notifications" v-if="$q.screen.gt.sm" @click="right = !right">
              <q-badge color="red" text-color="white" floating>
                2
              </q-badge>
              <q-tooltip>Notifications</q-tooltip>
            </q-btn>
          </div>
          <q-space />
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu anchor="bottom right" self="top right" :offset="[0, 20]">
              <q-item clickable>
                <q-item-section>My Profile</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>My Projects</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>My Teams</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Account Settings</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Log Out</q-item-section>
              </q-item>
            </q-menu>
          </q-btn>
          <!--<q-btn v-else :to="{ name: 'login' }" outline label="Log in" color="green-10" class="q-ml-md full-width"></q-btn>-->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <q-list class="absolute-top" style="height: 50px">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Notifications</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-scroll-area style="height: calc(100% - 50px); margin-top: 50px">

        <q-list v-if="play.scroll">
          <q-slide-item v-for="n in 100" :key="`link-${n}`" @left="onLeft">
            <template v-slot:left>
              <q-icon name="done" />
            </template>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="bluetooth" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Item {{ n }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState'
    }),
    ...mapActions({
      newUser: 'user/storeUser'
    })
  },
  data: () => ({
    lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    left: false,
    right: false,
    play: {
      header: true,
      footer: true,
      left: false,
      right: false,
      scroll: true
    }
  })
}
</script>
