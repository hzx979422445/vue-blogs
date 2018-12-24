import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: resolve => require(['../components/index.vue'], resolve)
    },
    {
      path: '/topicInfo',
      component: resolve => require(['../components/info.vue'], resolve)
    },
    {
      meta: {
        requireAuth: true
      },
      path: '/topic',
      component: resolve => require(['../components/createTopic.vue'], resolve)
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (localStorage.getItem('userInfo') !== null) {
    next()
  } else {
    if (to.path === '/topic') {
      next({
        path: '/index'
      })
    } else {
      next()
    }
  }
})
export default router
