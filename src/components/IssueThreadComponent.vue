<template>
  <div class="justify-center" style="width: 70%">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h3 q-mb-xs">{{ getProject.title }} / Issues</div>
        <div class="text-h5 q-mb-xs">{{ issue.title }} #{{ issue.id }} <q-badge :label="issue.status" color="green" align="middle" /> </div>
        <q-chip v-bind:key="label.label" v-for="label in labels" color="bug" text-color="black">
          {{ label.label }}
        </q-chip>
        <q-timeline color="secondary">

          <!--<q-timeline-entry avatar="https://cdn.quasar.dev/img/avatar5.jpg">
            <template v-slot:subtitle>
              {{ thread.description.updatedOn.toDateString() }}
            </template>

            <comment-component :author="getUser.name" :data="thread.description"></comment-component>
          </q-timeline-entry>-->

          <q-timeline-entry v-for="cmt in comments" v-bind:key="cmt.id" :avatar="cmt.author.avatar">
            <template v-slot:subtitle>
              {{ parseDate(cmt.updated_at) }} by {{ cmt.author.display_name }}
            </template>

            <comment-component :data="cmt"></comment-component>
          </q-timeline-entry>
        </q-timeline>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
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
                v-model="comment.body"
                type="textarea"
                label="Leave a comment"
              />
            </q-tab-panel>

            <q-tab-panel name="preview">
              <div class="text-h6">Preview</div>
              <q-markdown v-if="comment.body"
                          :src="comment.body"
                          class="fit bordered q-pa-sm wrap-sm"
              >
              </q-markdown>
              <span class="text-italic" v-else>Nothing to preview</span>
            </q-tab-panel>
          </q-tab-panels>
          <q-uploader
            ref="attachments"
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
import { mapGetters } from 'vuex'
// import { createComment } from '../models'
import CommentComponent from './CommentComponent'
import { Cookies, SessionStorage } from 'quasar'

export default {
  name: 'IssueThreadComponent',
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
  components: {
    CommentComponent
  },
  created () {
    this.apiUrl = process.env.API_URL
    this.issueAttachmentsEndpoint = `${this.apiUrl}/api/upload`
    this.issue = this.getIssue
    this.author = this.getAuthor
    this.thread = this.getThread
    this.comments = this.getComments
    this.project = this.getProject
    const { labels, assignees, participants } = this.getMeta
    this.labels = labels
    this.assignees = assignees
    this.participants = participants
    // console.log(this.issue, this.author, this.thread, this.comments, this.project)
  },
  data: () => ({
    tab: 'write',
    issue: null,
    thread: null,
    author: null,
    project: null,
    comments: [],
    comment: {
      body: ''
    },
    labels: [],
    assignees: [],
    participants: [],
    files: null,
    uploadProgress: [],
    uploading: null,
    apiUrl: 'process.env.API_URL',
    issueAttachmentsEndpoint: ''
  }),
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState',
      getIssue: 'issue/getCreatedIssue',
      getThread: 'issue/getIssueThread',
      getComments: 'issue/getThreadComments',
      getProject: 'project/getProject',
      getAuthor: 'issue/getAuthor',
      getMeta: 'issue/getMeta'
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
    getCommenter (a) {
      const auth = Object.assign({}, a)
      return auth
    },
    parseDate (d) {
      // console.log(d)
      return new Date(d).toDateString()
    },
    factoryFn (files) {
      this.files = files
      // returning a Promise

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
      // console.log(file)
      // console.log(data)
      this.comment.body += `\n[${file.name}](${data})`
    },
    onSubmit () {
      const com = this.comment.body // createComment({ authorId: this.getUser.id, authorName: this.getUser.name, body: this.comment.body, upVotes: 0, downVotes: 0, myVote: '', createdOn: new Date(), updatedOn: new Date() })
      // console.log(com)
      // this.thread.comments.push(createComment({ id: this.getComments.length + 1, authorId: this.user.id, body: this.comment.body, createdOn: new Date(), updatedOn: new Date() }))
      this.$store.dispatch('issue/storeComment', { owner: this.author.display_name, project: this.project.slug, issueId: this.issue.id, com }).then(r => {
        // console.log(r)
        this.comments = r.comments
        // console.log(this.comments)
      })
      // const thd = Object.create(this.thread)
      // this.$store.dispatch('issue/storeThread', Object.assign({}, thd))
      // this.thread.comments = this.getComments
      // console.log(this.thread)
      this.comment.body = ''
      this.$refs.attachments.reset()
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
    }
  }
}
</script>
