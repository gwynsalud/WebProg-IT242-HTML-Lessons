// Firebase Configuration
const firebaseConfig = {
  databaseURL: "https://rpg-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const { createApp } = Vue;

createApp({
  data() {
    return {
      newName: '',
      newMessage: '',
      submitted: false,
      entries: []
    }
  },
  mounted() {
    // Sync from Firebase
    db.ref('guestbook').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const result = Object.keys(data).map(key => data[key]);
        this.entries = result.reverse(); // Newest travelers at the top
      }
    });
  },
  methods: {
    addEntry() {
      // Basic validation
      if (!this.newName.trim() || !this.newMessage.trim()) return;

      const entry = {
        name: this.newName,
        message: this.newMessage,
        date: new Date().toLocaleDateString()
      };
      
      // Save to Firebase
      db.ref('guestbook').push(entry)
        .then(() => {
          // Trigger Success State
          this.submitted = true;
          
          // Clear Form
          this.newName = '';
          this.newMessage = '';

          // Reset the button after 3 seconds
          setTimeout(() => {
            this.submitted = false;
          }, 3000);
        })
        .catch(error => {
          console.error("Database Error:", error);
          alert("Could not sign the ledger. Check your Firebase Rules!");
        });
    }
  }
}).mount('#guestbook-app');