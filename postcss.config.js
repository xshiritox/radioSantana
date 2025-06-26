// Configuración de PostCSS para desarrollo y producción
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// Solo aplicar PurgeCSS en producción
if (process.env.NODE_ENV === 'production') {
  config.plugins['@fullhuman/postcss-purgecss'] = {
    content: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    defaultExtractor: (content) => {
      // Extraer clases de Tailwind
      const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
      return contentWithoutStyleBlocks.match(/[\w-/.:]+(?<!:)/g) || [];
    },
    safelist: [
      /-(leave|enter|appear)(|-(to|from|active|group-hover))$/,
      /^(?!(|.*?:)cursor-move).+-move$/,
      /^router-link(|-exact)-active$/,
      /data-v-.*/,
      /^v-.*/,
      /^\[.*\]$/,
    ],
  };
}

export default config;