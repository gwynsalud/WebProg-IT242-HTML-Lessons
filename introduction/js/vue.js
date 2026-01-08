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
  console.log("1. App starting...");

  // --- 1. FIREBASE SETUP ---
  const firebaseConfig = {
    databaseURL: "https://rpg-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app/", 
  };
  
  // Initialize Firebase (Safeguard against double-init)
  if (typeof firebase === 'undefined') {
    console.error("Firebase SDK not loaded! Check your HTML script tags.");
    return;
  }
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("2. Firebase initialized");
  }
  const db = firebase.database();

  // --- 2. VUE APPLICATION ---
  const { createApp } = Vue;

  const app = createApp({
    data() {
      return {
        gameStarted: false,
        isPaused: false,
        newName: '',
        newMessage: '',
        submitted: false,
        entries: [] // This holds your data
      }
    },
    mounted() {
      console.log("3. Vue Mounted successfully!");
      
      // Initialize Scroll Lock
      this.checkInitialLock();

      // --- LISTEN FOR DATA ---
      console.log("4. Listening for database changes...");
      const guestbookRef = db.ref('guestbook');
      
      guestbookRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("5. Data received from Firebase:", data); // Check your Console for this!

        if (data) {
          // Convert object (Firebase format) to Array (Vue format)
          this.entries = Object.keys(data).map(key => {
            return { 
              id: key, 
              ...data[key] 
            };
          }).reverse(); // Show newest first
        } else {
          console.warn("Database is empty or path is wrong.");
          this.entries = [];
        }
      }, (error) => {
        console.error("Firebase Read Error:", error);
        alert("Cannot load guestbook. Check console for permission errors.");
      });

      // Keyboard Shortcuts
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
        document.body.style.overflow = this.isPaused ? 'hidden' : (this.gameStarted ? 'auto' : 'hidden');
      },

      navigateTo(sectionId) {
        this.isPaused = false;
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
            alert("Could not write to database. Check rules.");
          });
      }
    }
  });

  // MOUNT TO THE DIV
  // Make sure your HTML has <div id="guestbook-app"> wrapping the content
  app.mount('#guestbook-app');
});