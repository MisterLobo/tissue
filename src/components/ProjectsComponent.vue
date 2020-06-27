<template>
  <div class="justify-center" style="width: 50vw">
    <q-list v-if="!loading" bordered>
      <q-item>
        <q-item-label header>Projects</q-item-label>
        <q-space />
        <q-btn label="New Project" color="green" @click="newProject" />
      </q-item>
      <q-separator spaced />

      <q-item v-for="p in projects" v-bind:key="p.id">
        <q-item-section avatar top>
          <q-icon name="account_tree" color="black" size="34px" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">GitHub</q-item-label>
        </q-item-section>

        <q-item-section top v-if="p">
          <q-item-label lines="1" v-if="p.owner">
            <span class="text-weight-medium">[{{ p.owner.display_name }}/{{ p.slug }}]</span>
            <span class="text-grey-8"> - {{ p.description }}</span>
          </q-item-label>
          <q-item-label caption lines="1" v-if="p.latest_issue">
            @{{ p.latest_issue.author.display_name }} in #{{ p.latest_issue.id }}: > {{ p.latest_issue.title }}
          </q-item-label>
          <q-item-label v-else>
            No issues
          </q-item-label>
          <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase" @click="openProject(p)">
            <span class="cursor-pointer">Open Project</span>
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

      <q-item v-if="getProjects.length === 0">
        <q-item-section>
          <i class="text-center">Wooh! You don't have any projects</i>
          <q-btn label="New Project" color="green" @click="newProject" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-list v-else>
      <q-item>
        <q-item-label header>Projects</q-item-label>
        <q-space />
        <q-btn label="New Project" color="green" @click="newProject" />
      </q-item>
      <q-separator spaced />
      <q-item-section class="text-center">
        <q-spinner-tail
          color="primary"
          size="2em"
        />
        <q-tooltip :offset="[0, 8]">QSpinnerTail</q-tooltip>
      </q-item-section>
    </q-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  // name: 'ComponentName',
  computed: {
    ...mapGetters({
      getUser: 'user/getUserState',
      getProject: 'project/getProject',
      getProjects: 'project/getProjects'
    })
  },
  created () {
    this.loading = true
    this.$store.dispatch('project/fetchProjects').then(p => {
      this.projects = p
      this.loading = false
      console.log(this.projects)
    })
  },
  methods: {
    ...mapActions({
      fetchProjects: 'project/fetchProjects',
      viewProject: 'project/viewProject'
    }),
    openProject (proj) {
      // proj.owner = this.getUser.nickname
      // eslint-disable-next-line @typescript-eslint/camelcase
      const p = Object.assign({}, proj)
      console.log(p)
      this.$store.dispatch('project/viewProject', p)
      this.$router.push({ path: `/${p.owner.display_name}/${p.slug}` })
    },
    newProject () {
      this.$router.push({ name: 'new-project', params: { owner: this.getUser.nickname } })
    }
  },
  data: () => ({
    loading: false,
    projects: []
  })
}
</script>
