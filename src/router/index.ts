import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import ListView from '../views/Note/ListView.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/notes', component: ListView },
]



export const router = createRouter({
  history: createWebHistory(),
  routes,
})