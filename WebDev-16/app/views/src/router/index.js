import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Login from "../components/Login"
import Checkout from "../components/Checkout"
import User from "../components/User"
import store from '../store'
import ResetPwd from "@/components/ResetPwd";
import Register from "@/components/Register";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: '/home',
    redirect: '/main',
    component: Home,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/main',
        name: 'main',
        component: ()=>import('../components/Home/Sections/main.vue'),
        meta: {
          title: 'main',
          keepAlive: true
        },
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('../components/Home/Sections/search.vue')
      },
      {
        path: '/item',
        name: 'item',
        component: () => import('../components/Home/Sections/item.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/resetpwd',
    name: 'resetpwd',
    component: ResetPwd
  },
  {
    path: '/checkout',
    component: Checkout,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/user',
    component: User,
    children: [
      {
        path: '/user/edit',
        component: () => import('../components/User/profile.vue'),
        meta: {
          requiresAuth: true
        },
      },
      {
        path: '/user/phoneList',
        component: () => import('../components/User/phoneList.vue'),
        meta: {
          requiresAuth: true
        },
      },
      {
        path: '/user/comments',
        component: () => import('../components/User/comments.vue'),
        meta: {
          requiresAuth: true
        },
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    if (to.path === '/user') {
      if(to.query.email){
        next()
      }else if(!store.state.user){
        next({
          name: 'login',
        })
      }else{
        next()
      }
    }else{
      next()
    }
  }
})

export default router
