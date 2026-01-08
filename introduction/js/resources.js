document.addEventListener('DOMContentLoaded', () => {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                currentTime: '',
                systemLogs: [
                    "> Initializing secure connection...",
                    "> Accessing Forbidden Codex...",
                    "> All modules up to date."
                ],
                activeLogs: []
            }
        },
        mounted() {
            // Start the Clock
            this.updateTime();
            setInterval(this.updateTime, 1000);

            // Start the Terminal Log Animation
            this.runSystemLogs();
        },
        methods: {
            updateTime() {
                const now = new Date();
                this.currentTime = now.toLocaleTimeString();
            },
            runSystemLogs() {
                // Adds logs one by one for a "loading" effect
                this.systemLogs.forEach((log, index) => {
                    setTimeout(() => {
                        this.activeLogs.push(log);
                    }, (index + 1) * 800);
                });
            }
        }
    }).mount('#resources-app');
});