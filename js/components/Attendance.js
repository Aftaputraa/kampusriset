import Auth from '../auth.js';
import { getWeekData } from '../../data/weekData.js';

class Attendance {
    static activeTab = 'live-sessions';
    static auth = new Auth();

    static async render() {
        if (!this.auth.isAuthenticated()) {
            return '<div class="p-8 text-center text-red-600">Silakan login terlebih dahulu</div>';
        }

        return `
            <div class="max-w-6xl mx-auto">
                <div class="bg-white shadow-lg rounded-xl md:rounded-2xl overflow-hidden">
                    <div class="p-4 md:p-6 border-b border-gray-200">
                        <h1 class="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Presensi & Progress</h1>
                        <p class="text-gray-600 mt-1 text-sm md:text-base">Form presensi sesi live dan penyelesaian e-course</p>
                    </div>
                    
                    <div class="border-b border-gray-200 bg-gray-50">
                        <div class="flex overflow-x-auto">
                            <button class="tab-button flex-shrink-0 px-4 py-3 font-medium text-sm border-b-2 ${this.activeTab === 'live-sessions' ? 'bg-white text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:bg-white hover:text-blue-600'}" 
                                    data-tab="live-sessions">
                                Presensi Live Session
                            </button>
                            <button class="tab-button flex-shrink-0 px-4 py-3 font-medium text-sm border-b-2 ${this.activeTab === 'e-course' ? 'bg-white text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:bg-white hover:text-blue-600'}" 
                                    data-tab="e-course">
                                Penyelesaian E-Course
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-4 md:p-6">
                        ${this.activeTab === 'live-sessions' ? await this.renderLiveSessions() : await this.renderECourse()}
                    </div>
                </div>
            </div>
        `;
    }

    static async renderLiveSessions() {
        const cgcSessions = [
            { number: 1, title: "Coaching Group Clinic #1" },
            { number: 2, title: "Coaching Group Clinic #2" }
        ];

        const currentAttendance = {};
        for (const session of cgcSessions) {
            currentAttendance[session.number] = await this.auth.hasAttendedSession(session.number);
        }

        return `
            <div class="space-y-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Form Presensi Live Session</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${cgcSessions.map(session => {
                        const hasAttended = currentAttendance[session.number];
                        return `
                        <div class="bg-white border ${hasAttended ? 'border-green-200' : 'border-gray-200'} rounded-xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-semibold text-gray-900 text-lg">${session.title}</h3>
                                ${hasAttended ? `
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Hadir
                                    </span>
                                ` : ''}
                            </div>
                            
                            ${hasAttended ? `
                                <div class="text-center py-4">
                                    <p class="text-green-700 text-sm">Presensi telah tercatat</p>
                                </div>
                            ` : `
                                <div class="space-y-3">
                                    <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="radio" name="attendance-${session.number}" value="hadir" class="text-green-600 focus:ring-green-500">
                                        <span class="text-gray-700">Hadir</span>
                                    </label>
                                    <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="radio" name="attendance-${session.number}" value="tidak" class="text-red-600 focus:ring-red-500">
                                        <span class="text-gray-700">Tidak Hadir</span>
                                    </label>
                                </div>
                                <button class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium save-attendance"
                                        data-session-number="${session.number}" data-session-title="${session.title}">
                                    Simpan Presensi
                                </button>
                            `}
                        </div>
                        `;
                    }).join('')}
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Riwayat Presensi</h3>
                    ${await this.renderAttendanceHistory()}
                </div>
            </div>
        `;
    }

    static async renderAttendanceHistory() {
        try {
            const attendance = await this.auth.getSessionAttendance();
            
            if (!attendance || attendance.length === 0) {
                return '<div class="text-center py-8 bg-gray-50 rounded-xl"><p class="text-gray-500">Belum ada riwayat presensi</p></div>';
            }

            return `
                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sesi</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${attendance.map(item => `
                                    <tr>
                                        <td class="px-4 py-3 text-sm font-medium text-gray-900">CGC #${item.session_number}</td>
                                        <td class="px-4 py-3 text-sm text-gray-600">${item.session_title}</td>
                                        <td class="px-4 py-3">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.attended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                ${item.attended ? 'Hadir' : 'Tidak Hadir'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Render attendance history error:', error);
            return '<p class="text-red-600">Error loading attendance history</p>';
        }
    }

    static async renderECourse() {
        try {
            const weekData = getWeekData();
            const progress = await this.auth.getCourseProgress();

            return `
                <div class="space-y-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Form Penyelesaian E-Course</h2>
                    
                    <div class="space-y-6">
                        ${Object.entries(weekData).map(([weekNumber, week]) => {
                            if (!week.materials || week.materials.length === 0) return '';
                            
                            const weekProgress = progress[weekNumber] || {};
                            const totalCourses = week.materials.length;
                            const completedCourses = Object.values(weekProgress).filter(Boolean).length;
                            
                            return `
                            <div class="bg-white border border-gray-200 rounded-xl p-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="font-semibold text-gray-900 text-lg">Pekan ${weekNumber}: ${week.title}</h3>
                                    <span class="text-sm ${completedCourses === totalCourses ? 'text-green-600' : 'text-gray-500'}">
                                        ${completedCourses}/${totalCourses} selesai
                                    </span>
                                </div>
                                
                                <div class="space-y-3">
                                    ${week.materials.map(material => {
                                        const isCompleted = weekProgress[material.title];
                                        return `
                                        <label class="flex items-center space-x-3 p-3 border ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input type="checkbox" ${isCompleted ? 'checked disabled' : ''}
                                                   class="course-checkbox text-green-600 focus:ring-green-500"
                                                   data-week="${weekNumber}" data-course="${material.title}">
                                            <span class="${isCompleted ? 'text-green-700' : 'text-gray-700'} flex-1 text-sm">
                                                ${material.title}
                                            </span>
                                            ${isCompleted ? '<span class="text-green-600 text-xs">✓</span>' : ''}
                                        </label>
                                        `;
                                    }).join('')}
                                </div>
                                
                                ${completedCourses < totalCourses ? `
                                    <button class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium save-progress"
                                            data-week="${weekNumber}">
                                        Simpan Progress Pekan ${weekNumber}
                                    </button>
                                ` : `
                                    <div class="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg text-center font-medium">
                                        ✓ Semua Course Selesai
                                    </div>
                                `}
                            </div>
                            `;
                        }).join('')}
                    </div>

                </div>
            `;
        } catch (error) {
            console.error('Render e-course error:', error);
            return '<p class="text-red-600">Error loading e-course progress</p>';
        }
    }

    static async renderProgressStats() {
        try {
            const stats = await this.auth.getProgressStats();
            
            return `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-white rounded-lg p-4 border border-blue-200">
                        <div class="text-2xl font-bold text-blue-600">${stats.completedCourses}</div>
                        <div class="text-sm text-gray-600">Course Selesai</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 border border-green-200">
                        <div class="text-2xl font-bold text-green-600">${stats.totalCourses}</div>
                        <div class="text-sm text-gray-600">Total Course</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 border border-purple-200">
                        <div class="text-2xl font-bold text-purple-600">${stats.percentage}%</div>
                        <div class="text-sm text-gray-600">Progress Total</div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Render progress stats error:', error);
            return '<p class="text-red-600">Error loading progress stats</p>';
        }
    }

    static async init() {
        this.setupTabNavigation();
        this.setupLiveSessionHandlers();
        this.setupECourseHandlers();
    }

    static setupTabNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-button')) {
                const tabButton = e.target.closest('.tab-button');
                const tabName = tabButton.dataset.tab;
                this.switchTab(tabName);
            }
        });
    }

    static async switchTab(tabName) {
        this.activeTab = tabName;
        const content = await this.render();
        document.getElementById('content').innerHTML = content;
        await this.init();
    }

    static setupLiveSessionHandlers() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.save-attendance')) {
                const button = e.target.closest('.save-attendance');
                const sessionNumber = parseInt(button.dataset.sessionNumber);
                const sessionTitle = button.dataset.sessionTitle;
                
                const selectedOption = document.querySelector(`input[name="attendance-${sessionNumber}"]:checked`);
                
                if (!selectedOption) {
                    this.showNotification('Pilih status kehadiran terlebih dahulu!', 'error');
                    return;
                }

                const attended = selectedOption.value === 'hadir';
                await this.recordAttendance(sessionNumber, sessionTitle, attended);
            }
        });
    }

    static setupECourseHandlers() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.save-progress')) {
                const button = e.target.closest('.save-progress');
                const weekNumber = parseInt(button.dataset.week);
                await this.saveWeekProgress(weekNumber);
            }
        });
    }

    static async recordAttendance(sessionNumber, sessionTitle, attended) {
        try {
            await this.auth.recordSessionAttendance(sessionNumber, sessionTitle, attended);
            const status = attended ? 'Hadir' : 'Tidak Hadir';
            this.showNotification(`Presensi untuk ${sessionTitle}: ${status} berhasil dicatat!`, 'success');
            await this.switchTab('live-sessions');
        } catch (error) {
            console.error('Attendance error:', error);
            this.showNotification('Gagal mencatat presensi. Coba lagi.', 'error');
        }
    }

    static async saveWeekProgress(weekNumber) {
        try {
            const checkboxes = document.querySelectorAll(`.course-checkbox[data-week="${weekNumber}"]:checked`);
            const completedCourses = Array.from(checkboxes).map(cb => cb.dataset.course);
            
            if (completedCourses.length === 0) {
                this.showNotification('Pilih minimal satu course yang sudah diselesaikan!', 'error');
                return;
            }

            for (const courseTitle of completedCourses) {
                await this.auth.recordCourseCompletion(weekNumber, courseTitle);
            }

            this.showNotification(`Progress pekan ${weekNumber} berhasil disimpan!`, 'success');
            await this.switchTab('e-course');
            
        } catch (error) {
            console.error('Progress save error:', error);
            this.showNotification('Gagal menyimpan progress. Coba lagi.', 'error');
        }
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
                <ion-icon name="${type === 'success' ? 'checkmark-circle' : type === 'error' ? 'close-circle' : 'information-circle'}" class="mr-2"></ion-icon>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
}

export default Attendance;