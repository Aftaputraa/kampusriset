import { getWeekData } from '../../data/weekData.js';
import Auth from '../auth.js'; // Import Auth

class Materi {
    static currentWeek = 1;
    static currentCourseIndex = 0;
    static currentVideoIndex = 0;
    static auth = new Auth(); // Gunakan Auth yang sama

    static async render() {
        const progress = await this.auth.getCourseProgress(); // Gunakan auth.getCourseProgress()
        const weekData = getWeekData();
        
        // Ambil semua week yang ada data-nya
        const availableWeeks = Object.keys(weekData).filter(weekId => 
            weekData[weekId].materials && weekData[weekId].materials.length > 0
        );

        const currentWeekData = weekData[this.currentWeek];
        const weekProgress = progress[this.currentWeek] || {};
        const completedCount = Object.values(weekProgress).filter(Boolean).length;
        const totalCount = currentWeekData?.materials?.length || 0;

        return `
            <div class="max-w-6xl mx-auto">
                <div class="bg-white shadow-lg rounded-xl md:rounded-2xl overflow-hidden">
                    <div class="p-4 md:p-6 border-b border-gray-200">
                        <h1 class="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Materi Asinkron</h1>
                        <p class="text-gray-600 mt-1 text-sm md:text-base">Pelajari materi e-course sesuai roadmap yang telah ditentukan</p>
                    </div>
                    
                    <!-- Tab Navigation untuk Pekan -->
                    <div class="border-b border-gray-200 bg-gray-50">
                        <div class="flex overflow-x-auto">
                            ${availableWeeks.map(weekId => {
                                const weekProgress = progress[weekId] || {};
                                const weekCompletedCount = Object.values(weekProgress).filter(Boolean).length;
                                const weekTotalCount = weekData[weekId]?.materials?.length || 0;
                                const isActive = weekId == this.currentWeek;
                                
                                return `
                                <button class="tab-button flex-shrink-0 px-4 py-3 font-medium text-sm border-b-2 border-transparent hover:bg-white hover:text-blue-600 transition ${isActive ? 'bg-white text-blue-600 border-blue-600' : 'text-gray-600'}" 
                                        data-week="${weekId}">
                                    <div class="flex items-center space-x-2">
                                        <span>Pekan ${weekId}</span>
                                        ${weekCompletedCount === weekTotalCount && weekTotalCount > 0 ? 
                                            '<span class="text-green-500">✓</span>' : 
                                            weekCompletedCount > 0 ? 
                                            `<span class="text-blue-500 text-xs">${weekCompletedCount}/${weekTotalCount}</span>` : 
                                            ''
                                        }
                                    </div>
                                </button>`;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="p-4 md:p-6">
                        <!-- Week Info & Progress -->
                        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
                            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h2 class="text-xl md:text-2xl font-bold text-gray-900">${currentWeekData.title}</h2>
                                    <p class="text-gray-600 mt-1">${totalCount} e-course tersedia</p>
                                </div>
                                <div class="bg-white rounded-full px-4 py-2 border border-blue-200">
                                    <span class="text-blue-700 font-medium text-sm">
                                        ${completedCount}/${totalCount} selesai
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                            <!-- Course List -->
                            <div class="lg:col-span-1">
                                <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <h3 class="font-semibold text-gray-800 mb-3">Daftar E-Course</h3>
                                    <div class="space-y-2 max-h-96 overflow-y-auto">
                                        ${currentWeekData.materials.map((course, index) => {
                                            const isCompleted = weekProgress[course.title] || false;
                                            const isActive = index === this.currentCourseIndex;
                                            
                                            return `
                                            <button class="course-item w-full text-left p-3 rounded-lg transition ${isActive ? 'bg-blue-100 border border-blue-300 text-blue-700' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'} ${isCompleted ? 'border-green-200' : ''}"
                                                    data-course-index="${index}">
                                                <div class="flex items-center space-x-3">
                                                    <div class="w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} ${isCompleted ? '!bg-green-500' : ''}">
                                                        ${isCompleted ? '✓' : index + 1}
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <div class="font-medium text-sm truncate">${course.title}</div>
                                                        <div class="text-xs text-gray-500 mt-1">
                                                            ${course.videos.length} video
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>`;
                                        }).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- Course Content -->
                            <div class="lg:col-span-3">
                                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                    ${this.renderCourseContent(currentWeekData.materials[this.currentCourseIndex], weekProgress)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderCourseContent(course, weekProgress) {
        if (!course) {
            return `
                <div class="p-8 text-center">
                    <p class="text-gray-500">Tidak ada course yang tersedia</p>
                </div>
            `;
        }

        const isCompleted = weekProgress[course.title] || false;
        const currentVideo = course.videos[this.currentVideoIndex];

        return `
            <!-- Course Header -->
            <div class="border-b border-gray-200 p-4 md:p-6">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2">${course.title}</h3>
                        <p class="text-gray-600 text-sm">${course.description}</p>
                    </div>
                    ${isCompleted ? `
                        <span class="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            <ion-icon name="checkmark-circle"></ion-icon>
                            <span>Selesai</span>
                        </span>
                    ` : ''}
                </div>
            </div>

            <!-- Video Player & Navigation -->
            <div class="bg-black">
                <div class="video-wrapper-large">
                    <iframe src="${currentVideo.url}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            id="main-video-player">
                    </iframe>
                </div>
            </div>
            
            <!-- Video Info & Navigation -->
            <div class="p-4 md:p-6 border-b border-gray-200">
                <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2">${currentVideo.title}</h3>
                <p class="text-gray-600 mb-4">Video ${this.currentVideoIndex + 1} dari ${course.videos.length}</p>
                
                <!-- Video Navigation -->
                <div class="flex gap-3">
                    <button class="video-nav-prev flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            ${this.currentVideoIndex === 0 ? 'disabled' : ''}>
                        <ion-icon name="chevron-back-outline" class="mr-2"></ion-icon>
                        Video Sebelumnya
                    </button>
                    <button class="video-nav-next flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            ${this.currentVideoIndex === course.videos.length - 1 ? 'disabled' : ''}>
                        Video Selanjutnya
                        <ion-icon name="chevron-forward-outline" class="ml-2"></ion-icon>
                    </button>
                </div>
            </div>

            <!-- Download Section -->
            <div class="border-b border-gray-200 p-4 md:p-6 bg-blue-50">
                <h4 class="font-semibold text-blue-800 mb-3">Materi Pendukung</h4>
                <p class="text-blue-700 mb-4 text-sm">${course.description}</p>
                <div class="flex flex-col sm:flex-row gap-3">
                    ${course.download.materi !== '#' ? `
                        <a href="${course.download.materi}" target="_blank" 
                           class="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                            <ion-icon name="document-text-outline"></ion-icon>
                            <span>Download Materi</span>
                        </a>
                    ` : ''}
                    ${course.download.notulensi !== '#' ? `
                        <a href="${course.download.notulensi}" target="_blank" 
                           class="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm">
                            <ion-icon name="clipboard-outline"></ion-icon>
                            <span>Download Notulensi</span>
                        </a>
                    ` : ''}
                </div>
            </div>

            <!-- Course Navigation -->
            <div class="p-4 md:p-6">
                <div class="flex flex-col sm:flex-row gap-3">
                    <button class="course-nav-prev flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            ${this.currentCourseIndex === 0 ? 'disabled' : ''}>
                        <ion-icon name="chevron-back-outline" class="mr-2"></ion-icon>
                        Course Sebelumnya
                    </button>
                    
                    <button class="mark-complete flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                            data-course-title="${course.title}">
                        <ion-icon name="checkmark-circle-outline" class="mr-2"></ion-icon>
                        ${isCompleted ? '✓ Sudah Selesai' : 'Tandai Selesai Course'}
                    </button>
                    
                    <button class="course-nav-next flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            ${this.currentCourseIndex === this.getCurrentWeekData().materials.length - 1 ? 'disabled' : ''}>
                        Course Selanjutnya
                        <ion-icon name="chevron-forward-outline" class="ml-2"></ion-icon>
                    </button>
                </div>
            </div>
        `;
    }

    static async init() {
        this.setupTabNavigation();
        this.setupCourseNavigation();
        this.setupCourseList();
        this.setupVideoNavigation();
    }

    static setupTabNavigation() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.tab-button')) {
                const tabButton = e.target.closest('.tab-button');
                const weekId = tabButton.dataset.week;
                
                await this.switchWeek(weekId);
            }
        });
    }

    static setupCourseNavigation() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.course-nav-prev')) {
                await this.previousCourse();
            }
            
            if (e.target.closest('.course-nav-next')) {
                await this.nextCourse();
            }
            
            if (e.target.closest('.mark-complete')) {
                await this.markAsComplete();
            }
        });
    }

    static setupCourseList() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.course-item')) {
                const courseItem = e.target.closest('.course-item');
                const courseIndex = parseInt(courseItem.dataset.courseIndex);
                
                await this.switchCourse(courseIndex);
            }
        });
    }

    static setupVideoNavigation() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.video-nav-prev')) {
                await this.previousVideo();
            }
            
            if (e.target.closest('.video-nav-next')) {
                await this.nextVideo();
            }
        });
    }

    static async switchWeek(weekId) {
        this.currentWeek = weekId;
        this.currentCourseIndex = 0;
        this.currentVideoIndex = 0;
        
        // Re-render the entire component
        const content = await this.render();
        document.getElementById('content').innerHTML = content;
        
        // Re-initialize event listeners
        await this.init();
    }

    static async switchCourse(courseIndex) {
        this.currentCourseIndex = courseIndex;
        this.currentVideoIndex = 0;
        
        // Re-render only the course content section
        await this.rerenderCourseContent();
    }

    static async switchVideo(videoIndex) {
        this.currentVideoIndex = videoIndex;
        await this.rerenderCourseContent();
    }

    static async previousCourse() {
        if (this.currentCourseIndex > 0) {
            await this.switchCourse(this.currentCourseIndex - 1);
        }
    }

    static async nextCourse() {
        const weekData = this.getCurrentWeekData();
        if (this.currentCourseIndex < weekData.materials.length - 1) {
            await this.switchCourse(this.currentCourseIndex + 1);
        }
    }

    static async previousVideo() {
        if (this.currentVideoIndex > 0) {
            await this.switchVideo(this.currentVideoIndex - 1);
        }
    }

    static async nextVideo() {
        const currentCourse = this.getCurrentWeekData().materials[this.currentCourseIndex];
        if (this.currentVideoIndex < currentCourse.videos.length - 1) {
            await this.switchVideo(this.currentVideoIndex + 1);
        }
    }

    static async rerenderCourseContent() {
        const weekData = this.getCurrentWeekData();
        const progress = await this.auth.getCourseProgress(); // Gunakan auth.getCourseProgress()
        const weekProgress = progress[this.currentWeek] || {};
        const currentCourse = weekData.materials[this.currentCourseIndex];
        
        // Update course content section
        const courseContentContainer = document.querySelector('.lg\\:col-span-3 > div');
        if (courseContentContainer) {
            courseContentContainer.innerHTML = this.renderCourseContent(currentCourse, weekProgress);
        }
        
        // Update course list active state
        this.updateCourseList();
        
        // Scroll to top of course content
        const courseContent = document.querySelector('.lg\\:col-span-3');
        if (courseContent) {
            courseContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    static async markAsComplete() {
        try {
            const weekData = this.getCurrentWeekData();
            const currentCourse = weekData.materials[this.currentCourseIndex];
            
            if (!currentCourse) {
                throw new Error('Course tidak ditemukan');
            }
            
            // Gunakan method yang sama seperti di Attendance yang sudah berhasil
            await this.auth.recordCourseCompletion(
                parseInt(this.currentWeek), 
                currentCourse.title
            );
            
            this.showNotification(`"${currentCourse.title}" berhasil ditandai selesai!`, 'success');
            
            // Refresh the component to update progress
            await this.rerenderCourseContent();
            
        } catch (error) {
            console.error('Error marking as complete:', error);
            this.showNotification('Gagal menandai course: ' + error.message, 'error');
        }
    }

    static updateCourseList() {
        const courseItems = document.querySelectorAll('.course-item');
        courseItems.forEach((item, index) => {
            // Reset classes
            item.classList.remove('bg-blue-100', 'border-blue-300', 'text-blue-700');
            item.classList.add('bg-white', 'border-gray-200', 'text-gray-700');
            
            // Apply active class if current item
            if (index === this.currentCourseIndex) {
                item.classList.remove('bg-white', 'border-gray-200', 'text-gray-700');
                item.classList.add('bg-blue-100', 'border-blue-300', 'text-blue-700');
            }
            
            // Update the number indicator
            const indicator = item.querySelector('.w-8');
            if (indicator) {
                const isCompleted = item.classList.contains('border-green-200');
                
                if (isCompleted) {
                    indicator.className = 'w-8 h-8 rounded-full flex items-center justify-center !bg-green-500 text-white';
                    indicator.innerHTML = '✓';
                } else if (index === this.currentCourseIndex) {
                    indicator.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white';
                    indicator.innerHTML = (index + 1).toString();
                } else {
                    indicator.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600';
                    indicator.innerHTML = (index + 1).toString();
                }
            }
        });
    }

    static getCurrentWeekData() {
        const weekData = getWeekData();
        return weekData[this.currentWeek];
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <ion-icon name="${type === 'success' ? 'checkmark-circle' : type === 'error' ? 'close-circle' : 'information-circle'}" 
                         class="mr-2"></ion-icon>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Tambahkan CSS untuk video player yang lebih besar
const style = document.createElement('style');
style.textContent = `
    .video-wrapper-large {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
    }
    
    .video-wrapper-large iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`;
document.head.appendChild(style);

export default Materi;