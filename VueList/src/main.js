import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import EditItem from './views/EditItem.vue';

const routes = [
  // Other routes
  {
    path: '/edit/:index',
    name: 'edit',
    component: EditItem,
    props: true, // Pass route params as props to EditItem
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount('#app');
