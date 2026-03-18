import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/Layouts/MainLayout.vue'
import AuthLayout from '@/Layouts/AuthLayout.vue'
import StudentLayout from '@/Layouts/StudentLayout.vue'
import TeacherLayout from '@/Layouts/TeacherLayout.vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'


const router = createRouter({
  history: createWebHashHistory()(import.meta.env.BASE_URL),
  routes: [

    // PUBLIC (Access, Register Success)
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          redirect: '/access'
        },
        {
          path: 'access',
          component: () => import('@/views/Access.vue')
        },
      ]
    },
    // AUTH (Login)
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/views/Login.vue'),
          meta: { requiresGuest: true }
        }
      ]
    },

    // STUDENT
    {
      path: '/student',
      component: StudentLayout,
      meta: { requiresAuth: true, role: 'student' },
      children: [
        {
          path: '',
          redirect: '/student/dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('@/components/student/Dashboard.vue')
        },
        {
          path: 'groups',
          component: () => import('@/components/student/Groups.vue')
        },
        {
          path: 'project',
          component: () => import('@/components/student/Project.vue')
        },
        {
          path: 'market',
          component: () => import('@/components/student/Market.vue')
        },
        {
          path: 'profile',
          component: () => import('@/components/student/Profile.vue')
        },
        {
          path: 'extralessen',
          component: () => import('@/components/student/ExtraLessen.vue')
        },
        {
          path: 'reyting',
          component: () => import('@/components/student/Reyting.vue')
        },
        {
          path: 'payments',
          component: () => import('@/components/student/Payments.vue')
        },
        {
          path: 'group/:name',
          component: () => import('@/components/student/LessonView.vue')
        },
      ]
    },

    // TEACHER
    {
      path: '/teacher',
      component: TeacherLayout,
      meta: { requiresAuth: true, role: 'teacher' },
      children: [
        {
          path: '',
          redirect: '/teacher/dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('@/components/Teacher/Dashboard.vue')
        },
        {
          path: 'groups',
          component: () => import('@/components/Teacher/Groups.vue')
        },
        {
          path: 'students',
          component: () => import('@/components/Teacher/Students.vue')
        },
        {
          path: 'assignments',
          component: () => import('@/components/Teacher/Assignments.vue')
        },
        {
          path: 'profile',
          component: () => import('@/components/Teacher/Profile.vue')
        },
        {
          path: 'attendance',
          component: () => import('@/components/Teacher/Attendance.vue')
        }
      ]
    },

    // ADMIN
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('@/components/Admin/Dashboard.vue')
        },
        {
          path: 'users',
          component: () => import('@/components/Admin/Users.vue')
        },
        {
          path: 'groups',
          component: () => import('@/components/Admin/Groups.vue')
        },
        {
          path: 'settings',
          component: () => import('@/components/Admin/Settings.vue')
        },
        {
          path: 'analytics',
          component: () => import('@/components/Admin/Analytics.vue')
        },
        {
          path: 'finance',
          component: () => import('@/components/Admin/Finance.vue')
        },
        {
          path: 'courses',
          component: () => import('@/components/Admin/Courses.vue')
        }
      ]
    }

  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = JSON.parse(localStorage.getItem('iso_currentUser') || 'null')
  const isAuthenticated = !!currentUser
  const authOnlyPaths = ['/login', '/register', '/register-success']

  // If trying to access a protected route without auth
  if (to.matched.some(r => r.meta.requiresAuth) && !isAuthenticated) {
    return next('/login')
  }

  // If authenticated and going to login/register pages, redirect to dashboard
  if (isAuthenticated && authOnlyPaths.includes(to.path)) {
    return next(`/${currentUser.role}`)
  }

  // Root redirect
  if (to.path === '/' && !isAuthenticated) {
    return next('/access')
  }
  if (to.path === '/' && isAuthenticated) {
    return next(`/${currentUser.role}`)
  }

  next()
})

export default router