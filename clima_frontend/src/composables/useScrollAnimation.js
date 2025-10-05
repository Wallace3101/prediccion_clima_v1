import { ref, onMounted, onUnmounted, watch } from 'vue';

export function useScrollAnimation(options = {}) {
  const elementRef = ref(null);
  const observer = ref(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px',
    ...options
  };

  const initObserver = () => {
    if (observer.value) {
      observer.value.disconnect();
    }

    observer.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, defaultOptions);

    if (elementRef.value) {
      observer.value.observe(elementRef.value);
    }
  };

  const observeElement = (element, customOptions = {}) => {
    if (!element) return;

    const opts = { ...defaultOptions, ...customOptions };

    const tempObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, opts);

    if (element instanceof Element) {
      tempObserver.observe(element);
    } else if (Array.isArray(element)) {
      element.forEach(el => {
        if (el) tempObserver.observe(el);
      });
    }
  };

  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect();
    }
  };

  // Watch para observar cuando elementRef tenga un valor
  watch(elementRef, (newVal) => {
    if (newVal) {
      initObserver();
    }
  });

  onMounted(() => {
    if (elementRef.value) {
      initObserver();
    }
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    elementRef,
    observeElement,
    disconnect
  };
}

export default useScrollAnimation;
