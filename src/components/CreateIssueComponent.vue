<template>
  <div class="justify-center" style="width: 70%">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6 q-mb-xs">{{ issue ? (issue.title ? issue.title : 'New Issue') : 'New Issue' }}{{ project ? ` - ${project.title}` : '' }}</div>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="issue.title"
            label="Title"
          />
          <!--<q-select
            filled
            v-model="project"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            label="Select Project"
            :value="project ? project.label : ''"
            :options="projects"
            @filter="filterFn"
            @filter-abort="abortFilterFn"
            hint="Select a Project to create an issue for"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>-->
          <q-select
            filled
            v-model="issue.labels"
            multiple
            :options="labels"
            use-chips
            stack-label
            label="Labels"
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            filled
            v-model="issue.assignees"
            multiple
            :options="assignees"
            :option-label="opt => Object(opt) === opt && 'name' in opt ? (opt.name === getUser.name ? `Assign yourself (${opt.name})` : opt.name) : '- Null -'"
            :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : null"
            emit-value
            map-options
            use-chips
            stack-label
            label="Assignees"
          />
          <!--<q-select
            filled
            v-model="issue.severity"
            :options="severity"
            label="Severity"
          />-->
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
          >
            <q-tab name="write" label="Write" />
            <q-tab name="preview" label="Preview" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="write">
              <div class="text-h6">Write a comment (Markdown is supported)</div>
              <q-input
                filled
                v-model="issue.body"
                type="textarea"
                label="Leave a comment"
              />
            </q-tab-panel>

            <q-tab-panel name="preview">
              <div class="text-h6">Preview</div>
              <q-markdown v-if="issue.body"
                          :src="issue.body"
                          class="fit bordered q-pa-sm wrap-sm"
              >
              </q-markdown>
              <span class="text-italic" v-else>Nothing to preview</span>
            </q-tab-panel>
          </q-tab-panels>
          <q-uploader
            label="Attach files"
            auto-upload
            :url="issueAttachmentsEndpoint"
            multiple
            :factory="factoryFn"
            @uploaded="fileUploadFinished"
          />
          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import { createIssue, createProject, createLabel } from '../models'
import { mapGetters } from 'vuex'
import { Cookies, SessionStorage } from 'quasar'

let dummyProjects = [
  createProject({
    id: 1,
    label: 'Google',
    value: 'google',
    description: 'Search engine',
    owner: 1,
    ownerType: 'user'
  }),
  createProject({
    id: 2,
    label: 'Facebook',
    value: 'facebook',
    description: 'Social media',
    owner: 1,
    ownerType: 'user'
  }),
  createProject({
    id: 3,
    label: 'Twitter',
    value: 'twitter',
    description: 'Quick updates',
    owner: 1,
    ownerType: 'user'
  }),
  createProject({
    id: 4,
    label: 'Apple',
    value: 'apple',
    description: 'iStuff',
    owner: 1,
    ownerType: 'user'
  })
]

export default {
  name: 'CreateIssueComponent',
  // props: ['project'],
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
    this.issueAttachmentsEndpoint = `${this.apiUrl}/api/upload`
    /* this.assignees = [
      {
        label: `Assign yourself (${this.getUser.name})`,
        value: this.getUser.id
      }
    ] */
    dummyProjects = [
      createProject({
        id: 1,
        label: 'Google',
        value: 'google',
        description: 'Search engine',
        owner: this.getUser.id,
        ownerType: 'user'
      }),
      createProject({
        id: 2,
        label: 'Facebook',
        value: 'facebook',
        description: 'Social media',
        owner: this.getUser.id,
        ownerType: 'user'
      }),
      createProject({
        id: 3,
        label: 'Twitter',
        value: 'twitter',
        description: 'Quick updates',
        owner: this.getUser.id,
        ownerType: 'user'
      }),
      createProject({
        id: 4,
        label: 'Apple',
        value: 'apple',
        description: 'iStuff',
        owner: this.getUser.id,
        ownerType: 'user'
      })
    ]
    this.project = this.getProject
    this.assignees = this.project.members
    console.log(this.project)
  },
  mounted () {
    // this.$o.lang.set('en-us')
  },
  data: () => ({
    tab: 'write',
    markdown: null,
    name: null,
    model: false,
    owner: null,
    issue: {
      title: 'New Issue',
      description: '',
      body: '',
      labels: [],
      assignees: [],
      severity: '',
      projectId: 0
    },
    severity: [
      {
        label: 'Normal',
        value: 1
      },
      {
        label: 'Urgent',
        value: 2
      },
      {
        label: 'Critical',
        value: 3
      }
    ],
    labels: [
      createLabel({
        label: 'bug',
        value: 'bug',
        description: 'Something isn\'t working',
        color: 'bug'
      }),
      createLabel({
        label: 'feature',
        value: 'feature',
        description: 'Request for new functionality',
        color: 'feature'
      }),
      createLabel({
        label: 'documentation',
        value: 'documentation',
        description: 'Improvements or additions to documentation',
        color: 'documentation'
      }),
      createLabel({
        label: 'wont fix',
        value: 'wont fix',
        description: 'This will not be worked on',
        color: 'wont fix'
      }),
      createLabel({
        label: 'question',
        value: 'question',
        description: 'Further information is requested',
        color: 'question'
      }),
      createLabel({
        label: 'dependencies',
        value: 'dependencies',
        description: 'Pull requests that update a dependency file',
        color: 'dependencies'
      }),
      createLabel({
        label: 'duplicate',
        value: 'duplicate',
        description: 'The issue or pull request already exists',
        color: 'duplicate'
      }),
      createLabel({
        label: 'enhancement',
        value: 'enhancement',
        description: 'New feature or request',
        color: 'enhancement'
      }),
      createLabel({
        label: 'good first issue',
        value: 'good first issue',
        description: 'Good for newcomers',
        color: 'good first issue'
      }),
      createLabel({
        label: 'help wanted',
        value: 'help wanted',
        description: 'Extra attention is needed',
        color: 'help wanted'
      }),
      createLabel({
        label: 'invalid',
        value: 'invalid',
        description: 'This doesn\'t seem right',
        color: 'invalid'
      })
    ],
    assignees: [],
    project: null,
    projects: null,
    files: null,
    uploadProgress: [],
    uploading: null,
    apiUrl: 'process.env.API_URL',
    issueAttachmentsEndpoint: ''
  }),
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState',
      getProject: 'project/getProject'
    }),
    isUploading () {
      return this.uploading !== null
    },

    canUpload () {
      return this.files !== null
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryFn (files) {
      // returning a Promise
      // console.log(Cookies.get('XSRF-TOKEN'))
      return new Promise((resolve) => {
        // simulating a delay of 2 seconds
        setTimeout(() => {
          resolve({
            url: this.issueAttachmentsEndpoint,
            headers: [
              { name: 'X-XSRF-TOKEN', value: `${Cookies.get('XSRF-TOKEN')}` },
              { name: 'Authorization', value: `Bearer ${SessionStorage.getItem('access_token')}` },
              { name: 'laravel_session', value: `${Cookies.get('laravel_session')}` }
            ]
          })
        }, 100)
      })
    },
    fileUploadFinished (r) {
      const { files, xhr } = r
      const response = JSON.parse(xhr.response)
      const file = files[0]
      const { data } = response
      console.log(file)
      console.log(data)
      this.issue.body += this.issue.body.endsWith('\n') ? `[${file.name}](${data})` : `\n[${file.name}](${data})\n`
    },
    filterFn (val, update) {
      // call abort() at any time if you can't retrieve data somehow
      if (this.projects !== null) {
        update()
        return
      }
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.projects = dummyProjects
          }
          else {
            const needle = val.toLowerCase()
            this.projects = dummyProjects.filter(v => v.toString().toLowerCase().includes(needle))
          }
        })
      }, 1000)
    },
    abortFilterFn () {
      console.log('delayed filter aborted')
    },
    onSubmit () {
      if (this.project === null) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to select a project this issue is for'
        })
      }
      else {
        const issue = Object.assign({}, this.issue, { status: 'open' })
        // console.log(this.project)
        const data = createIssue(issue)
        // eslint-disable-next-line @typescript-eslint/camelcase
        data.participants = [this.getUser.id]
        this.$store.dispatch('issue/storeIssue', { data, owner: this.getUser.display_name, projectName: this.project.slug }).then(({ issue, thread, project }) => {
          console.log(issue)
          console.log(thread)
          console.log(project)
          this.$store.dispatch('project/viewProject', project)
          this.$router.push({ name: 'issue-thread', params: { project: this.project.slug, issueId: issue.id } })
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
        })
      }
    },

    onReset () {
      this.name = null
      this.age = null
      this.accept = false
    },
    cancelFile (index) {
      this.uploadProgress[index] = {
        ...this.uploadProgress[index],
        error: true,
        color: 'orange-2'
      }
    },

    updateFiles (files) {
      this.files = files
      this.uploadProgress = (files || []).map(file => ({
        error: false,
        color: 'green-2',
        percent: 0,
        icon: file.type.indexOf('video/') === 0
          ? 'movie'
          : (file.type.indexOf('image/') === 0
            ? 'photo'
            : (file.type.indexOf('audio/') === 0
              ? 'audiotrack'
              : 'insert_drive_file'
            )
          )
      }))
    },

    upload () {
      clearTimeout(this.uploading)

      const allDone = this.uploadProgress.every(progress => progress.percent === 1)

      this.uploadProgress = this.uploadProgress.map(progress => ({
        ...progress,
        error: false,
        color: 'green-2',
        percent: allDone === true ? 0 : progress.percent
      }))

      this.__updateUploadProgress()
    },

    __updateUploadProgress () {
      let done = true

      this.uploadProgress = this.uploadProgress.map(progress => {
        if (progress.percent === 1 || progress.error === true) {
          return progress
        }

        const percent = Math.min(1, progress.percent + Math.random() / 10)
        const error = percent < 1 && Math.random() > 0.95

        if (error === false && percent < 1 && done === true) {
          done = false
        }

        return {
          ...progress,
          error,
          color: error === true ? 'red-2' : 'green-2',
          percent
        }
      })

      this.uploading = done !== true
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ? setTimeout(this.__updateUploadProgress, 300)
        : null
    }
  }
}
</script>
