import Vue from 'vue';
import Router from 'vue-router';
import Upload from '@/views/Upload';
import Editor from '@/views/Editor';

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
      path: '/editor/:file_id',
      name: 'editor',
      component: Editor,
    },
  ],
});
