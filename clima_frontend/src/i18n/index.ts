import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

// Detectar idioma del navegador o usar inglés por defecto
const getBrowserLanguage = () => {
  const browserLang = navigator.language.split('-')[0]
  return ['es', 'en'].includes(browserLang) ? browserLang : 'en'
}

// Obtener idioma guardado en localStorage o usar inglés por defecto
// Si no hay idioma guardado, siempre usa inglés (no detecta navegador)
const getSavedLanguage = () => {
  const saved = localStorage.getItem('user-language')
  return saved || 'en' // Siempre inglés por defecto
}

const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: getSavedLanguage(), // Idioma por defecto
  fallbackLocale: 'en', // Idioma de respaldo (inglés)
  messages: {
    es,
    en
  },
  globalInjection: true // Permite usar $t en templates
})

// Función para cambiar idioma
export const changeLanguage = (locale: 'es' | 'en') => {
  i18n.global.locale.value = locale
  localStorage.setItem('user-language', locale)
  document.documentElement.setAttribute('lang', locale)
}

// Función para obtener el idioma actual
export const getCurrentLanguage = (): 'es' | 'en' => {
  return i18n.global.locale.value as 'es' | 'en'
}

// Establecer atributo lang en el HTML
document.documentElement.setAttribute('lang', getSavedLanguage())

export default i18n
