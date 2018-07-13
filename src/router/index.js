import Vue from 'vue';
import Router from 'vue-router';
import Editor from '@/views/Editor';
import Config from '@/views/Config';
import Home from '@/views/Home';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/config',
      name: 'config',
      component: Config,
    },
    {
      path: '/editor/:file_id',
      name: 'editor',
      component: Editor,
    },
  ],
});
