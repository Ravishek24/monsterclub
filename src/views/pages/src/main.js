import { createApp } from 'vue';  // Vue 3 uses createApp
import App from './App.vue';
import router from './router';  // Import the router
import './assets/style.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App);  // Create the Vue app

app.use(router);  // Use the router
app.mount('#app');  // Mount the app to the DOM
