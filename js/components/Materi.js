import { getWeekData } from '../../data/weekData.js';
import { courseAttendanceService } from '../config/supabase.js';

class Materi {
    static currentWeek = 1;
    static currentCourseIndex = 0;

    static async render() {
        const progress = await courseAttendanceService.getUserCourseProgress();
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
        const isCompleted = weekProgress[course.title] || false;

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

            <!-- Videos Section -->
            <div class="p-4 md:p-6">
                <h4 class="font-semibold text-gray-800 mb-4 text-lg">Video Pembelajaran</h4>
                <div class="space-y-4">
                    ${course.videos.map((video, index) => `
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h5 class="font-medium text-gray-800 mb-3">${video.title}</h5>
                            <div class="video-wrapper">
                                <iframe src="${video.url}" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Download Section -->
            <div class="border-t border-gray-200 p-4 md:p-6 bg-blue-50">
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

            <!-- Navigation & Actions -->
            <div class="border-t border-gray-200 p-4 md:p-6">
                <div class="flex flex-col sm:flex-row gap-3">
                    <button class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed prev-course"
                            ${this.currentCourseIndex === 0 ? 'disabled' : ''}>
                        <ion-icon name="chevron-back-outline" class="mr-2"></ion-icon>
                        Course Sebelumnya
                    </button>
                    
                    <button class="flex-1 ${isCompleted ? 'bg-green-600' : 'bg-green-600'} text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium mark-complete"
                            data-course-title="${course.title}">
                        <ion-icon name="checkmark-circle-outline" class="mr-2"></ion-icon>
                        ${isCompleted ? '✓ Sudah Selesai' : 'Tandai Selesai'}
                    </button>
                    
                    <button class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed next-course"
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
    }

    static setupTabNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-button')) {
                const tabButton = e.target.closest('.tab-button');
                const weekId = tabButton.dataset.week;
                
                this.switchWeek(weekId);
            }
        });
    }

    static setupCourseNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.prev-course')) {
                this.previousCourse();
            }
            
            if (e.target.closest('.next-course')) {
                this.nextCourse();
            }
            
            if (e.target.closest('.mark-complete')) {
                this.markAsComplete();
            }
        });
    }

    static setupCourseList() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.course-item')) {
                const courseItem = e.target.closest('.course-item');
                const courseIndex = parseInt(courseItem.dataset.courseIndex);
                
                this.switchCourse(courseIndex);
            }
        });
    }

    static async switchWeek(weekId) {
        this.currentWeek = weekId;
        this.currentCourseIndex = 0;
        
        // Re-render the component
        const content = await this.render();
        document.getElementById('content').innerHTML = content;
        
        // Re-initialize
        await this.init();
    }

    static switchCourse(courseIndex) {
        this.currentCourseIndex = courseIndex;
        
        // Update course content
        const weekData = this.getCurrentWeekData();
        const currentCourse = weekData.materials[this.currentCourseIndex];
        
        // Update course list active state
        this.updateCourseList();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Scroll to top of course content
        const courseContent = document.querySelector('.lg\\:col-span-3');
        if (courseContent) {
            courseContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    static previousCourse() {
        if (this.currentCourseIndex > 0) {
            this.switchCourse(this.currentCourseIndex - 1);
        }
    }

    static nextCourse() {
        const weekData = this.getCurrentWeekData();
        if (this.currentCourseIndex < weekData.materials.length - 1) {
            this.switchCourse(this.currentCourseIndex + 1);
        }
    }

    static async markAsComplete() {
        try {
            const weekData = this.getCurrentWeekData();
            const currentCourse = weekData.materials[this.currentCourseIndex];
            
            // Save to Supabase
            await courseAttendanceService.recordCourseCompletion(
                parseInt(this.currentWeek), 
                currentCourse.title,
                { 
                    completed_at: new Date().toISOString(),
                    course_data: {
                        title: currentCourse.title,
                        videos_count: currentCourse.videos.length,
                        description: currentCourse.description
                    }
                }
            );
            
            this.showNotification(`"${currentCourse.title}" berhasil ditandai selesai!`, 'success');
            
            // Refresh the component to update progress
            const content = await this.render();
            document.getElementById('content').innerHTML = content;
            await this.init();
            
        } catch (error) {
            console.error('Error marking as complete:', error);
            this.showNotification('Gagal menandai course: ' + error.message, 'error');
        }
    }

    static updateCourseList() {
        const courseItems = document.querySelectorAll('.course-item');
        courseItems.forEach((item, index) => {
            if (index === this.currentCourseIndex) {
                item.classList.add('bg-blue-100', 'border-blue-300', 'text-blue-700');
                item.classList.remove('bg-white', 'border-gray-200', 'text-gray-700');
            } else {
                item.classList.remove('bg-blue-100', 'border-blue-300', 'text-blue-700');
                item.classList.add('bg-white', 'border-gray-200', 'text-gray-700');
            }
        });
    }

    static updateNavigationButtons() {
        const weekData = this.getCurrentWeekData();
        const prevButton = document.querySelector('.prev-course');
        const nextButton = document.querySelector('.next-course');
        
        if (prevButton) {
            prevButton.disabled = this.currentCourseIndex === 0;
        }
        
        if (nextButton) {
            nextButton.disabled = this.currentCourseIndex === weekData.materials.length - 1;
        }
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

export default Materi;