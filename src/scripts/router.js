import { mount, router as routerRedom } from 'redom';
import Navigo from 'navigo';
import Dashboard from './pages/Dashboard';
import StoreDetail from './pages/StoreDetail';

const app = routerRedom(
  '#app',
  {
    dashboard: Dashboard,
    store_detail: StoreDetail,
  },
  {},
);
mount(document.getElementById('app'), app);

const router = new Navigo('/');
router
  .on('/', async (match) => {
    app.update('dashboard');
  })
  .on('/stores/:storeId', async (match) => {
    const { data } = match;
    app.update('store_detail', { storeId: data.storeId });
  });

router.notFound(() => {
  console.log('Page not found!');
});

export default router;
