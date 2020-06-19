<template>
  <q-list bordered class="rounded-borders" style="width: 50vw">
    <q-item>
      <q-item-label header>Projects</q-item-label>
      <q-space />
      <q-btn label="New Project" color="green" @click="newProject" />
    </q-item>
    <q-separator spaced />

    <q-item v-for="p in getProjects" v-bind:key="p.id">
      <q-item-section avatar top>
        <q-icon name="account_tree" color="black" size="34px" />
      </q-item-section>

      <q-item-section top class="col-2 gt-sm">
        <q-item-label class="q-mt-sm">GitHub</q-item-label>
      </q-item-section>

      <q-item-section top>
        <q-item-label lines="1">
          <span class="text-weight-medium">[{{ getUser.nickname }}/{{ p.slug }}]</span>
          <span class="text-grey-8"> - {{ p.description }}</span>
        </q-item-label>
        <q-item-label caption lines="1">
          @author in #issueId: > Title
        </q-item-label>
        <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase" @click="openProject(p)">
          <span class="cursor-pointer">Open in GitHub</span>
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
</template>

<script>
import { mapGetters } from 'vuex'

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
    this.$store.dispatch('project/fetchProjects', this.getUser.nickname)
    this.projects = this.getProjects
    console.log(this.projects)
  },
  methods: {
    openProject (proj) {
      // proj.owner = this.getUser.nickname
      // eslint-disable-next-line @typescript-eslint/camelcase
      proj.owner_id = this.getUser.id
      proj.label = proj.title
      proj.value = proj.slug
      const p = Object.assign({}, proj)
      console.log(proj)
      this.$store.dispatch('project/viewProject', p)
      this.$router.push({ path: `/${this.getUser.nickname}/${proj.slug}` })
    },
    newProject () {
      this.$router.push({ name: 'new-project', params: { owner: this.getUser.nickname } })
    }
  },
  data: () => ({
    projects: []
  })
}
</script>
