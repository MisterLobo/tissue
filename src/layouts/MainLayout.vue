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
              <q-item clickable @click="newOrg">
                <q-item-section>
                  <q-item-label>Organization</q-item-label>
                  <q-item-label caption lines="2">Organization can contain Projects shared among its members</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable @click="newProject">
                <q-item-section>
                  <q-item-label>Project</q-item-label>
                  <q-item-label caption lines="2">A Project is a representation of a git repository</q-item-label>
                </q-item-section>
              </q-item>
              <!--<q-item clickable @click="newIssue">
                <q-item-section>
                  <q-item-label>Issue</q-item-label>
                  <q-item-label caption lines="2">Create an Issue to start a discussion about a Project</q-item-label>
                </q-item-section>
              </q-item>-->
            </q-menu>
          </q-btn>
          <q-btn round dense flat icon="mdi-alert-circle-outline" v-if="$q.screen.gt.sm" :to="{ name: 'home' }" exact>
            <q-tooltip>Issues</q-tooltip>
          </q-btn>
          <q-btn round dense flat icon="message" v-if="$q.screen.gt.sm" :to="{ name: 'home' }" exact>
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
              <img :src="getUser.avatar">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu anchor="bottom right" self="top right" :offset="[0, 20]">
              <q-item>
                <q-item-section>
                  <span class="text-bold">Signed in as {{ getUser.name }}</span>
                  <span class="text-italic">{{ getUser.email }}</span>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Your Profile</q-item-section>
              </q-item>
              <q-item clickable @click="yourProjects">
                <q-item-section>Your Projects</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Your Teams</q-item-section>
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

    <q-drawer show-if-above v-model="right" side="right" bordered behavior="mobile">
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
    <q-dialog ref="createIssueDlg" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <q-input v-model="issue.title" label="Issue Title" />
          <q-input type="textarea" v-model="issue.description" label="Issue Description" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="OK" @click="onOKClick" />
          <q-btn color="primary" label="Cancel" @click="onCancelClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  preFetch ({ store, /* currentRoute, previousRoute, */ redirect }) {
    // fetch data, validate route and optionally redirect to some other route...

    // ssrContext is available only server-side in SSR mode

    // No access to "this" here as preFetch() is called before
    // the component gets instantiated.

    // Return a Promise if you are running an async job
    // Example:
    if (store.getters['user/isAuthenticated'] === false && store.getters['user/isChecked'] === false) {
      // console.log('second')
      console.log('Not logged in. Redirecting ..')
      return redirect('/login')
    }
    // return store.dispatch('fetchItem', currentRoute.params.id)
  },
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
    },
    issue: {
      title: '',
      description: ''
    }
  }),
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show () {
      this.$refs.createIssueDlg.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide (dlg) {
      this.$refs[dlg].hide()
    },
    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide('createIssueDlg')
      // this.$store.dispatch('issue/submitIssue', this.issue)
      this.$router.push({ name: 'new-issue' })
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide('createIssueDlg')
    },
    onLeft ({ reset }) {
      this.$q.notify('Left action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },
    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    },
    showCreateIssueDialog () {
      this.$refs.createIssueDlg.show()
    },
    yourProjects () {
      this.$router.push({ name: 'your-projects', params: { owner: this.getUser.nickname } })
    },
    newIssue () {
      this.$router.push({ name: 'new-issue' })
    },
    newProject () {
      this.$router.push({ name: 'new-project', params: { owner: this.getUser.nickname } })
    },
    newOrg () {
      //
    }
  }
}
</script>
