# 🌦️ ClimateMap Frontend

An interactive weather forecast application built with Vue 3, featuring real-time weather data visualization, multilingual support (English/Spanish), and an interactive map interface powered by OpenWeatherMap API.

![Vue 3](https://img.shields.io/badge/Vue.js-3.5.22-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat&logo=vite&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-9.14.5-00B4FF?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

- 🌍 **Interactive Map** - Click anywhere on the map to get weather data
- 🌐 **Multilingual Support** - Switch between English and Spanish
- 📊 **Data Visualization** - Charts for temperature and precipitation
- 🎨 **Modern UI** - Beautiful glassmorphism design with Tailwind CSS
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Data** - Powered by OpenWeatherMap API
- �️ **Location Search** - Search cities worldwide
- 🌤️ **7-Day Forecast** - Extended weather predictions

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.0.0 < higher) - [Download here](https://nodejs.org/)
- **npm** (v7.0.0 or higher) - Comes with Node.js

Check your versions:

```bash
node --version
npm --version
```

---

## � Installation

### 1. Clone the repository

```bash
git clone https://github.com/Wallace3101/prediccion_clima_v1.git
cd prediccion_clima_v1/clima_frontend
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages including:
- Vue 3 & Vue Router
- Vite (build tool)
- vue-i18n (internationalization)
- Chart.js & vue-chartjs (data visualization)
- Leaflet (interactive maps)
- Tailwind CSS (styling)
- Axios (HTTP client)
- And more...

### 3. Configure API Key (Optional)

The app uses OpenWeatherMap API. A default API key is included, but you can use your own:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Open `src/services/openWeatherService.js`
3. Replace the API key:

```javascript
const API_KEY = 'your_api_key_here';
```

---

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at:
```
http://localhost:5173
```

> **Note:** The port may vary if 5173 is already in use. Check the terminal output for the actual URL.

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized files will be generated in the `dist/` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

---

## � Project Structure

```
clima_frontend/
├── public/                  # Static assets
│   ├── logo_nasa.png
│   └── vite.svg
├── src/
│   ├── assets/             # Images and static resources
│   ├── components/         # Reusable Vue components
│   │   ├── HelloWorld.vue
│   │   ├── IconShowcase.vue
│   │   ├── LanguageSwitcher.vue
│   │   ├── WeatherChatbot.vue
│   │   └── WeatherChart.vue
│   ├── composables/        # Vue composables
│   │   └── useScrollAnimation.js
│   ├── i18n/               # Internationalization
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json     # English translations
│   │       └── es.json     # Spanish translations
│   ├── router/             # Vue Router configuration
│   │   └── index.js
│   ├── services/           # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── openWeatherService.js
│   │   └── weatherService.js
│   ├── store/              # Pinia state management
│   │   ├── auth.js
│   │   └── weather.js
│   ├── utils/              # Utility functions
│   │   └── helpers.js
│   ├── views/              # Page components
│   │   └── LandingPage/
│   │       ├── LandingPage.vue
│   │       ├── OpenStreetMap.vue
│   │       └── WeatherPanel.vue
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Progressive JavaScript framework |
| **Vite** | Next-generation frontend build tool |
| **Vue Router** | Official router for Vue.js |
| **Pinia** | State management library |
| **vue-i18n** | Internationalization plugin |
| **Tailwind CSS** | Utility-first CSS framework |
| **Chart.js** | JavaScript charting library |
| **Leaflet** | Interactive map library |
| **Axios** | Promise-based HTTP client |
| **GSAP** | Animation library |
| **OpenWeatherMap API** | Weather data provider |

---

## 🌐 Internationalization (i18n)

The app supports multiple languages:

- 🇺🇸 **English** (default)
- 🇪🇸 **Spanish**

### Changing Language

Users can switch languages using the language selector in the top-right corner of the application.

### Adding New Languages

1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json` for French)
2. Copy the structure from `en.json` or `es.json`
3. Translate all strings
4. Import and register the locale in `src/i18n/index.ts`
5. Add the language option to `LanguageSwitcher.vue`

---

## � Customization

### Changing Default Language

Edit `src/i18n/index.ts`:

```typescript
const i18n = createI18n({
  legacy: false,
  locale: 'en', // Change to 'es' for Spanish
  fallbackLocale: 'en',
  // ...
})
```

### Styling

The app uses Tailwind CSS. To customize the theme, edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors
      },
    },
  },
}
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the correct URL.

### Module Not Found Errors

Try deleting `node_modules` and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Clear the Vite cache:

```bash
rm -rf node_modules/.vite
npm run dev
```

---

## 🔌 Backend Integration

This frontend is designed to work with a Django REST API backend. The following endpoints are configured:

### Authentication
```
POST   /api/auth/login/
POST   /api/auth/register/
POST   /api/auth/logout/
GET    /api/auth/user/
POST   /api/auth/token/refresh/
```

### Weather
```
GET    /api/weather/current/
GET    /api/weather/prediction/
GET    /api/weather/favorites/
POST   /api/weather/favorites/
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 📚 Additional Documentation

- **`DJANGO_SETUP.md`** - Guide for Django backend setup
- **`I18N_GUIDE.md`** - Internationalization implementation guide
- **`TRADUCCIONES_FALTANTES_SOLUCION.md`** - Translation fixes documentation
- **`CHECKLIST.md`** - Project checklist

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Wallace3101**

- GitHub: [@Wallace3101](https://github.com/Wallace3101)
- Repository: [prediccion_clima_v1](https://github.com/Wallace3101/prediccion_clima_v1)
- Branch: `leonardo`

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Vue.js](https://vuejs.org/) team for the amazing framework
- [Leaflet](https://leafletjs.com/) for the mapping library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) for data visualization

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the documentation files in the project
3. Open an issue on [GitHub](https://github.com/Wallace3101/prediccion_clima_v1/issues)

---

<p align="center">
  <strong>Made with ❤️ and ☕</strong><br>
  <sub>Built with Vue 3 • Powered by OpenWeatherMap</sub>
</p>
