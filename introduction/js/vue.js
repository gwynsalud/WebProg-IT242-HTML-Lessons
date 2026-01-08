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


window.onload = () => {
  // --- 1. FIREBASE SETUP ---
  const firebaseConfig = {
    databaseURL: "YOUR_FIREBASE_URL", 
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
        // Navigation & UI States
        gameStarted: false,
        isPaused: false,
        
        // Guestbook Data
        newName: '',
        newMessage: '',
        submitted: false,
        entries: []
      }
    },
    mounted() {
      // Check if user has already "Started" previously
      this.checkInitialLock();

      // Sync Guestbook with Firebase
      db.ref('guestbook').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.entries = Object.keys(data).map(key => data[key]).reverse();
        } else {
          this.entries = [];
        }
      });

      // Global Keyboard Shortcuts (P for Pause)
      window.addEventListener('keydown', (e) => {
        if (this.gameStarted && (e.key === 'Escape' || e.key.toLowerCase() === 'p')) {
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
        localStorage.setItem('site_unlocked', 'true');
        document.body.classList.remove('scroll-locked');
        this.navigateTo('characters');
      },

      togglePause() {
        this.isPaused = !this.isPaused;
        document.body.style.overflow = this.isPaused ? 'hidden' : (this.gameStarted ? 'auto' : 'hidden');
      },

      navigateTo(sectionId) {
        this.isPaused = false;
        document.body.style.overflow = 'auto';
        
        this.$nextTick(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
      },

      addEntry() {
        if (this.submitted || !this.newName.trim() || !this.newMessage.trim()) return;

        const entryData = {
          name: this.newName,
          message: this.newMessage,
          date: new Date().toLocaleDateString()
        };

        db.ref('guestbook').push(entryData).then(() => {
          this.submitted = true;
          this.newName = '';
          this.newMessage = '';
          setTimeout(() => { this.submitted = false; }, 3000);
        });
      }
    }
  }).mount('#guestbook-app');
};