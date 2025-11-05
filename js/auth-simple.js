// Simple auth yang cek langsung ke table users
import { supabase } from './config/supabase.js';

class SimpleAuth {
    constructor() {
        this.currentUser = null;
    }

    async login(email, password) {
        try {
            console.log('🔐 Checking user:', email);
            
            // Cek langsung di table users
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email.trim().toLowerCase())
                .eq('password', password);

            if (error) {
                console.error('❌ Database error:', error);
                throw new Error('Error akses database');
            }

            if (users && users.length > 0) {
                this.currentUser = users[0];
                // Simpan di localStorage
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                console.log('✅ Login successful:', this.currentUser.email);
                return { success: true, user: this.currentUser };
            } else {
                console.log('❌ Invalid credentials');
                throw new Error('Email atau password salah');
            }

        } catch (error) {
            console.error('💥 Login failed:', error);
            throw error;
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lmsProgress');
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        if (!this.currentUser) {
            // Coba ambil dari localStorage
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    // Progress tracking (tetap pakai Supabase untuk presensi)
    async getProgress() {
        const user = this.getCurrentUser();
        if (!user) return {};

        try {
            const { data, error } = await supabase
                .from('course_attendance')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;

            const progress = {};
            data.forEach(item => {
                if (!progress[item.week_number]) {
                    progress[item.week_number] = {};
                }
                progress[item.week_number][item.course_title] = item.completed;
            });

            return progress;
        } catch (error) {
            console.error('Get progress error:', error);
            return {};
        }
    }

    async updateProgress(weekNumber, courseTitle) {
        const user = this.getCurrentUser();
        if (!user) return;

        try {
            await supabase
                .from('course_attendance')
                .upsert({
                    user_id: user.id,
                    week_number: weekNumber,
                    course_title: courseTitle,
                    completed: true,
                    completed_at: new Date().toISOString()
                });
        } catch (error) {
            console.error('Update progress error:', error);
        }
    }
}

export default SimpleAuth;