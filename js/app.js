// js/app.js
import Router from './router.js';
import Auth from './auth.js';
import Layout from './components/Layout.js';

class App {
    constructor() {
        this.router = new Router();
        this.auth = new Auth();
        this.layout = new Layout();
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Kampus Riset App...');
        
        // Initialize auth
        await this.auth.init();
        
        // Check authentication
        if (!this.auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Render layout
        await this.layout.render();
        
        // Initialize router
        this.router.init();
        
        console.log('✅ App initialized successfully');
    }
}

// Start the application
new App();