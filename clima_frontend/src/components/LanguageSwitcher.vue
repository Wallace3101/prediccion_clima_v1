<template>
  <div class="language-switcher">
    <button 
      @click="toggleMenu"
      class="language-button"
      :aria-label="t('common.language')"
    >
      <div class="flag-icon">{{ currentFlag }}</div>
      <span class="language-text">{{ currentLanguage }}</span>
      <svg 
        class="chevron-icon" 
        :class="{ 'rotate': isOpen }"
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="language-menu">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="language-option"
          :class="{ 'active': locale === lang.code }"
        >
          <span class="flag-icon">{{ lang.flag }}</span>
          <span class="language-name">{{ lang.name }}</span>
          <svg 
            v-if="locale === lang.code"
            class="check-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { changeLanguage } from '../i18n'

const { t, locale } = useI18n()
const isOpen = ref(false)

const languages: Array<{ code: 'es' | 'en', name: string, flag: string }> = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

const currentFlag = computed(() => {
  const current = languages.find(lang => lang.code === locale.value)
  return current?.flag || '🌐'
})

const currentLanguage = computed(() => {
  const current = languages.find(lang => lang.code === locale.value)
  return current?.code.toUpperCase() || 'ES'
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (code: 'es' | 'en') => {
  changeLanguage(code)
  isOpen.value = false
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1001;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(20, 20, 30, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.language-button:hover {
  background: rgba(30, 30, 45, 0.95);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.2);
}

.flag-icon {
  font-size: 20px;
  line-height: 1;
}

.language-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.chevron-icon {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.language-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.language-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.language-option:hover {
  background: rgba(102, 126, 234, 0.15);
}

.language-option.active {
  background: rgba(102, 126, 234, 0.2);
}

.language-option:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.language-name {
  flex: 1;
  font-weight: 500;
}

.check-icon {
  color: #667eea;
  flex-shrink: 0;
}

/* Animaciones */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .language-switcher {
    top: 16px;
    right: 16px;
  }

  .language-button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .language-text {
    display: none;
  }

  .flag-icon {
    font-size: 18px;
  }

  .language-menu {
    min-width: 140px;
  }
}
</style>
