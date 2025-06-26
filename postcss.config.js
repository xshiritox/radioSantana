// Configuración de PostCSS
const config = {
  plugins: []
};

// Configuración básica de plugins
const plugins = [
  require('tailwindcss'),
  require('autoprefixer')
];

// Solo aplicar PurgeCSS en producción
if (process.env.NODE_ENV === 'production') {
  try {
    const purgeCSS = require('@fullhuman/postcss-purgecss');
    plugins.push(
      purgeCSS({
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
      })
    );
    console.log('✅ PurgeCSS habilitado para producción');
  } catch (error) {
    console.warn('⚠️  No se pudo cargar PurgeCSS:', error.message);
  }
}

// Asignar plugins a la configuración
config.plugins = plugins;

module.exports = config;