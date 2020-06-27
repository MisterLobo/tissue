<template>
  <q-card>
    <q-card-section>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <div class="row text-h6">Rename project</div>
        <div class="row q-gutter-md">
          <div class="col">
            <q-input
              filled
              v-model="name"
              label="Project name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
          </div>
          <div class="col vertical-middle">
            <q-btn label="Rename" color="orange" flat size="lg" />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      <q-list bordered class="rounded-borders">
        <q-item-label header class="text-h5">Danger Zone</q-item-label>

        <q-item>

          <q-item-section top>
            <q-item-label lines="1">
              <span class="text-weight-medium">Change project visibility</span>
            </q-item-label>
            <q-item-label caption lines="2">
              This project is currently public.
            </q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat label="Change visibility" color="red" />
            </div>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item>

          <q-item-section top>
            <q-item-label lines="1">
              <span class="text-weight-medium">Transfer ownership</span>
            </q-item-label>
            <q-item-label caption lines="2">
              Transfer this project to another user or to an organization where you have the ability to create projects.
            </q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat label="Transfer" color="red" />
            </div>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item>

          <q-item-section top>
            <q-item-label lines="1">
              <span class="text-weight-medium">Archive this project</span>
            </q-item-label>
            <q-item-label caption lines="2">
              Mark this project as archived and read-only.
            </q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat label="Archive this project" color="red" />
            </div>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item>

          <q-item-section top>
            <q-item-label lines="1">
              <span class="text-weight-medium">Delete this project</span>
            </q-item-label>
            <q-item-label caption lines="1">
              Once you delete a project, there is no going back. Please be certain.
            </q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat label="Delete this project" color="red" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ProjectSettingsGeneralComponent',
  data () {
    return {
      name: 'project',

      accept: false
    }
  },

  methods: {
    onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the license and terms first'
        })
      }
      else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
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
