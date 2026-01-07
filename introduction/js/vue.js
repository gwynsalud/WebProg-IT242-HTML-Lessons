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
    // SYNC DATA
    db.ref('guestbook').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and reverse it (newest first)
        this.entries = Object.values(data).reverse();
      }
    });
  },
  methods: {
    addEntry() {
      // SAVE DATA
      const newPostKey = db.ref().child('guestbook').push().key;
      const entryData = {
        name: this.newName,
        message: this.newMessage,
        date: new Date().toLocaleDateString()
      };

      db.ref('guestbook/' + newPostKey).set(entryData)
        .then(() => {
          this.submitted = true;
          this.newName = '';
          this.newMessage = '';
          setTimeout(() => { this.submitted = false; }, 3000);
        });
    }
  }
}).mount('#guestbook-app');