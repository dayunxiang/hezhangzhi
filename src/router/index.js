import Vue from 'vue'
import Router from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      title: '登陆'
    },
    component: (resolve) => require(['@/page/login/login'], resolve)
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: (resolve) => require(['@/page/home'], resolve),
    children: [
      {
        path: '/inforRummary',
        name: 'inforRummary',
        meta: {
          title: '信息汇总'
        },
        component: (resolve) => require(['@/page/inforRummary'], resolve),
      },

      {
        path: '/problemHandling',
        name: 'problemHandling',
        meta: {
          title: '问题处理',
          requiresAuth: true
        },
        component: (resolve) => require(['@/page/problemHandling'], resolve),
      },
      {
        path: '/inspectionSummary',
        name: 'InspectionSummary',
        meta: {
          title: '巡查总结',
        },
        component: (resolve) => require(['@/page/inspectionSummary'], resolve),
      },
      {
        path: '/myRiver',
        name: 'myRiver',
        meta: {
          title: '所有河湖'
        },
        component: (resolve) => require(['@/page/myRiver'], resolve),
      },

      {
        path: '/inspectionReminder',
        name: 'inspectionReminder',
        meta: {
          title: '巡查提醒'
        },
        component: (resolve) => require(['@/page/inspectionReminder'], resolve),
      },
      {
        path: '/notification',
        name: 'notification',
        meta: {
          title: '消息通知'
        },
        component: (resolve) => require(['@/page/notification'], resolve),
      },
      {
        path: '/addnews',
        name: 'addnews',
        meta: {
          title: '发布新闻'
        },
        component: (resolve) => require(['@/page/addnews'], resolve),
      },

      {
        path: '/ranking',
        name: 'ranking',
        meta: {
          title: '排行榜'
        },
        component: (resolve) => require(['@/page/ranking'], resolve),
       },
      {
        path: '/riverLake',
        name: 'riverLake',
        meta: {
          title: '数据报表'
        },
        component: (resolve) => require(['@/page/riverLake'], resolve),
      },

      {
        path: '/governmentDoc',
        name: 'governmentDoc',
        meta: {
          title: '政府文件'
        },
        component: (resolve) => require(['@/page/governmentDoc'], resolve),
      },
      {
        path: '/riverManageinfo',
        name: 'riverManageinfo',
        meta: {
          title: '河长信息'
        },
        component: (resolve) => require(['@/page/riverManageinfo'], resolve),
      },
      // {
      //   path: '/InfoMaintenance',
      //   name: 'InfoMaintenance',
      //   meta: {
      //     title: '信息维护'
      //   },
      //   component: (resolve) => require(['@/page/InfoMaintenance'], resolve),
      // },
      {
        path: '/drainagestatistics',
        name: 'drainagestatistics',
        meta: {
          title: '排水统计'
        },
        component: (resolve) => require(['@/page/drainagestatistics'], resolve),
      },

      // {
      //   path: '/video',
      //   name: 'video',
      //   meta: {
      //     title: '视频'
      //   },
      //   component: (resolve) => require(['@/page/video'], resolve),
      // },
    ]
  },
  {
    path: '/inspectionList',
    name: 'inspectionList',
    meta: {
      title: '个人巡查列表'  //个人巡查列表     路由单独写在外面，不在home组件内
    },
    component: (resolve) => require(['@/page/ranking/inspectionList'], resolve)
  },
  {
    path: '/drainInlet',
    name: 'drainInlet',
    meta: {
      title: '排水口导入'    //环境监测站    路由单独写在外面 ，不在home组件内
    },
    component: (resolve) => require(['@/page/drainInlet'], resolve),
  },

];
Vue.use(Router);
export const router = new Router({
  // mode: 'history',
  routes,
});

