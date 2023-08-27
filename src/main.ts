import { createApp } from 'vue'
import "./reset.css"
import App from './App.vue'
import './samples/node-api'

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
