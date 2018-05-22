import iView from 'iview';
import Cookies from 'js-cookie';
import {router} from './index';
import {util} from '../config/mUtils';
// 监听路由跳转
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  util.title(to.meta.title);
  if (!Cookies.get('userid') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
    next({
      name: 'login'
    });
  } else if (Cookies.get('userid') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
    next({name: 'home'});
  } else {
    next();
  }
});
router.afterEach((to) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
