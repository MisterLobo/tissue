<template>
  <div>
    <q-table
      title="Members"
      :data="data"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn label="Remove" color="red" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'ProjectSettingsMembersComponent',
  data: () => ({
    columns: [
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: 'name'
      },
      { name: 'email', align: 'center', label: 'Email', field: 'email' },
      { name: 'role', align: 'center', label: 'Role', field: 'role' },
      { name: 'date_added', align: 'center', label: 'Date Added', field: 'date_added' },
      { name: 'action', label: 'Action', align: 'center' }
    ],
    data: [
      {
        name: 'A',
        email: 'a@a.a',
        role: 'owner',
        date_added: (new Date().toDateString())
      },
      {
        name: 'B',
        email: 'b@b.b',
        role: 'owner',
        date_added: (new Date().toDateString())
      },
      {
        name: 'C',
        email: 'c@c.c',
        role: 'maintainer',
        date_added: (new Date().toDateString())
      }
    ]
  })
}
</script>
