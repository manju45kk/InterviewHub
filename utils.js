export const toastBus = {
  listeners: [],

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },

  emit(message, type = "success") {
    this.listeners.forEach(fn => fn({ message, type }));
  }
};
