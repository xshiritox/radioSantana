<script setup lang="ts">
import {computed} from 'vue'
interface Props {
  variant?: 'primary' | 'secondary' | 'gold' | 'silver' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  icon: false
});

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gold-gradient text-white hover:shadow-lg hover:scale-105 focus:ring-gold-500',
    secondary: 'bg-silver-gradient text-gray-900 hover:shadow-lg hover:scale-105 focus:ring-silver-500',
    gold: 'bg-gold-500 text-white hover:bg-gold-600 focus:ring-gold-500',
    silver: 'bg-silver-500 text-white hover:bg-silver-600 focus:ring-silver-500',
    outline: 'border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white focus:ring-gold-500'
  };

  const sizes = {
    sm: props.icon ? 'p-2' : 'px-3 py-1.5 text-sm',
    md: props.icon ? 'p-3' : 'px-4 py-2 text-sm',
    lg: props.icon ? 'p-4' : 'px-6 py-3 text-base'
  };

  const disabled = props.disabled || props.loading ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${disabled}`;
});
</script>

<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <div v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
    <slot />
  </button>
</template>