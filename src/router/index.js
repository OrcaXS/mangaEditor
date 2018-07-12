import Vue from 'vue';
import Router from 'vue-router';
import Upload from '@/views/Upload';
import Editor from '@/views/Editor';
import Config from '@/views/Config';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'upload',
      component: Upload,
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
