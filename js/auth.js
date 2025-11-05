import { supabase } from './config/supabase.js';

class Auth {
    constructor() {
        this.currentUser = null;
    }

    async init() {
        console.log('🔧 Simple Auth initialized');
        return true;
    }

    async login(email, password) {
        try {
            console.log('🔐 Checking user:', email);
            
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email.trim().toLowerCase())
                .eq('password', password);

            if (error) {
                console.error('❌ Database error:', error);
                throw new Error('Error akses database: ' + error.message);
            }

            if (users && users.length > 0) {
                this.currentUser = users[0];
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                console.log('✅ Login successful:', this.currentUser.email);
                return { success: true, user: this.currentUser };
            } else {
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
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        if (!this.currentUser) {
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

    // === SESSION ATTENDANCE ===
    async getSessionAttendance() {
        const user = this.getCurrentUser();
        if (!user) return [];

        try {
            const { data, error } = await supabase
                .from('session_attendance')
                .select('*')
                .eq('user_id', user.id);

            return data || [];
        } catch (error) {
            console.error('Get session attendance error:', error);
            return [];
        }
    }

    async recordSessionAttendance(sessionNumber, sessionTitle, attended = true) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        try {
            // Simple insert - handle duplicate dengan try-catch
            const { data, error } = await supabase
                .from('session_attendance')
                .insert({
                    user_id: user.id,
                    session_number: sessionNumber,
                    session_title: sessionTitle,
                    attended: attended
                })
                .select()
                .single();

            if (error) {
                // Jika duplicate, update existing
                if (error.code === '23505') {
                    const { data: updated, error: updateError } = await supabase
                        .from('session_attendance')
                        .update({
                            session_title: sessionTitle,
                            attended: attended
                        })
                        .eq('user_id', user.id)
                        .eq('session_number', sessionNumber)
                        .select()
                        .single();

                    if (updateError) throw updateError;
                    return updated;
                }
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Record session attendance error:', error);
            throw error;
        }
    }

    async hasAttendedSession(sessionNumber) {
        const user = this.getCurrentUser();
        if (!user) return false;

        try {
            const { data, error } = await supabase
                .from('session_attendance')
                .select('attended')
                .eq('user_id', user.id)
                .eq('session_number', sessionNumber)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Check session attendance error:', error);
                return false;
            }
            return data ? data.attended : false;
        } catch (error) {
            console.error('Check session attendance exception:', error);
            return false;
        }
    }

    // === COURSE ATTENDANCE ===
    async getCourseProgress() {
        const user = this.getCurrentUser();
        if (!user) return {};

        try {
            const { data, error } = await supabase
                .from('course_attendance')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error('Get course progress error:', error);
                return {};
            }

            const progress = {};
            data.forEach(item => {
                if (!progress[item.week_number]) {
                    progress[item.week_number] = {};
                }
                progress[item.week_number][item.course_title] = item.completed;
            });

            return progress;
        } catch (error) {
            console.error('Get course progress exception:', error);
            return {};
        }
    }

    async recordCourseCompletion(weekNumber, courseTitle) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        try {
            // Simple insert tanpa completed_at
            const { data, error } = await supabase
                .from('course_attendance')
                .insert({
                    user_id: user.id,
                    week_number: weekNumber,
                    course_title: courseTitle,
                    completed: true
                })
                .select()
                .single();

            if (error) {
                // Jika duplicate, update existing
                if (error.code === '23505') {
                    const { data: updated, error: updateError } = await supabase
                        .from('course_attendance')
                        .update({
                            completed: true
                        })
                        .eq('user_id', user.id)
                        .eq('week_number', weekNumber)
                        .eq('course_title', courseTitle)
                        .select()
                        .single();

                    if (updateError) throw updateError;
                    return updated;
                }
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Record course completion error:', error);
            throw error;
        }
    }

    async getProgressStats() {
        const progress = await this.getCourseProgress();
        
        let totalCourses = 0;
        let completedCourses = 0;
        
        Object.values(progress).forEach(week => {
            Object.values(week).forEach(completed => {
                totalCourses++;
                if (completed) completedCourses++;
            });
        });
        
        return {
            completedCourses,
            totalCourses,
            percentage: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0
        };
    }
}

export default Auth;