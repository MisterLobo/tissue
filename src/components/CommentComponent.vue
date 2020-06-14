<template>
  <q-card class="my-card" flat bordered>
    <q-card-section horizontal>
      <q-card-section class="q-pt-xs">
        <!--<div class="text-overline">{{ name }}</div>-->
        <div class="text-caption text-grey">
        </div>
        <q-markdown v-if="comment.body"
                    :src="comment.body"
                    class="fit bordered q-pa-sm wrap-sm"
        >
        </q-markdown>
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat icon="thumb_up" label="Like" @click="upVote" />
      <q-btn flat icon="thumb_down" label="Dislike" @click="downVote" />
      <q-space/><q-icon name="thumb_up"/>&nbsp;{{ comment.upVotes || 0 }}&nbsp;<q-icon name="thumb_down"/>&nbsp;{{ comment.downVotes || 0 }}
    </q-card-actions>
  </q-card>
</template>

<script>
import { createComment } from '../models'
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
      getComments: 'issue/getThreadComments'
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
    // this.$store.dispatch('issue/storeComment', cmt)
  },
  methods: {
    upVote () {
      const vote = {
        vote: 'up',
        commentId: this.comment.id,
        voter: this.getUser.id
      }
      this.$store.dispatch('issue/addVote', vote)
      this.comment = this.getCommentById(this.comment.id)
      console.log(this.comment)
    },
    downVote () {
      const vote = {
        vote: 'down',
        commentId: this.comment.id,
        voter: this.getUser.id
      }
      this.$store.dispatch('issue/addVote', vote)
      this.comment = this.getCommentById(this.comment.id)
      console.log(this.comment)
    },
    getCommentById (id) {
      const comments = this.getComments
      const cmt = comments.filter((v) => v.id === id)
      return cmt.length > 0 ? cmt[0] : null
    }
  },
  data () {
    return {
      name: this.author,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      comment: createComment(this.data)
    }
  }
}
</script>
