<script setup lang="ts">
import { ref } from 'vue'
import { emailjsSend } from '../../utils/emailjs'

const name = ref('')
const email = ref('')
const message = ref('')
const isLoading = ref(false)
const successMessage = ref('')

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  
  if (!name.value || !email.value || !message.value) {
    console.log('Campos vacíos:', { name: name.value, email: email.value, message: message.value })
    alert('Por favor complete todos los campos')
    return
  }

  try {
    isLoading.value = true
    console.log('Enviando datos:', { name: name.value, email: email.value, message: message.value })
    
    const response = await emailjsSend({
      name: name.value,
      email: email.value,
      message: message.value
    })
    
    console.log('Respuesta del servidor:', response)
    
    if (response.status >= 200 && response.status < 300) {
      successMessage.value = '¡Mensaje enviado exitosamente!'
      name.value = ''
      email.value = ''
      message.value = ''
    } else {
      console.error('Error en la respuesta:', response)
      alert(`Error del servidor: ${response.text || 'Por favor intenta de nuevo.'}`)
    }
  } catch (error: any) {
    console.error('Error detallado:', {
      error: error,
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    })
    
    if (error instanceof Error) {
      alert(`Error: ${error.message}`)
    } else {
      alert('Error al enviar el mensaje. Por favor intenta de nuevo.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h3 class="text-2xl font-bold mb-6">
      <span class="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent">Envíanos un Mensaje</span>
    </h3>
    <form @submit="handleSubmit" class="space-y-4">
      <div>
        <input
          v-model="name"
          type="text"
          placeholder="Tu nombre"
          class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <input
          v-model="email"
          type="email"
          placeholder="Tu email"
          class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <textarea
          v-model="message"
          rows="4"
          placeholder="Tu mensaje"
          class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full px-6 py-3 bg-gold-gradient text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Enviando...' : 'Enviar Mensaje' }}
      </button>
      <p v-if="successMessage" class="text-green-400 text-center mt-4">
        {{ successMessage }}
      </p>
    </form>
  </div>
</template>
