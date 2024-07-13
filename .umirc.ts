import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: '/login',
      component: '@/pages/login/index',
      layout: false
    },
    {
      path: '/',
      redirect: '/home',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/home',
      component: '@/pages/home/index',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/historyNotice',
      component: '@/pages/home/components/historyNotice/index',
    },
    {
      path: '/feedback',
      component: '@/pages/home/components/feedback/index',
    },
    {
      path: '/appdownload',
      component: '@/pages/home/components/appDownload/index',
    },
    {
      path: '/upload',
      component: '@/pages/upload/index',
    },
    {
      path: '/uploadVideo',
      component: '@/pages/upload/components/uploadVideo/index',
    },
    {
      path: '/collectionManagement',
      component: '@/pages/upload/components/collectionManagement/index',
    },
    {
      path: '/collectionManagement/:id',
      component: '@/pages/upload/components/collectionManagement/$id.tsx',
    },
    {
      path: '/videoManagement',
      component: '@/pages/upload/components/videoManagement/index.tsx',
    },
    {
      path: '/promation',
      component: '@/pages/promation/index',
    },
    {
      path: '/promation/:id',
      component: '@/pages/promation/$id.tsx',
    },
    {
      path: '/my',
      component: '@/pages/my/index',
    },
    { path: '/*', component: '@/pages/404', layout: false },
  ],
  npmClient: 'pnpm',
});
