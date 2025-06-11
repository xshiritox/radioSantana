import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Global error handler
app.config.errorHandler = (err: unknown, info: unknown) => {
  console.error('Global error:', err, info)
}

app.mount('#app')