import Vue from 'vue'
import App from "./components/App.vue";
import Vuetify from 'vuetify';
// TODO: Serve as seperate CSS file -> https://vuetifyjs.com/en/getting-started/quick-start (CDN section)
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

window.vue = new Vue({
	render: h => h(App)
}).$mount("#app")
