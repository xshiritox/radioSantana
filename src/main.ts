import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const head = createHead()

app.use(head)



// Global error handler
app.config.errorHandler = (err: unknown, info: unknown) => {
  console.error('Global error:', err, info)
}

app.mount('#app')