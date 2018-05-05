import Vue from 'vue';
import Router from 'vue-router';
import Upload from '@/components/Upload';
import Canvas from '@/components/Canvas';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Upload',
      component: Upload,
    },
    {
      path: '/canvas',
      name: 'Canvas',
      component: Canvas,
    },
  ],
});
