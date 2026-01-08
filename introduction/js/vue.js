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
  
  // --- 1. FIREBASE SETUP ---
  const firebaseConfig = {
    databaseURL: "https://rpg-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app/", 
  };
  
  // Initialize Firebase once
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();

  // --- 2. VUE APPLICATION ---
  const { createApp } = Vue;

  createApp({
    data() {
      return {
        gameStarted: false,
        isPaused: false,
        newName: '',
        newMessage: '',
        submitted: false,
        entries: []
      }
    },
    mounted() {
      this.checkInitialLock();

      // Re-added the error handling block from your working version
      db.ref('guestbook').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.entries = Object.keys(data).map(key => data[key]).reverse();
        } else {
          this.entries = [];
        }
      }, (error) => {
        console.error("Firebase Read Error:", error);
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
          this.togglePause();
        }
      });
    },
    methods: {
      checkInitialLock() {
        const unlocked = localStorage.getItem('site_unlocked');
        if (unlocked === 'true') {
          this.gameStarted = true;
          document.body.classList.remove('scroll-locked');
        } else {
          document.body.classList.add('scroll-locked');
        }
      },

      startGame() {
        this.gameStarted = true;
        this.isPaused = false;
        localStorage.setItem('site_unlocked', 'true');
        document.body.classList.remove('scroll-locked');
        this.navigateTo('characters');
      },

      togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = this.gameStarted ? 'auto' : 'hidden';
        }
      },

      navigateTo(sectionId) {
        this.isPaused = false;
        // Restore overflow based on game state
        document.body.style.overflow = this.gameStarted ? 'auto' : 'hidden';
        
        this.$nextTick(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      },

      addEntry() {
        if (this.submitted || !this.newName.trim() || !this.newMessage.trim()) return;
        
        const entryData = {
          name: this.newName,
          message: this.newMessage,
          date: new Date().toLocaleDateString()
        };

        db.ref('guestbook').push(entryData)
          .then(() => {
            this.submitted = true;
            this.newName = '';
            this.newMessage = '';
            setTimeout(() => { this.submitted = false; }, 3000);
          })
          .catch(err => {
            console.error("Database Write Error:", err);
            alert("Database Error: Check Console.");
          });
      }
    }
  }).mount('#guestbook-app');
});