<template>
  <div class="justify-center row" :style="$q.screen.gt.sm ? 'width: 60vw' : ''">
    <q-card class="my-card col-lg-8" bordered flat>
      <q-card-section>
        <div class="row">
          <div class="text-h5 q-mb-xs">{{ project.owner.display_name }} / {{ project.title }}</div> <q-space /><q-btn v-if="issue.author_id === author.id" color="red" label="Close issue"></q-btn>
        </div>
        <div class="text-h5 q-mb-xs">{{ issue.title }} #{{ issue.id }} <q-badge :label="issue.status" color="green" align="middle" /></div>
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
                v-model="comment"
                type="textarea"
                label="Leave a comment"
              />
            </q-tab-panel>

            <q-tab-panel name="preview">
              <div class="text-h6">Preview</div>
              <q-markdown v-if="comment"
                          :src="comment"
                          class="fit bordered q-pa-sm wrap-sm"
              >
              </q-markdown>
              <span class="text-italic" v-else>Nothing to preview</span>
            </q-tab-panel>
          </q-tab-panels>
          <div class="row">
            <q-uploader
              ref="attachments"
              label="Attach files"
              auto-upload
              :url="issueAttachmentsEndpoint"
              multiple
              flat
              :factory="factoryFn"
              @uploaded="fileUploadFinished"
              class="q-md-12 full-width"
            />
          </div>
          <div>
            <q-btn label="Post comment" type="submit" color="primary"/>
            <!--<q-btn label="" type="reset" color="primary" flat class="q-ml-sm" />-->
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    <q-card class="col-lg-4 col-md-3 transparent" flat>
      <q-card-section>
        <div class="q-mb-xs">Assignees</div>
        <q-list bordered>
          <q-item v-for="assignee in assignees" v-bind:key="assignee.id">
            <q-item-section avatar>
              <q-avatar>
                <img :src="assignee.avatar">
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ assignee.display_name }}</q-item-section>
          </q-item>
          <q-item v-if="assignees.length === 0">
            <em>No one&dash;assign yourself</em>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-xs">Labels</div>
        <q-chip v-bind:key="label.label" v-for="label in labels" color="bug" text-color="black">
          {{ label.label }}
        </q-chip>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-xs">{{ `${participants.length} participant` }}{{ participants.length > 1 ? 's' : '' }}</div>
        <div class="row">
          <q-avatar v-for="part in participants" v-bind:key="part.id">
            <img :src="part.avatar" width="64" height="64">
            <q-tooltip>
              <div class="row text-center">
                <img :src="part.avatar" width="64" height="64"> {{ part.display_name }}
              </div>
              <div class="row flex">
                Opened this issue
              </div>
              <div class="row flex">
                Owns this project
              </div>
            </q-tooltip>
          </q-avatar>
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <div class="row">
          <q-btn align="left" label="Lock thread" icon="lock" class="full-width" flat @click="lockIssueThreadDlg = true" />
        </div>
        <div class="row">
          <q-btn align="left" label="Pin issue" icon="mdi-pin" class="full-width text-left" flat />
        </div>
        <div class="row">
          <q-btn align="left" label="Delete issue" icon="delete" class="full-width text-left" flat />
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="lockIssueThreadDlg" ref="lockIssueThreadDlg" @hide="lockIssueThreadDlg_onHideDlg">
      <q-card class="q-dialog-plugin">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Lock thread on this issue</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <ul>
            <li>Other users can’t add new comments to this issue.</li>
            <li>You and other collaborators with access to this repository can still leave comments that others can see.</li>
            <li>You can always unlock this issue again in the future.</li>
          </ul>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Reason for locking</div>
          <q-select filled v-model="reason" :options="reasonOptions" label="Choose a reason" />
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn class="full-width" color="primary" label="Lock thread on this issue" @click="lockIssueThreadDlg_onOkClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog ref="addRemoveAssigneesDlg" @hide="addRemoveAssigneesDlg_onHideDlg">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <q-input v-model="issue.title" label="Issue Title" />
          <q-input type="textarea" v-model="issue.description" label="Issue Description" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="OK" @click="addRemoveAssigneesDlg_onOkClick" />
          <q-btn color="primary" label="Cancel" @click="addRemoveAssigneesDlg_onCancelClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog ref="addRemoveLabelsDlg" @hide="addRemoveLabelsDlg_onHideDlg">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <q-input v-model="issue.title" label="Issue Title" />
          <q-input type="textarea" v-model="issue.description" label="Issue Description" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="OK" @click="addRemoveLabelsDlg_onOkClick" />
          <q-btn color="primary" label="Cancel" @click="addRemoveLabelsDlg_onCancelClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
    console.log(this.issue, this.author, this.thread, this.project)
    console.log(labels, assignees, participants)
  },
  data: () => ({
    tab: 'write',
    issue: null,
    thread: null,
    author: null,
    project: null,
    comments: [],
    comment: '',
    labels: [],
    assignees: [],
    participants: [],
    files: null,
    uploadProgress: [],
    uploading: null,
    apiUrl: 'process.env.API_URL',
    issueAttachmentsEndpoint: '',
    lockIssueThreadDlg: false,
    reason: '',
    reasonOptions: ['Off-topic', 'Too heated', 'Resolved', 'Spam']
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
      return new Date(d).toDateString()
    },
    factoryFn (files) {
      this.files = files

      return new Promise((resolve) => {
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
      this.comment += `\n[${file.name}](${data})`
    },
    onSubmit () {
      const com = { body: this.comment }
      this.$store.dispatch('issue/storeComment', { owner: this.getUser.nickname, project: this.project.slug, issueId: this.issue.id, com }).then(r => {
        this.comments = r.comments
      })
      this.comment = ''
      this.$refs.attachments.reset()
    },
    lockIssueThreadDlg_show () {
      this.$refs.lockIssueThreadDlg.show()
    },
    lockIssueThreadDlg_onHideDlg () {
      //
    },
    lockIssueThreadDlg_onOkClick () {
      //
    },
    lockIssueThreadDlg_onCancelClick () {
      //
    },
    addRemoveAssigneesDlg_onHideDlg () {
      //
    },
    addRemoveAssigneesDlg_onOkClick () {
      //
    },
    addRemoveAssigneesDlg_onCancelClick () {
      //
    },
    addRemoveLabelsDlg_onHideDlg () {
      //
    },
    addRemoveLabelsDlg_onOkClick () {
      //
    },
    addRemoveLabelsDlg_onCancelClick () {
      //
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
