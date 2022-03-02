import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// firebaseをimport
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyChTvEQbKgNea6SdmG-XcDrZsaSPzVmn04",
  authDomain: "task-app2-5f88a.firebaseapp.com",
  projectId: "task-app2-5f88a",
  storageBucket: "task-app2-5f88a.appspot.com",
  messagingSenderId: "708090711142",
  appId: "1:708090711142:web:aa4eb733fcf6e04a0171a7"
};

// firebaseの初期化
initializeApp(firebaseConfig);

library.add(fas,far)


createApp(App).use(store).use(router).component('fa', FontAwesomeIcon ).mount('#app')
