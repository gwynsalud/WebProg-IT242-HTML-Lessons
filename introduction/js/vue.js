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
    databaseURL: "https://rpg-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app/", 
  };
  
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
        isPaused: false, // This MUST be false initially
        newName: '',
        newMessage: '',
        submitted: false,
        entries: []
      }
    },
    mounted() {
      this.checkInitialLock();

      db.ref('guestbook').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.entries = Object.keys(data).map(key => data[key]).reverse();
        }
      });

      // Keyboard shortcut to close menu
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
        this.isPaused = false; // Close menu if it was open
        localStorage.setItem('site_unlocked', 'true');
        document.body.classList.remove('scroll-locked');
        this.navigateTo('characters');
      },

      togglePause() {
        this.isPaused = !this.isPaused;
        // Apply scroll locking based on pause state
        if (this.isPaused) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = this.gameStarted ? 'auto' : 'hidden';
        }
      },

      navigateTo(sectionId) {
        // CLOSE THE MENU FIRST
        this.isPaused = false;
        document.body.style.overflow = 'auto';
        
        // Smooth scroll to target
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