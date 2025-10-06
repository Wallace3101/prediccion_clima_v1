<template>
  <div class="chatbot-container">
    <!-- Botón flotante -->
    <transition name="bounce">
      <button 
        v-if="!isOpen"
        @click="toggleChat"
        class="chatbot-button"
        :aria-label="t('chatbot.aria.openChat')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="notification-badge"></span>
      </button>
    </transition>

    <!-- Ventana del chat -->
    <transition name="slide-up">
      <div v-if="isOpen" class="chat-window">
        <!-- Header del chat -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="status-indicator"></div>
            <div>
              <h3 class="chat-title">{{ t('chatbot.title') }}</h3>
              <p class="chat-status">{{ t('chatbot.status') }}</p>
            </div>
          </div>
          <button 
            @click="toggleChat" 
            class="close-button"
            :aria-label="t('chatbot.aria.closeChat')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Cuerpo del chat -->
        <div class="chat-body" ref="chatBody">
          <!-- Mensaje de bienvenida -->
          <div class="message bot-message">
            <div class="message-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <div class="message-content">
              <p>{{ t('chatbot.greeting') }}</p>
              <p class="message-small">{{ t('chatbot.developmentMessage') }}</p>
              <ul class="feature-list">
                <li>🌤️ {{ t('chatbot.features.forecasts') }}</li>
                <li>📊 {{ t('chatbot.features.analysis') }}</li>
                <li>🌡️ {{ t('chatbot.features.alerts') }}</li>
                <li>🗺️ {{ t('chatbot.features.locations') }}</li>
              </ul>
            </div>
          </div>

          <!-- Mensajes del chat -->
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="message"
            :class="message.type === 'user' ? 'user-message' : 'bot-message'"
          >
            <div v-if="message.type === 'bot'" class="message-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <div class="message-content">
              <p>{{ message.text }}</p>
              <span class="message-time">{{ message.time }}</span>
            </div>
          </div>

          <!-- Indicador de escritura -->
          <div v-if="isTyping" class="message bot-message">
            <div class="message-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer del chat -->
        <div class="chat-footer">
          <div class="input-wrapper">
            <input 
              v-model="userInput"
              @keypress.enter="sendMessage"
              type="text" 
              :placeholder="t('chatbot.placeholder')"
              class="chat-input"
              :disabled="true"
            />
            <button 
              @click="sendMessage" 
              class="send-button"
              :disabled="!userInput.trim() || true"
              :aria-label="t('chatbot.aria.sendMessage')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <p class="development-notice">
            {{ t('chatbot.developmentNotice') }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Message {
  type: 'user' | 'bot'
  text: string
  time: string
}

const isOpen = ref(false)
const userInput = ref('')
const messages = ref<Message[]>([])
const isTyping = ref(false)
const chatBody = ref<HTMLElement | null>(null)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  if (!userInput.value.trim()) return

  // Agregar mensaje del usuario
  messages.value.push({
    type: 'user',
    text: userInput.value,
    time: getCurrentTime()
  })

  const userMessage = userInput.value
  userInput.value = ''
  scrollToBottom()

  // Simular respuesta del bot
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      type: 'bot',
      text: t('chatbot.autoResponse'),
      time: getCurrentTime()
    })
    scrollToBottom()
  }, 1500)
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

/* Botón flotante */
.chatbot-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.chatbot-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
}

.chatbot-button:active {
  transform: scale(0.95);
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: #ff4757;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

/* Ventana del chat */
.chat-window {
  width: 380px;
  height: 550px;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  background: #ffd93d;
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.chat-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.chat-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 2px 0 0 0;
}

.close-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Cuerpo del chat */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.chat-body::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 3px;
}

/* Mensajes */
.message {
  display: flex;
  gap: 10px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.message-content {
  max-width: 70%;
  background: rgba(102, 126, 234, 0.1);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.user-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.message-content p {
  margin: 0 0 8px 0;
  color: white;
  font-size: 14px;
  line-height: 1.5;
}

.message-content p:last-child {
  margin-bottom: 0;
}

.message-small {
  font-size: 13px;
  opacity: 0.9;
}

.feature-list {
  margin: 8px 0 0 0;
  padding-left: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.feature-list li {
  margin: 4px 0;
  font-size: 13px;
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
  display: block;
}

/* Indicador de escritura */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

/* Footer */
.chat-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
  background: rgba(10, 10, 15, 0.8);
}

.input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.chat-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.chat-input:focus {
  border-color: rgba(102, 126, 234, 0.6);
  background: rgba(255, 255, 255, 0.08);
}

.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.send-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.development-notice {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin: 0;
  font-style: italic;
}

/* Transiciones */
.bounce-enter-active {
  animation: bounce-in 0.5s ease;
}

.bounce-leave-active {
  animation: bounce-out 0.3s ease;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .chatbot-container {
    bottom: 16px;
    right: 16px;
  }

  .chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 100px);
  }

  .chatbot-button {
    width: 56px;
    height: 56px;
  }
}
</style>
