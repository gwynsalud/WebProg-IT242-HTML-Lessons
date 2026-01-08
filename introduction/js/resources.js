document.addEventListener('DOMContentLoaded', () => {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                filter: 'learning',
                currentTime: '',
                // Add your real resource links here!
                resources: [
                    { 
                        name: "JS SECRETS", 
                        desc: "Ancient documentation for modern scripts.",
                        url: "https://javascript.info",
                        icon: "📜",
                        category: "learning",
                        flipped: false 
                    },
                    { 
                        name: "VUE SCROLLS", 
                        desc: "The holy guide to reactive components.",
                        url: "https://vuejs.org",
                        icon: "⚡",
                        category: "learning",
                        flipped: false 
                    },
                    { 
                        name: "PIXEL ASSETS", 
                        desc: "Loot icons and sprites for your inventory.",
                        url: "https://itch.io/game-assets/free/tag-pixel-art",
                        icon: "💎",
                        category: "assets",
                        flipped: false 
                    },
                    { 
                        name: "UI POTIONS", 
                        desc: "Color palettes to heal your design.",
                        url: "https://coolors.co",
                        icon: "🧪",
                        category: "assets",
                        flipped: false 
                    }
                ]
            }
        },
        computed: {
            filteredResources() {
                // Returns only cards that match the selected tab
                return this.resources.filter(r => r.category === this.filter);
            }
        },
        mounted() {
            this.updateTime();
            setInterval(this.updateTime, 1000);
        },
        methods: {
            updateTime() {
                const now = new Date();
                this.currentTime = now.toLocaleTimeString();
            }
        }
    }).mount('#guestbook-app');
});