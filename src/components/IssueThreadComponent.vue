<template>
  <div class="justify-center" style="width: 70%">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h3 q-mb-xs">{{ issue.projectRef.label }} / Issues</div>
        <div class="text-h5 q-mb-xs">{{ issue.title }} #{{ issue.id }} <q-badge :label="issue.status" color="green" align="middle" /> </div>
        <q-chip v-bind:key="label.label" v-for="label in issue.labels" color="bug" text-color="black">
          {{ label.label }}
        </q-chip>
        <q-timeline color="secondary">

          <!--<q-timeline-entry avatar="https://cdn.quasar.dev/img/avatar5.jpg">
            <template v-slot:subtitle>
              {{ thread.description.updatedOn.toDateString() }}
            </template>

            <comment-component :author="getUser.name" :data="thread.description"></comment-component>
          </q-timeline-entry>-->

          <q-timeline-entry v-for="cmt in thread.comments" v-bind:key="cmt.id" avatar="https://cdn.quasar.dev/img/avatar5.jpg">
            <template v-slot:subtitle>
              {{ cmt.updatedOn.toDateString() }} by {{ cmt.authorName }}
            </template>

            <comment-component :author="cmt.authorName" :data="cmt"></comment-component>
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
import { createComment, createThread, createUser } from '../models'
import CommentComponent from './CommentComponent'

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
    this.user = createUser(this.getUser)
    this.apiUrl = process.env.API_URL
    this.issueAttachmentsEndpoint = `${this.apiUrl}/upload`
    this.issue = Object.assign({}, this.getIssue)
    // console.log(this.issue)
    const comment = createComment({ id: this.getComments.length + 1, authorId: this.user.id, authorName: this.user.name, body: this.issue.body, upVotes: 0, downVotes: 0, myVote: '', hasVoted: false, createdOn: new Date(), updatedOn: new Date() })
    this.thread = {
      id: 1,
      author: this.user.id,
      description: Object.assign({}, comment),
      status: 'unlocked',
      createdOn: new Date(),
      updatedOn: new Date(),
      comments: [
        comment
      ],
      assignees: this.issue.assignees,
      labels: this.issue.labels,
      issueRef: this.issue,
      participants: [this.user.id]
    }
    const thread = createThread(this.thread)
    this.$store.dispatch('issue/storeThread', thread)
    this.$store.dispatch('issue/addComment', comment)
    console.log(this.thread)
    // console.log(this.user)
  },
  data: () => ({
    tab: 'write',
    issue: {
      title: 'New Issue',
      description: '',
      body: '',
      labels: [],
      assignees: [],
      severity: '',
      project: null
    },
    thread: null,
    user: null,
    comment: {
      body: ''
    },
    project: {
      label: 'Google',
      value: 'Google',
      description: 'Search engine',
      category: '1'
    },
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
      getComments: 'issue/getThreadComments'
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

      return new Promise((resolve) => {
        // simulating a delay of 2 seconds
        setTimeout(() => {
          resolve({
            url: this.issueAttachmentsEndpoint
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
      this.comment.body += `\n[${file.name}](${data})`
    },
    onSubmit () {
      const com = createComment({ id: this.getComments.length + 1, authorId: this.user.id, authorName: this.user.name, body: this.comment.body, upVotes: 0, downVotes: 0, myVote: '', createdOn: new Date(), updatedOn: new Date() })
      console.log(com)
      // this.thread.comments.push(createComment({ id: this.getComments.length + 1, authorId: this.user.id, body: this.comment.body, createdOn: new Date(), updatedOn: new Date() }))
      this.$store.dispatch('issue/addComment', Object.assign({}, com))
      const thd = Object.create(this.thread)
      this.$store.dispatch('issue/storeThread', Object.assign({}, thd))
      this.thread.comments = this.getComments
      console.log(this.thread)
      this.comment.body = ''
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
