import { createRouter, createWebHashHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import SignUpView from '@/views/SignUp.vue'
import ListView from '../views/Note/ListView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: ListView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
  { path: "/signup", component: SignUpView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  const isLoggedIn = auth.token || localStorage.getItem("note_token")

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next("/login")
  }

  if (to.path === "/login" && isLoggedIn) {
    return next("/")
  }

  next()
})


export default router