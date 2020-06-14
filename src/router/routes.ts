import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      {
        path: 'issues',
        name: 'issues',
        component: () => import('pages/IssuesPage.vue'),
        children: [
          { path: 'list', component: () => import('components/IssuesComponent.vue') },
          { path: 'new', name: 'new-issue', component: () => import('components/CreateIssueComponent.vue') }
        ]
      },
      {
        path: ':project/issues',
        name: 'project-issues',
        component: () => import('pages/IssuesPage.vue'),
        children: [
          { path: ':issueId', name: 'issue-thread', component: () => import('components/IssueThreadComponent.vue') }
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
