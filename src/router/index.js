import { createRouter, createWebHistory } from 'vue-router'
import TokenService from '@/services/token.service'
import { useMessageStore } from '@/stores/messageStore'

function loadView(view) {
  return () => import(`../views/pages/${view}.vue`)
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login', // hoặc '/login', hoặc component cụ thể
    },
    {
      path: '/member',
      component: () => import('../views/layout/MemberLayout.vue'),
      meta: { title: 'Member', requiresAuth: true, roles: ['customer', 'admin'] },
      children: [
        {
          path: '',
          name: 'MemberPage',
          component: () => import('../views/pages/Member.vue'),
          meta: { title: 'Inbox' },
        },
      ],
    },
    {
      path: '/employee',
      name: 'employee',
      component: () => import('../views/layout/EmployeeLayout.vue'),
      meta: { title: 'Employee', requiresAuth: true, roles: ['staff', 'admin'] },
    },
    {
      path: '/manager',
      name: 'manager',
      component: () => import('../views/layout/AdminLayout.vue'),
      meta: { title: 'Admin', requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/login',
      name: 'Login',
      component: loadView('Login'),
      meta: { title: 'Login' },
    },
    {
      path: '/not-found',
      name: 'NotFoundPage',
      component: loadView('NotFound'),
      meta: { title: 'NotFound' },
    },
    {
      // will match everything
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: loadView('NotFound'),
      meta: { title: 'NotFound' },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const accessToken = TokenService.getCookieByKey('access_token')
  const refreshToken = TokenService.getCookieByKey('refresh_token')
  const userRole = TokenService.getCookieByKey('role')
  const isLoggedIn = !!accessToken && !!refreshToken
  const store = useMessageStore()

  // Kiểm tra đăng nhập
  if (to.meta.requiresAuth && !isLoggedIn) {
    TokenService.clearAll()
    return next('/login')
  }

  // 🔹 Nếu người dùng đã đăng nhập mà vẫn cố vào /login → redirect về trang chính theo role
  if (to.name === 'Login' && isLoggedIn) {
    if (userRole === 'manager') return next('/manager')
    if (userRole === 'staff') return next('/employee')
    if (userRole === 'customer') return next('/member')
    return next('/') // fallback nếu không có role
  }

  // Kiểm tra role
  if (to.meta && Array.isArray(to.meta.roles) && to.meta.roles.length > 0) {
    if (userRole !== 'admin' && !to.meta.roles.includes(userRole)) {
      // redirect về trang tương ứng với role
      if (userRole === 'customer') return next('/member')
      if (userRole === 'staff') return next('/employee')
      if (userRole === 'admin') return next('/manager')

      return next('/login') // fallback
    }
  }

  if (to.name === 'new-chat' && !store.selectedPhoneNumber) {
    return next({ name: 'chat' }) // Không cho back lại khi chưa chọn số from_number
  }

  next() // Cho phép đi tiếp
})

router.afterEach((to) => {
  const defaultTitle = 'One Chat App'
  document.title = to.meta?.title || defaultTitle
})

export default router
