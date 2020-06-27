import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      {
        path: '/issues',
        name: 'issues',
        component: () => import('pages/IssuesPage.vue'),
        children: [
          { path: 'new', name: 'new-issue', component: () => import('components/CreateIssueComponent.vue') }
        ]
      },
      {
        path: '/:owner/:project',
        component: () => import('pages/ProjectsPage.vue'),
        children: [
          { path: '', name: 'project-view', component: () => import('components/ProjectComponent.vue') },
          // { path: 'issue/:issueId', name: 'issue-thread', component: () => import('components/IssueThreadComponent.vue') },
          { path: 'new-issue', name: 'new-project-issue', component: () => import('components/CreateIssueComponent.vue') }
        ]
      },
      {
        path: '/:owner/:project/issues',
        component: () => import('pages/IssuesPage.vue'),
        children: [
          { path: '', name: 'project-issues', component: () => import('components/IssuesComponent.vue') },
          { path: ':issueId', name: 'issue-thread', component: () => import('components/IssueThreadComponent.vue') }
        ]
      },
      {
        path: '/:owner/:project/settings',
        component: () => import('pages/ProjectSettingsPage.vue'),
        children: [
          { path: '', name: 'project-settings', component: () => import('components/ProjectSettingsGeneralComponent.vue') },
          { path: 'members', name: 'project-settings-members', component: () => import('components/ProjectSettingsMembersComponent.vue') }
        ]
      },
      {
        path: '/:owner/projects',
        component: () => import('pages/ProjectsPage.vue'),
        children: [
          { path: '', redirect: { name: 'your-projects' } },
          { path: 'all', name: 'your-projects', component: () => import('components/ProjectsComponent.vue') },
          { path: 'new', name: 'new-project', component: () => import('components/CreateProjectComponent.vue') }
          // { path: ':project', component: () => import('components/ProjectComponent.vue') }
        ]
      },
      /* {
        path: ':owner/projects/new',
        component: () => import('pages/ProjectsPage.vue'),
        // name: 'your-projects',
        children: [
          // { path: '', name: 'your-projects', component: () => import('components/ProjectsComponent.vue') },
          { path: 'new', name: 'new-project', component: () => import('components/CreateProjectComponent.vue') }
          // { path: ':project', component: () => import('components/ProjectComponent.vue') }
        ]
      }, */
      {
        path: '/projects',
        component: () => import('pages/ProjectsPage.vue'),
        children: [
          { path: '', name: 'projects', component: () => import('components/ProjectsComponent.vue') }
          // { path: 'new', name: 'new-project', component: () => import('components/CreateProjectComponent.vue') }
          // { path: ':project', component: () => import('components/ProjectComponent.vue') }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Guest.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AuthPage.vue'),
        children: [
          { path: '', component: () => import('components/LoginComponent.vue') }
        ]
      }
    ]
  },
  {
    path: '/auth/:provider/callback',
    component: {
      template: '<div class="auth-component"></div>'
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
