import Dashboard from './components/Dashboard.js';
import Materi from './components/materi.js';
import Template from './components/Template.js';
import FinalAssignment from './components/FinalAssignment.js';
import Sinkronus from './components/Sinkronus.js';
import Attendance from './components/Attendance.js';

class Router {
    constructor() {
        this.routes = {
            'dashboard': Dashboard,
            'materi': Materi,
            'template': Template,
            'final': FinalAssignment,
            'sinkronus': Sinkronus,
            'attendance': Attendance
        };
        this.currentPage = null;
    }

    init() {
        // Handle tab clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-btn')) {
                const tab = e.target.closest('.tab-btn').dataset.tab;
                this.navigate(tab);
            }
        });

        const savedPage = localStorage.getItem('currentPage') || 'dashboard';
        this.navigate(savedPage);
    }

    async navigate(page) {
        console.log(`🔄 Navigating to: ${page}`);

        localStorage.setItem('currentPage', page);
        
        // Update active tab
        this.updateActiveTab(page);
        
        // Show loading
        this.showLoading();
        
        try {
            if (this.routes[page]) {
                const PageComponent = this.routes[page];
                const content = await PageComponent.render();
                document.getElementById('content').innerHTML = content;
                
                // Initialize page if method exists
                if (PageComponent.init) {
                    await PageComponent.init();
                }
            } else {
                throw new Error(`Page ${page} not found`);
            }
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 768) {
                document.getElementById('sidebar').classList.add('hidden');
                document.getElementById('mobileOverlay').classList.remove('active');
            }
            
        } catch (error) {
            console.error('❌ Navigation error:', error);
            this.showError(error.message);
        }
    }

    updateActiveTab(activeTab) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to current tab
        const currentTab = document.querySelector(`[data-tab="${activeTab}"]`);
        if (currentTab) {
            currentTab.classList.add('active');
        }
    }

    showLoading() {
        document.getElementById('content').innerHTML = `
            <div class="flex justify-center items-center h-64">
                <div class="loading-spinner"></div>
                <span class="ml-3 text-gray-600">Memuat...</span>
            </div>
        `;
    }

    showError(message) {
        document.getElementById('content').innerHTML = `
            <div class="p-8 text-center text-red-600">
                <h2 class="text-xl font-bold">Error</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                    Muat Ulang Halaman
                </button>
            </div>
        `;
    }
}

export default Router;