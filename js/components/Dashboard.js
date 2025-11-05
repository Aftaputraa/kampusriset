// js/components/Dashboard.js
import { getWeekData } from '../../data/weekData.js';
import { courseAttendanceService } from '../config/supabase.js';

class Dashboard {
    static async render() {
        const progress = await courseAttendanceService.getUserCourseProgress();
        const stats = await courseAttendanceService.getProgressStats();
        const weekData = getWeekData();
        
        return `
            <div class="max-w-6xl mx-auto">
                <div class="bg-white shadow-lg rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
                    <!-- Welcome Section -->
                    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6 lg:gap-8">
                        <div class="lg:flex-1">
                            <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Selamat Datang di Kampus Riset</h1>
                            <div class="text-gray-700 space-y-3 md:space-y-4 text-sm md:text-base">
                                <p class="leading-relaxed">
                                    Sekolah riset terstruktur untuk dosen, peneliti, dan mahasiswa akhir yang menuntun Anda dari 
                                    <strong>drafting → revising → editing → pre‑submit</strong>.
                                </p>
                                <p class="leading-relaxed">
                                    Terdiri dari <strong>20 e-course on-demand</strong> + <strong>4–6 Coaching Clinic (grup)</strong> + 
                                    <strong>1× konsultasi privat</strong>, lengkap dengan coaching clinic, konsultasi 1:1, submission kit 
                                    ke jurnal target (SINTA/Scopus), peer review, hingga pendampingan submission & korespondensi.
                                </p>
                                <p class="leading-relaxed">
                                    Berbasis praktik, etis, dan didukung <strong>Hcelerate AI (Research OS, bukan AI agregator)</strong>.
                                </p>
                            </div>
                        </div>
                        
                        <!-- Progress Stats -->
                        <div class="lg:w-64">
                            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 md:p-5 text-white">
                                <h3 class="font-semibold mb-2">Progress Onboarding</h3>
                                <div class="text-2xl md:text-3xl font-bold mb-2">${stats.percentage}%</div>
                                <div class="text-blue-100 text-sm">
                                    ${stats.completedCourses} dari ${stats.totalCourses} course selesai
                                </div>
                                <div class="mt-3 bg-blue-400 rounded-full h-2">
                                    <div class="bg-white rounded-full h-2 transition-all duration-500" 
                                         style="width: ${stats.percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Guidebook Section -->
                    <div class="mt-6 md:mt-8">
                        <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Guidebook Kampus Riset</h2>
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border-2 border-blue-200">
                            <div class="flex flex-col lg:flex-row gap-4 md:gap-6">
                                <div class="lg:w-2/3">
                                    <h3 class="font-bold text-gray-800 text-base md:text-lg mb-2">Panduan Lengkap Program</h3>
                                    <p class="text-gray-600 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                                        Download guidebook untuk memahami alur program, timeline, dan resources yang tersedia di Kampus Riset.
                                    </p>
                                    <a href="https://hcelerate.id/wp-content/uploads/2025/10/Guidebook-Kampus-Riset.pdf" 
                                       target="_blank" 
                                       class="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm md:text-base">
                                        <ion-icon name="download-outline"></ion-icon>
                                        <span>Download Guidebook</span>
                                    </a>
                                </div>
                                <div class="lg:w-1/3">
                                    <div class="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                                        <div class="pdf-wrapper">
                                            <iframe src="https://hcelerate.id/wp-content/uploads/2025/10/Guidebook-Kampus-Riset.pdf" 
                                                    frameborder="0">
                                            </iframe>
                                        </div>
                                        <p class="text-xs md:text-sm text-gray-500 text-center mt-2">Preview Guidebook</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Roadmap Section -->
                    <div class="mt-6 md:mt-8">
                        <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Roadmap Onboarding</h2>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
                            ${['Pekan 1','Pekan 2','Pekan 3','Pekan 4','Pekan 5'].map((pekan,i)=>{
                                const weekNum = i + 1;
                                const weekTitle = weekData[weekNum]?.title || 'Materi akan segera tersedia';
                                const isCompleted = progress['pekan'+weekNum];
                                const isCurrent = weekNum === 1 && !isCompleted;
                                const isLocked = weekNum > 1 && !progress['pekan' + (weekNum - 1)];
                                
                                return `
                                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-5 border-2 ${isCompleted?'border-green-400':isCurrent?'border-blue-400':isLocked?'border-gray-200':'border-blue-200'} shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div class="flex items-center justify-between mb-3 md:mb-4">
                                        <h3 class="font-bold text-gray-800 text-base md:text-lg">${pekan}</h3>
                                        <span class="text-lg md:text-xl ${isCompleted?'text-green-600':isCurrent?'text-blue-600':isLocked?'text-gray-400':'text-blue-500'}">
                                            ${isCompleted?'✓':isCurrent?'⏳':isLocked?'🔒':'📚'}
                                        </span>
                                    </div>
                                    <p class="text-gray-600 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">${weekTitle}</p>
                                    <div class="text-xs md:text-sm ${isCompleted?'text-green-600':isCurrent?'text-blue-600':isLocked?'text-gray-500':'text-blue-600'} font-medium">
                                        ${isCompleted?'✓ Selesai':isCurrent?'⏳ Ongoing':isLocked?'🔒 Terkunci':'📚 Tersedia'}
                                    </div>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export default Dashboard;