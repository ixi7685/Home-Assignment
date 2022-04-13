import { createApp } from 'vue';
import router from './router.js';
import App from './App.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';

const app = createApp(App)

app.use(router);

app.component('base-spinner', BaseSpinner);

app.mount('#app');
