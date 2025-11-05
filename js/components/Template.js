class Template {
    static async render() {
        return `
            <div class="max-w-6xl mx-auto">
                <div class="bg-white shadow-lg rounded-xl md:rounded-2xl overflow-hidden">
                    <div class="p-4 md:p-6 border-b border-gray-200">
                        <h1 class="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Template Penulisan</h1>
                        <p class="text-gray-600 mt-1 text-sm md:text-base">Download template untuk membantu proses penulisan penelitian Anda</p>
                    </div>
                    
                    <div class="p-4 md:p-6 relative">
                        <!-- Overlay -->
                        <div class="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
                            <div class="text-center p-8">
                                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ion-icon name="megaphone-outline" class="text-gray-500 text-2xl"></ion-icon>
                                </div>
                                <h3 class="text-xl font-semibold text-gray-700 mb-2">To Be Announced</h3>
                                <p class="text-gray-500">Template penulisan akan segera diumumkan</p>
                            </div>
                        </div>
                        
                        <!-- Original Content (tetap ada di belakang) -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 opacity-30">
                            <!-- Template Proposal -->
                            <div class="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <ion-icon name="document-text-outline" class="text-blue-600 text-xl"></ion-icon>
                                    </div>
                                    <h3 class="font-semibold text-gray-800">Template Proposal Penelitian</h3>
                                </div>
                                <p class="text-gray-600 text-sm mb-4">Format standar untuk proposal penelitian akademik dengan struktur lengkap.</p>
                                <div class="space-y-2">
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="download-outline"></ion-icon>
                                        <span>Download DOCX</span>
                                    </a>
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="eye-outline"></ion-icon>
                                        <span>Preview Online</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Template Laporan -->
                            <div class="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <ion-icon name="layers-outline" class="text-green-600 text-xl"></ion-icon>
                                    </div>
                                    <h3 class="font-semibold text-gray-800">Template Laporan Akhir</h3>
                                </div>
                                <p class="text-gray-600 text-sm mb-4">Struktur lengkap untuk laporan penelitian akhir dan tesis.</p>
                                <div class="space-y-2">
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="download-outline"></ion-icon>
                                        <span>Download DOCX</span>
                                    </a>
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="eye-outline"></ion-icon>
                                        <span>Preview Online</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Template Jurnal -->
                            <div class="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <ion-icon name="newspaper-outline" class="text-purple-600 text-xl"></ion-icon>
                                    </div>
                                    <h3 class="font-semibold text-gray-800">Template Artikel Jurnal</h3>
                                </div>
                                <p class="text-gray-600 text-sm mb-4">Format penulisan artikel jurnal ilmiah sesuai standar internasional.</p>
                                <div class="space-y-2">
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="download-outline"></ion-icon>
                                        <span>Download DOCX</span>
                                    </a>
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="eye-outline"></ion-icon>
                                        <span>Preview Online</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Template Presentasi -->
                            <div class="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <ion-icon name="desktop-outline" class="text-orange-600 text-xl"></ion-icon>
                                    </div>
                                    <h3 class="font-semibold text-gray-800">Template Presentasi</h3>
                                </div>
                                <p class="text-gray-600 text-sm mb-4">Slide presentasi profesional untuk seminar dan sidang.</p>
                                <div class="space-y-2">
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-orange-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="download-outline"></ion-icon>
                                        <span>Download PPTX</span>
                                    </a>
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="eye-outline"></ion-icon>
                                        <span>Preview Online</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Template Literatur Review -->
                            <div class="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                        <ion-icon name="library-outline" class="text-red-600 text-xl"></ion-icon>
                                    </div>
                                    <h3 class="font-semibold text-gray-800">Template Literatur Review</h3>
                                </div>
                                <p class="text-gray-600 text-sm mb-4">Struktur sistematis untuk tinjauan pustaka dan systematic review.</p>
                                <div class="space-y-2">
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="download-outline"></ion-icon>
                                        <span>Download DOCX</span>
                                    </a>
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="eye-outline"></ion-icon>
                                        <span>Preview Online</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Template Coding -->
                            <div class="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <ion-icon name="code-slash-outline" class="text-indigo-600 text-xl"></ion-icon>
                                    </div>
                                    <h3 class="font-semibold text-gray-800">Template Analisis Data</h3>
                                </div>
                                <p class="text-gray-600 text-sm mb-4">Script template untuk analisis data dengan Python/R.</p>
                                <div class="space-y-2">
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="logo-github"></ion-icon>
                                        <span>Download dari GitHub</span>
                                    </a>
                                    <a href="#" 
                                       class="w-full inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm">
                                        <ion-icon name="logo-google"></ion-icon>
                                        <span>Buka di Colab</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Tips Section -->
                        <div class="mt-8 bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200 opacity-30">
                            <h3 class="font-semibold text-blue-800 mb-3 text-lg">Tips Penggunaan Template</h3>
                            <ul class="text-blue-700 space-y-2 text-sm">
                                <li class="flex items-start space-x-2">
                                    <ion-icon name="checkmark-circle" class="text-blue-500 mt-0.5"></ion-icon>
                                    <span>Download template yang sesuai dengan kebutuhan penelitian Anda</span>
                                </li>
                                <li class="flex items-start space-x-2">
                                    <ion-icon name="checkmark-circle" class="text-blue-500 mt-0.5"></ion-icon>
                                    <span>Edit bagian yang di-highlight dengan konten penelitian Anda</span>
                                </li>
                                <li class="flex items-start space-x-2">
                                    <ion-icon name="checkmark-circle" class="text-blue-500 mt-0.5"></ion-icon>
                                    <span>Simpan sebagai copy baru sebelum mulai mengedit</span>
                                </li>
                                <li class="flex items-start space-x-2">
                                    <ion-icon name="checkmark-circle" class="text-blue-500 mt-0.5"></ion-icon>
                                    <span>Ikuti panduan format yang sudah disediakan</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static async init() {
        // No initialization needed
    }
}

export default Template;