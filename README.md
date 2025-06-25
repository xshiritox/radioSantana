# RadioVirtual Santana

![Logo de RadioVirtual Santana](/src/assets/logo.webp)

Bienvenido al repositorio de **RadioVirtual Santana**, una aplicación web moderna para transmitir radio en línea con una interfaz de usuario atractiva y funcional.

## 🚀 Características

- 🎵 Transmisión de audio en tiempo real
- 📱 Diseño responsivo que funciona en todos los dispositivos
- ⚡ Aplicación Web Progresiva (PWA) para una experiencia de aplicación nativa
- 🔍 Optimizado para motores de búsqueda (SEO)
- 🎨 Interfaz de usuario moderna con animaciones suaves
- 📊 Integración con Google Analytics
- 🔒 Seguridad mejorada con HTTPS y políticas de seguridad de contenido

## 🛠️ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v16 o superior)
- npm (v8 o superior) o Yarn (v1.22 o superior)
- Git

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/radio-santana.git
   cd radio-santana
   ```

2. **Instalar dependencias**
   ```bash
   # Con npm
   npm install
   
   # O con Yarn
   yarn install
   ```

3. **Configuración del entorno**
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   VITE_API_URL=https://api.radiosantana.netlify.app
   VITE_GA_TRACKING_ID=TU_ID_DE_GOOGLE_ANALYTICS
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   # Con npm
   npm run dev
   
   # O con Yarn
   yarn dev
   ```

5. **Compilar para producción**
   ```bash
   # Con npm
   npm run build
   
   # O con Yarn
   yarn build
   ```

## 📦 Despliegue

### Desplegar en Netlify

1. **Conectar tu repositorio de GitHub/GitLab a Netlify**
   - Ve a [Netlify](https://www.netlify.com/) e inicia sesión
   - Selecciona "New site from Git"
   - Conecta tu repositorio de GitHub/GitLab

2. **Configuración del despliegue**
   - **Build command:** `npm run build` o `yarn build`
   - **Publish directory:** `dist`
   - **Variables de entorno:** Agrega las mismas variables que en tu `.env`

3. **Configuración de dominio**
   - Ve a "Domain settings"
   - Configura tu dominio personalizado si es necesario
   - Habilita HTTPS automático

4. **Configuración de redirecciones**
   - Asegúrate de que el archivo `_redirects` esté correctamente configurado
   - Verifica que el archivo `netlify.toml` tenga las configuraciones necesarias

### Desplegar en Vercel

1. **Importa tu repositorio en Vercel**
   - Ve a [Vercel](https://vercel.com/) e inicia sesión
   - Haz clic en "Import Project"
   - Conecta tu repositorio de GitHub/GitLab

2. **Configuración del proyecto**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` o `yarn build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install` o `yarn`

3. **Variables de entorno**
   - Agrega las mismas variables que en tu `.env`

## 🛠️ Configuración de SEO

El proyecto incluye configuración avanzada de SEO con:

- Metaetiquetas optimizadas
- Schema.org para RadioStation
- Sitemap XML
- Archivo robots.txt
- Open Graph y Twitter Cards

### Verificación de sitios web

Para verificar la propiedad de tu sitio en las herramientas para webmasters:

1. **Google Search Console**
   - Agrega la etiqueta meta de verificación en `index.html`
   - O sube el archivo de verificación HTML a la raíz del sitio

2. **Bing Webmaster Tools**
   - Sigue un proceso similar al de Google

## 📊 Analíticas

El proyecto está configurado para usar Google Analytics. Para habilitarlo:

1. Obtén un ID de seguimiento de Google Analytics
2. Configura la variable de entorno `VITE_GA_TRACKING_ID` con tu ID
3. Descomenta el script de Google Analytics en `index.html`

## 🔒 Seguridad

El proyecto incluye varias características de seguridad:

- Políticas de seguridad de contenido (CSP)
- Headers de seguridad HTTP
- Configuración de CORS
- Protección contra clickjacking

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, lee nuestras pautas de contribución para detalles sobre nuestro código de conducta y el proceso para enviar solicitudes de extracción.

1. Haz un Fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade alguna característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre una solicitud de extracción

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 🙏 Agradecimientos

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Netlify](https://www.netlify.com/)

## 📞 Contacto

¿Tienes preguntas o comentarios? ¡No dudes en contactarnos!

- **Email:** contacto@radiosantana.com
- **Sitio web:** [https://radiosantana.netlify.app](https://radiosantana.netlify.app)
- **Twitter:** [@RadioSantana](https://twitter.com/RadioSantana)

---

<div align="center">
  <p>Hecho con ❤️ por el equipo de RadioVirtual Santana</p>
  <p>© 2025 RadioVirtual Santana. Todos los derechos reservados.</p>
</div>
