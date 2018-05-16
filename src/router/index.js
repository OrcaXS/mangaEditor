import Vue from 'vue';
import Router from 'vue-router';
import Upload from '@/components/Upload';
import Canvas from '@/components/Canvas';
import TCanvas from '@/components/TCanvas';

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
      path: '/canvas/:file_id',
      name: 'canvas',
      component: Canvas,
    },
    {
      path: '/tcanvas/',
      name: 'tcanvas',
      component: TCanvas,
    },
  ],
});
