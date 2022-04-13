import { createRouter, createWebHistory } from 'vue-router';

import Flights from './pages/Flights.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/flights' },
    { path: '/flights', component: Flights },
  ]
});

export default router;