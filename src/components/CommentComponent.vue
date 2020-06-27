<template>
  <q-card class="my-card" flat bordered>
    <q-card-section horizontal>
      <q-card-section class="q-pt-xs">
        <!--<div class="text-overline">{{ name }}</div>-->
        <div class="text-caption text-grey">
        </div>
        <q-markdown v-if="comment.content"
                    :src="comment.content"
                    class="fit bordered q-pa-sm wrap-sm"
        >
        </q-markdown>
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat icon="thumb_up" label="Upvote" @click="upVote" :color="vote === 'up' ? 'blue' : ''" />
      <q-btn flat icon="thumb_down" label="Downvote" @click="downVote" :color="vote === 'down' ? 'blue' : ''" />
      <q-space/><q-icon name="thumb_up"/>&nbsp;{{ comment.upvotes || 0 }}&nbsp;<q-icon name="thumb_down"/>&nbsp;{{ comment.downvotes || 0 }}
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CommentComponent',
  props: {
    author: String,
    data: Object
  },
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState',
      getIssue: 'issue/getCreatedIssue',
      getThread: 'issue/getIssueThread',
      getComment: 'issue/getComment',
      getProject: 'project/getProject',
      getMyVotes: 'issue/getMyVotes'
    }),
    isUploading () {
      return this.uploading !== null
    },

    canUpload () {
      return this.files !== null
    }
  },
  created () {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    // const cmt = createComment(this.data)
    // this.$store.dispatch('issue/storeComment', Object.assign({}, this.getData()))
    this.comment = this.getData()
    // console.log(this.comment)
  },
  methods: {
    upVote () {
      // console.log(this.getIssue, this.getProject, this.getUser)
      const vote = {
        body: 'up',
        issueId: this.getIssue.id,
        voter: this.getUser.id,
        owner: this.getProject.owner.display_name,
        project: this.getProject.slug,
        commentId: this.comment.id
      }
      // console.log(vote)
      this.$store.dispatch('issue/addVote', vote).then(c => {
        this.comment = c
        this.vote = 'up'
      })
      // console.log(this.comment)
    },
    downVote () {
      // console.log(this.getIssue, this.getProject, this.getUser)
      const vote = {
        body: 'down',
        issueId: this.getIssue.id,
        voter: this.getUser.id,
        owner: this.getProject.owner.display_name,
        project: this.getProject.slug,
        commentId: this.comment.id
      }
      // console.log(vote)
      this.$store.dispatch('issue/addVote', vote).then(c => {
        this.comment = c
        this.vote = 'down'
      })
    },
    getData () {
      return this.data
    }
  },
  data () {
    return {
      name: this.author,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      comment: null, // createComment(this.data),
      vote: ''
    }
  }
}
</script>
