const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '',
        name: 'main',
        component: () => import('@/pages/MainPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/pages/FormPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/pages/AdminPage.vue'),
        meta: { requiresAuth: true, roles: ['admin'] }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes