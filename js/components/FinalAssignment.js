// js/components/FinalAssignment.js
import { courseAttendanceService } from '../config/supabase.js';

class FinalAssignment {
    static async render() {
        const progress = await courseAttendanceService.getUserCourseProgress();
        const allWeeksCompleted = [1,2,3,4].every(week => {
            const weekProgress = progress[week] || {};
            const completedCount = Object.values(weekProgress).filter(Boolean).length;
            const totalCount = 4; // Asumsi 4 course per week
            return completedCount === totalCount;
        });

        return `
            <div class="max-w-6xl mx-auto">
                <div class="bg-white shadow-lg rounded-xl md:rounded-2xl overflow-hidden">
                    <div class="p-4 md:p-6 border-b border-gray-200">
                        <h1 class="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Final Assignment</h1>
                        <p class="text-gray-600 mt-1 text-sm md:text-base">Tugas akhir untuk menyelesaikan program onboarding</p>
                    </div>
                    
                    <div class="p-4 md:p-6 relative">
                        <!-- Overlay -->
                        ${!allWeeksCompleted ? `
                            <div class="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
                                <div class="text-center p-8">
                                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ion-icon name="megaphone-outline" class="text-gray-500 text-2xl"></ion-icon>
                                    </div>
                                    <h3 class="text-xl font-semibold text-gray-700 mb-2">To Be Announced</h3>
                                    <p class="text-gray-500">Final assignment akan segera diumumkan</p>
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- Original Content (tetap ada di belakang) -->
                        <div class="${!allWeeksCompleted ? 'opacity-30' : ''}">
                            <!-- Status Card -->
                            <div class="mb-6 md:mb-8">
                                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border-2 ${allWeeksCompleted ? 'border-green-400' : 'border-blue-300'}">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h3 class="font-semibold text-gray-800 text-lg md:text-xl mb-2">Status Kelayakan</h3>
                                            <p class="text-gray-600 ${allWeeksCompleted ? 'text-green-700' : 'text-blue-700'}">
                                                ${allWeeksCompleted ? 
                                                    '✅ Selamat! Anda memenuhi syarat untuk mengerjakan final assignment' : 
                                                    '⏳ Anda perlu menyelesaikan semua materi pekan 1-4 terlebih dahulu'
                                                }
                                            </p>
                                        </div>
                                        <div class="text-3xl ${allWeeksCompleted ? 'text-green-500' : 'text-blue-500'}">
                                            ${allWeeksCompleted ? '🎉' : '📝'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Progress Check -->
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                                ${[1,2,3,4].map(week => {
                                    const weekProgress = progress[week] || {};
                                    const completedCount = Object.values(weekProgress).filter(Boolean).length;
                                    const totalCount = 4; // Asumsi 4 course per week
                                    const isCompleted = completedCount === totalCount;
                                    
                                    return `
                                    <div class="bg-white border ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-lg p-3 text-center">
                                        <div class="text-sm font-medium text-gray-700 mb-1">Pekan ${week}</div>
                                        <div class="text-lg ${isCompleted ? 'text-green-600' : 'text-gray-400'}">
                                            ${isCompleted ? '✓' : '○'}
                                        </div>
                                        <div class="text-xs text-gray-500 mt-1">${completedCount}/${totalCount}</div>
                                    </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Assignment Content -->
                            <div class="space-y-6 md:space-y-8">
                                <!-- Deskripsi Tugas -->
                                <div class="bg-gray-50 rounded-xl p-4 md:p-6">
                                    <h3 class="font-semibold text-gray-800 text-lg md:text-xl mb-3">Deskripsi Tugas</h3>
                                    <div class="prose prose-sm max-w-none text-gray-600">
                                        <p>Final assignment bertujuan untuk mengukur pemahaman Anda terhadap seluruh materi yang telah dipelajari selama program onboarding. Tugas ini meliputi:</p>
                                        <ul class="mt-3 space-y-2">
                                            <li>Analisis research gap pada topik pilihan Anda</li>
                                            <li>Perancangan proposal penelitian lengkap</li>
                                            <li>Literature review menggunakan tools yang telah dipelajari</li>
                                            <li>Rencana analisis data dan metodologi</li>
                                            <li>Outline penulisan artikel jurnal</li>
                                        </ul>
                                    </div>
                                </div>

                                <!-- Requirements -->
                                <div class="bg-yellow-50 rounded-xl p-4 md:p-6 border border-yellow-200">
                                    <h3 class="font-semibold text-yellow-800 text-lg md:text-xl mb-3">Persyaratan</h3>
                                    <ul class="text-yellow-700 space-y-2 text-sm md:text-base">
                                        <li class="flex items-start space-x-2">
                                            <ion-icon name="document-text-outline" class="mt-0.5"></ion-icon>
                                            <span>Format: PDF, maksimal 15 halaman (tidak termasuk lampiran)</span>
                                        </li>
                                        <li class="flex items-start space-x-2">
                                            <ion-icon name="calendar-outline" class="mt-0.5"></ion-icon>
                                            <span>Deadline: 7 hari setelah menyelesaikan pekan 4</span>
                                        </li>
                                        <li class="flex items-start space-x-2">
                                            <ion-icon name="school-outline" class="mt-0.5"></ion-icon>
                                            <span>Gunakan template yang telah disediakan</span>
                                        </li>
                                        <li class="flex items-start space-x-2">
                                            <ion-icon name="checkmark-done-outline" class="mt-0.5"></ion-icon>
                                            <span>Semua materi pekan 1-4 harus sudah diselesaikan</span>
                                        </li>
                                    </ul>
                                </div>

                                <!-- Submission Section -->
                                <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
                                    <h3 class="font-semibold text-gray-800 text-lg md:text-xl mb-4">Pengumpulan Tugas</h3>
                                    
                                    ${allWeeksCompleted ? `
                                        <div class="space-y-4">
                                            <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                                                <p class="text-green-700 font-medium">Anda dapat mengumpulkan final assignment sekarang</p>
                                            </div>
                                            
                                            <form id="submissionForm" class="space-y-4">
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                                        Upload File Tugas (PDF)
                                                    </label>
                                                    <input type="file" 
                                                           accept=".pdf" 
                                                           required
                                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                    <p class="text-xs text-gray-500 mt-1">Maksimal 10MB, format PDF</p>
                                                </div>
                                                
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                                        Link Google Docs (Opsional)
                                                    </label>
                                                    <input type="url" 
                                                           placeholder="https://docs.google.com/document/d/..."
                                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                </div>
                                                
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                                        Catatan untuk Mentor (Opsional)
                                                    </label>
                                                    <textarea rows="3" 
                                                              placeholder="Tulis pertanyaan atau catatan khusus untuk mentor..."
                                                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                                </div>
                                                
                                                <button type="submit" 
                                                        class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold">
                                                    <ion-icon name="cloud-upload-outline" class="mr-2"></ion-icon>
                                                    Kumpulkan Final Assignment
                                                </button>
                                            </form>
                                        </div>
                                    ` : `
                                        <div class="text-center py-6">
                                            <div class="text-gray-400 text-4xl mb-3">🔒</div>
                                            <p class="text-gray-600">Selesaikan semua materi pekan 1-4 untuk membuka final assignment</p>
                                            <a href="#/materi" 
                                               class="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium mt-4">
                                                <ion-icon name="book-outline"></ion-icon>
                                                <span>Lanjutkan Belajar</span>
                                            </a>
                                        </div>
                                    `}
                                </div>

                                <!-- Resources -->
                                <div class="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
                                    <h3 class="font-semibold text-blue-800 text-lg md:text-xl mb-3">Resources Pendukung</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <a href="#/template" class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition">
                                            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <ion-icon name="document-text-outline" class="text-blue-600"></ion-icon>
                                            </div>
                                            <span class="text-blue-700 font-medium">Download Template</span>
                                        </a>
                                        <a href="#/sinkronus" class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition">
                                            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <ion-icon name="videocam-outline" class="text-blue-600"></ion-icon>
                                            </div>
                                            <span class="text-blue-700 font-medium">Rekaman Coaching</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static async init() {
        if (document.getElementById('submissionForm')) {
            document.getElementById('submissionForm').addEventListener('submit', this.handleSubmission);
        }
    }

    static async handleSubmission(e) {
        e.preventDefault();
        
        // Simulate submission process
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Mengupload...
        `;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        alert('Final assignment berhasil dikumpulkan! Mentor akan memberikan feedback dalam 3-5 hari kerja.');
        
        // Reset form
        e.target.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

export default FinalAssignment;