document.addEventListener('DOMContentLoaded', () => {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                filter: 'learning',
                currentTime: new Date().toLocaleTimeString(),
                resources: [
                    // LEARNING
                    { name: "MDN WEB DOCS", desc: "The definitive encyclopedia for web developers.", url: "https://developer.mozilla.org", icon: "📖", category: "learning", flipped: false },
                    { name: "CSS TRICKS", desc: "Mastering the art of modern layouts.", url: "https://css-tricks.com", icon: "🎨", category: "learning", flipped: false },
                    { name: "W3SCHOOLS", desc: "The classic training grounds for web sorcery and coding basics.", url: "https://www.w3schools.com", icon: "🏫", category: "learning", flipped: false },
                    { name: "KHAN ACADEMY", desc: "A vast library of universal knowledge for the aspiring polymath.", url: "https://www.khanacademy.org", icon: "🌳", category: "learning", flipped: false },

                    // PLATFORMS
                    { name: "FIREBASE", desc: "Backend engine for our real-time guestbook.", url: "https://firebase.google.com", icon: "🔥", category: "platforms", flipped: false },
                    { name: "GITHUB", desc: "The vault where the source code is kept.", url: "https://github.com", icon: "🐙", category: "platforms", flipped: false },

                    // AI HELP
                    { name: "GEMINI AI", desc: "The AI thought partner for this project.", url: "https://gemini.google.com", icon: "✨", category: "ai", flipped: false },
                    { name: "CHATGPT", desc: "Logic debugging and code optimization.", url: "https://chatgpt.com", icon: "🤖", category: "ai", flipped: false },

                    // CREDITS
                    { name: "GOOGLE FONTS", desc: "Supplying the 'Press Start 2P' typography.", url: "https://fonts.google.com", icon: "🔤", category: "credits", flipped: false },
                    { name: "ITCH.IO", desc: "Inspiration for pixel art and game UI.", url: "https://itch.io", icon: "🎮", category: "credits", flipped: false },

                    // ASSETS
                    { name: "FLATICON", desc: "Source for various pixelated icons.", url: "https://flaticon.com", icon: "📦", category: "assets", flipped: false }
                ]
            }
        },
        computed: {
            filteredResources() {
                return this.resources.filter(r => r.category === this.filter);
            }
        },
        mounted() {
            setInterval(() => {
                this.currentTime = new Date().toLocaleTimeString();
            }, 1000);
        }
    }).mount('#resources-app');
});