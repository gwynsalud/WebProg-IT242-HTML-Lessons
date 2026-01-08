// const { createApp } = Vue;

// createApp({
//   data() {
//     return {
//       newName: '',
//       newMessage: '',
//       submitted: false,
//       entries: JSON.parse(localStorage.getItem('rpg_guestbook')) || []
//     }
//   },
//   methods: {
//     addEntry() {
//       const entry = {
//         name: this.newName,
//         message: this.newMessage,
//         date: new Date().toLocaleDateString()
//       };
      
//       this.entries.unshift(entry);
//       localStorage.setItem('rpg_guestbook', JSON.stringify(this.entries));
      
//       // Trigger Success State
//       this.submitted = true;
      
//       // Clear Form
//       this.newName = '';
//       this.newMessage = '';

//       // Reset the button after 3 seconds
//       setTimeout(() => {
//         this.submitted = false;
//       }, 3000);
//     }
//   }
// }).mount('#guestbook-app');


const { createApp } = Vue;

// 1. Initialize Firebase (Ensure this is outside the Vue app)
const firebaseConfig = {
  databaseURL: "YOUR_DATABASE_URL_HERE", 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

createApp({
  data() {
    return {
      newName: '',
      newMessage: '',
      submitted: false, // This controls the button text
      entries: []
    }
  },
  mounted() {
    // Sync data from Firebase
    db.ref('guestbook').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and reverse for newest-first display
        this.entries = Object.keys(data).map(key => data[key]).reverse();
      }
    });
  },
  methods: {
    addEntry() {
      // Prevent accidental double-clicks or empty submissions
      if (this.submitted || !this.newName.trim() || !this.newMessage.trim()) return;

      const entryData = {
        name: this.newName,
        message: this.newMessage,
        date: new Date().toLocaleDateString()
      };

      // Push to Firebase
      db.ref('guestbook').push(entryData)
        .then(() => {
          // ONLY trigger "Quest Complete" once the database confirms success
          this.submitted = true;
          
          // Clear inputs
          this.newName = '';
          this.newMessage = '';

          // Reset button back to "SIGN LEDGER" after 3 seconds
          setTimeout(() => {
            this.submitted = false;
          }, 3000);
        })
        .catch(err => {
          console.error("Database Error:", err);
          alert("Guild Ledger is locked! Check security rules.");
        });
    }
  }
}).mount('#guestbook-app');