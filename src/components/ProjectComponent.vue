<template>
  <div class="justify-center" style="width: 50vw">
    <q-toolbar>
      <q-toolbar-title>
        <div class="text-h4" v-if="$q.screen.gt.sm && project">{{ project.owner.display_name }} / {{ title }}</div>
        <div class="text-subtitle1" v-if="!$q.screen.gt.sm && project">{{ project.owner.display_name }} / {{ title }}</div>
        <div class="text-h3" v-if="!project">
          <q-spinner-tail
            color="primary"
            size="2em"
          />
          <q-tooltip :offset="[0, 8]">QSpinnerTail</q-tooltip>
        </div>
      </q-toolbar-title>
      <q-space v-if="$q.screen.gt.sm" />
      <q-btn flat round dense icon="group_add" />
    </q-toolbar>
    <q-toolbar inset>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="project" label="Project" />
        <q-tab name="issues" label="Issues" />
        <q-tab name="settings" label="Settings" />
      </q-tabs>
    </q-toolbar>
    <q-card class="my-card" flat>
      <q-card-section>
        <!--<q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
        >
          <q-tab name="project" label="Project" />
          <q-tab name="issues" label="Issues" />
        </q-tabs>-->

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="project">
            <div class="row">
              <div v-if="$q.screen.gt.sm" class="text-h5">{{ title || 'Project Name' }}</div>
              <div v-if="!$q.screen.gt.sm" class="text-subtitle1">{{ title || 'Project Name' }}</div>
              <q-space />
              <div class="text-h5 float-right q-gutter-md">
                <q-btn label="Edit Project" color="green" v-if="$q.screen.gt.sm" />
                <q-btn icon="edit" round flat v-if="!$q.screen.gt.sm" />
                <q-btn icon="settings" round flat @click="tab = 'settings'" />
              </div>
            </div>
            <div class="row">
              <div class="text-h5 text-italic">{{ description || 'No description provided' }}</div>
            </div>
            <div class="row">
              <div class="text-h5 text-italic">{{ website }}</div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="issues">
            <div class="row">
              <div class="text-h3">Issues</div>
              <q-space />
              <div class="text-h3">
                <q-btn label="New Issue" color="green" @click="newIssue" />
              </div>
            </div>
            <q-item v-for="issue in issues" v-bind:key="issue.id">
              <q-item-section avatar top>
                <q-icon name="account_tree" color="black" size="34px" />
              </q-item-section>

              <q-item-section top class="col-2 gt-sm">
                <q-item-label class="q-mt-sm">GitHub</q-item-label>
              </q-item-section>

              <q-item-section top>
                <!--<q-item-label lines="1">
                  <span class="text-weight-medium">[owner/project]</span>
                  <span class="text-grey-8"> - Description</span>
                </q-item-label>-->
                <q-item-label caption lines="1">
                  @{{ issue.author.display_name }} in #{{ issue.id }}: > {{ issue.title }}
                </q-item-label>
                <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase" @click="viewIssueThread(issue)">
                  <span class="cursor-pointer">Open issue</span>
                </q-item-label>
              </q-item-section>

              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <!--<q-btn class="gt-xs" size="12px" flat dense round icon="delete" />-->
                  <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                  <q-btn size="12px" flat dense round icon="more_vert" />
                </div>
              </q-item-section>
            </q-item>
            <q-item v-if="issues.length === 0">
              <div class="text-center text-italic">No issues</div>
            </q-item>
          </q-tab-panel>
          <q-tab-panel name="settings">
            <project-settings-component></project-settings-component>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProjectSettingsComponent from './ProjectSettingsComponent'
// import { createProject } from '../models'

export default {
  name: 'ProjectComponent',
  components: { ProjectSettingsComponent },
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
  created () {
    this.apiUrl = process.env.API_URL
    this.title = this.getProject.title
    this.slug = this.getProject.slug
    this.description = this.getProject.description
    this.website = this.getProject.website
    this.$store.dispatch('issue/fetchIssues', { owner: this.getProject.owner.display_name, proj: this.slug }).then(({ owner, project, list }) => {
      console.log(owner)
      console.log(project)
      console.log(list)
      this.owner = owner
      this.project = project
      this.issues = list
    })
  },
  mounted () {
    // this.$o.lang.set('en-us')
  },
  data: () => ({
    tab: 'project',
    title: '',
    slug: '',
    description: '',
    website: '',
    // eslint-disable-next-line @typescript-eslint/camelcase
    public_project: true,
    apiUrl: 'process.env.API_URL',
    owner: null,
    project: null,
    issues: []
  }),
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState',
      getProject: 'project/getProject'
    }),
    getProjectSlug: () => {
      return this.title.toString().toLowerCase()
    }
  },
  methods: {
    onChangedTitle (v) {
      // console.log(v)
      setTimeout(() => {
        this.slug = v.toString().trimStart().toLocaleLowerCase().replace(' ', '-')
      }, 100)
    },
    onBlurTitle (v) {
      // console.log(v)
      setTimeout(() => {
        this.slug = v.toString().trimStart().toLocaleLowerCase().replace(' ', '-')
      }, 100)
    },
    newIssue () {
      this.$router.push({ name: 'new-project-issue', params: { project: this.title } })
    },
    viewIssueThread (iss) {
      const issue = Object.assign(iss)
      // console.log(issue)
      this.$store.dispatch('issue/fetchIssue', { owner: issue.author.display_name, project: issue.project.slug, id: issue.id }).then(({ issue, thread, user, project }) => {
        console.log(issue, thread, user, project)
        this.$store.dispatch('issue/viewIssueThread', { issue, thread, user, project }).then(r => {
          if (r === true) this.$router.push({ name: 'issue-thread', params: { issueId: issue.id } })
        })
      })
      // console.log(issue)
    },
    onSubmit () {
      if (this.project === null) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Form is not valid'
        })
      }
      else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
        const p = {
          // eslint-disable-next-line @typescript-eslint/camelcase
          title: this.title,
          slug: this.slug,
          description: this.description,
          website: this.website,
          // eslint-disable-next-line @typescript-eslint/camelcase
          is_public: this.public_project
        }
        // const project = createProject(p)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.$store.dispatch('project/storeProject', p).then(r => {
          // console.log(r)
          this.$router.push({ name: 'project-view', params: { project: p.slug } })
        }).catch(e => console.error(e))
      }
    },

    onReset () {
      this.name = null
      this.age = null
      this.accept = false
    }

  }
}
</script>
<test lang="jest">
  describe('test 1', () => {
    it('Prints Hello World!', () => {
      const isTrue = true
      expect(isTrue).toBe(true)
    })
  })
</test>
