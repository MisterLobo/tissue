<template>
  <div class="justify-center" style="width: 50%">
    <q-card class="my-card">
      <q-card-section>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
        >
          <q-tab name="create" label="Create" />
          <q-tab name="import" label="Import" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="create">
            <div class="text-h6">Create New Project</div>
            <q-form
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="title"
                label="Title"
                :prefix="`${getUser.nickname} /`"
                maxlength="20"
                @input="onChangedTitle"
              />
              <q-input
                filled
                v-model="slug"
                label="Slug"
              />
              <q-input
                filled
                v-model="website"
                label="Website"
              />
              <q-input
                filled
                v-model="description"
                label="Description"
                type="textarea"
              />
              <q-checkbox v-model="public_project" label="Public Project" />
              <div>
                <q-btn label="Submit" type="submit" color="primary"/>
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="import">
            <div class="text-h6">Import Project</div>
            <div class="text-center text-uppercase">COMING SOON</div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
// import { createProject } from '../models'
import { mapGetters } from 'vuex'
// import { createProject } from '../models'

export default {
  name: 'CreateProjectComponent',
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
  },
  mounted () {
    // this.$o.lang.set('en-us')
  },
  data: () => ({
    tab: 'create',
    title: '',
    slug: '',
    description: '',
    website: '',
    // eslint-disable-next-line @typescript-eslint/camelcase
    public_project: true,
    apiUrl: 'process.env.API_URL'
  }),
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState'
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
        /* this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        }) */
        const p = {
          owner: this.getUser.nickname,
          // eslint-disable-next-line @typescript-eslint/camelcase
          owner_id: this.getUser.id,
          ownerType: 'user',
          title: this.title,
          slug: this.slug,
          label: this.title,
          value: this.slug,
          description: this.description,
          website: this.website,
          // eslint-disable-next-line @typescript-eslint/camelcase
          is_public: this.public_project
        }
        // const project = createProject(p)
        this.$store.dispatch('project/storeProject', p).then(r => {
          console.log(r)
          // this.$store.dispatch('project/viewProject', p)
          this.$router.push({ name: 'project-view', params: { project: p.slug } })
        }).catch(e => {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: e
          })
        })
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
