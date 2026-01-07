const { createApp } = Vue;

createApp({
  data() {
    return {
      newName: '',
      newMessage: '',
      submitted: false,
      entries: JSON.parse(localStorage.getItem('rpg_guestbook')) || []
    }
  },
  methods: {
    addEntry() {
      const entry = {
        name: this.newName,
        message: this.newMessage,
        date: new Date().toLocaleDateString()
      };
      
      this.entries.unshift(entry);
      localStorage.setItem('rpg_guestbook', JSON.stringify(this.entries));
      
      // Trigger Success State
      this.submitted = true;
      
      // Clear Form
      this.newName = '';
      this.newMessage = '';

      // Reset the button after 3 seconds
      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    }
  }
}).mount('#guestbook-app');