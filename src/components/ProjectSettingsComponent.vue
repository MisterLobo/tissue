<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      :limits="[10, 10]"
    >

      <template v-slot:before>
        <q-tabs
          v-model="innerTab"
          vertical
        >
          <q-tab name="general" label="General" />
          <q-tab name="members" label="Members" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="innerTab"
          animated
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel name="general">
            <project-settings-general-component></project-settings-general-component>
          </q-tab-panel>

          <q-tab-panel name="members">
            <project-settings-members-component></project-settings-members-component>
          </q-tab-panel>
        </q-tab-panels>
      </template>

    </q-splitter>
  </div>
</template>

<script>
import ProjectSettingsGeneralComponent from './ProjectSettingsGeneralComponent'
import ProjectSettingsMembersComponent from './ProjectSettingsMembersComponent'
export default {
  name: 'ProjectSettingsComponent',
  components: { ProjectSettingsMembersComponent, ProjectSettingsGeneralComponent },
  data: () => ({
    innerTab: 'general',
    splitterModel: 20
  })
}
</script>
