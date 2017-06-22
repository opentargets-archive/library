import 'font-awesome/css/font-awesome.css';
import Vue from 'vue';
import Quasar from 'quasar-framework';
import router from './router';
import App from './App.vue';

// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`);
// 2. or, use next line to activate DEFAULT QUASAR STYLE
/* eslint import/no-dynamic-require: 0 */
// require(`quasar-framework/dist/quasar.${__THEME}.css`);

require('./main.scss');
// ==============================

Vue.use(Quasar); // Install Quasar Framework

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App></App>',
    components: { App },
  });
});
