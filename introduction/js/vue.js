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


document.addEventListener('DOMContentLoaded', () => {
  // 1. Firebase Config
  const firebaseConfig = {
    databaseURL: "https://rpg-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app/", 
  };
  
  // Initialize Firebase only once
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();

  // 2. Initialize Vue
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
      // Listen for data
      db.ref('guestbook').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Object to Array conversion
          this.entries = Object.keys(data).map(key => data[key]).reverse();
        } else {
          this.entries = [];
        }
      }, (error) => {
        console.error("Firebase Read Error:", error);
      });
    },
    methods: {
      addEntry() {
        if (this.submitted || !this.newName.trim() || !this.newMessage.trim()) return;

        const entryData = {
          name: this.newName,
          message: this.newMessage,
          date: new Date().toLocaleDateString()
        };

        db.ref('guestbook').push(entryData)
          .then(() => {
            // SUCCESS LOGIC
            this.submitted = true;
            this.newName = '';
            this.newMessage = '';

            setTimeout(() => {
              this.submitted = false;
            }, 3000);
          })
          .catch(err => {
            console.error("Database Write Error:", err);
            alert("Database Error: Check Console.");
          });
      }
    }
  }).mount('#guestbook-app');
});