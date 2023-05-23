import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import NotFoundView from '../views/NotFoundView.vue' 
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import TestView from '../views/TestView.vue'
import SingularTestView from '../views/SingularTestView.vue'
import LocationsView from '../views/LocationsView.vue'

// TODO: protect routes, only a user with a certain role should be able to access some routes.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationsView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
    },
    {
      path: '/test/:songId',
      name: 'singular-test',
      component: SingularTestView,
    },
    // Make sure this one is last.
    {
      path: '/:catchAll(.*)*',
      name: 'notFound',
      component: NotFoundView,
    }

  ]
})

export default router
