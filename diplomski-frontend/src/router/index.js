import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store.js'

import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import NotFoundView from '../views/NotFoundView.vue' 
import ForbiddenView from '../views/ForbiddenView.vue'

// Investor
import LocationsView from '../views/Investor/LocationsView.vue'
import ReportsView from '../views/Investor/ReportsView.vue'

// Admin
import AllLocationsView from '../views/Admin/AllLocationsView.vue'
import AllReportsView from '../views/Admin/AllReportsView.vue'
import AllAssignmentsView from '../views/Admin/AllAssignmentsView.vue'

// Worker
import AssignmentsView from '../views/Worker/AssignmentsView.vue'
import CalendarView from '../views/CalendarView.vue'

// TODO: protect routes, only a user with a certain role should be able to access some routes.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    // Investitor.
    {
      path: '/locations',
      name: 'locations',
      component: LocationsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    },
    // Admin.
    {
      path: '/locations-all',
      name: 'locations-all',
      component: AllLocationsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports-all',
      name: 'reports-all',
      component: AllReportsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/assignments-all',
      name: 'assignments-all',
      component: AllAssignmentsView,
      meta: { requiresAuth: true }
    },
    // Worker.
    {
      path: '/assignments',
      name: 'assignments',
      component: AssignmentsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: { requiresAuth: false }
    },
    // Other
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
      meta: { requiresAuth: false }
    },
    // Make sure this one is last.
    {
      path: '/:catchAll(.*)*',
      name: 'notFound',
      component: NotFoundView,
      meta: { requiresAuth: false }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    // Check if user is logged in first.
    if(!store.state.isUserLoggedIn){
      next('/forbidden')
    }
    else{
      // Admin
      if(to.fullPath.endsWith('all')){
        if(store.state.user.role == 'admin'){
          next()
        }
        else{
          next('/forbidden')
        }
      }
      // Investor
      else if (to.fullPath.endsWith("locations") || to.fullPath.endsWith("reports")) {
        if(store.state.user.role == 'investitor'){
          next()
        }
        else{
          next('/forbidden')
        }
      } 
      // Worker
      else if (to.fullPath.endsWith("assignments")) {
        if(store.state.user.role == 'zaposlenik'){
          next()
        }
        else{
          next('/forbidden')
        }
      }
    }
  }
  else{
    next()
  }
})

export default router
