import { createApp } from 'vue';
import './plugins/assets';
import VxeUITable from 'vxe-table';
import VxeUI from 'vxe-pc-ui';
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupI18n } from './locales';
import 'vxe-table/lib/style.css';
import 'vxe-pc-ui/lib/style.css';

import App from './App.vue';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  setupAppVersionNotification();

  app.use(VxeUI);
  app.use(VxeUITable);
  app.mount('#app');
}

setupApp();
