document.addEventListener('DOMContentLoaded', () => {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                filter: 'learning',
                resources: [
                    { 
                        name: "JS INFO", 
                        desc: "Master the ancient scripts of JavaScript.",
                        url: "https://javascript.info",
                        icon: "📜",
                        category: "learning",
                        flipped: false 
                    },
                    { 
                        name: "UNDRAW", 
                        desc: "Summon vector illustrations for your UI.",
                        url: "https://undraw.co",
                        icon: "🖼️",
                        category: "assets",
                        flipped: false 
                    }
                ]
            }
        },
        computed: {
            filteredResources() {
                return this.resources.filter(r => r.category === this.filter);
            }
        }
    }).mount('#guestbook-app');
});