const { createApp } = Vue;

createApp({
  data() {
    return {
      newName: '',
      newMessage: '',
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
      
      // Reset Form
      this.newName = '';
      this.newMessage = '';
      
      alert("Quest Complete: Ledger Signed!");
    }
  }
}).mount('#guestbook-app');