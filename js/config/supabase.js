import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://ijyupykrvelhzylqidha.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqeXVweWtydmVsaHp5bHFpZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjA4NjQsImV4cCI6MjA3NzgzNjg2NH0.IaBglX8hJTQTeo9zu1G7VD7-yoFAEHyWyVAzbr26zk8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
})

// Services untuk Simple Auth (pakai localStorage user)
export const sessionAttendanceService = {
    async recordSessionAttendance(sessionNumber, sessionTitle) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
            .from('session_attendance')
            .insert({
                user_id: user.id,
                session_number: sessionNumber,
                session_title: sessionTitle
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getUserSessionAttendance() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
            .from('session_attendance')
            .select('*')
            .eq('user_id', user.id)
            .order('session_number', { ascending: true });
        
        if (error) throw error;
        return data;
    },

    async hasAttendedSession(sessionNumber) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return false;
        
        const { data, error } = await supabase
            .from('session_attendance')
            .select('id')
            .eq('user_id', user.id)
            .eq('session_number', sessionNumber)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    }
};

export const courseAttendanceService = {
    async recordCourseCompletion(weekNumber, courseTitle, progressData = {}) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
            .from('course_attendance')
            .upsert({
                user_id: user.id,
                week_number: weekNumber,
                course_title: courseTitle,
                completed: true,
                completed_at: new Date().toISOString(),
                progress_data: progressData
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getUserCourseProgress() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
            .from('course_attendance')
            .select('*')
            .eq('user_id', user.id)
            .order('week_number', { ascending: true });
        
        if (error) throw error;
        
        const progress = {};
        data.forEach(item => {
            if (!progress[item.week_number]) {
                progress[item.week_number] = {};
            }
            progress[item.week_number][item.course_title] = item.completed;
        });
        
        return progress;
    },

    async getProgressStats() {
        const progress = await this.getUserCourseProgress();
        const totalWeeks = 4;
        let completedCourses = 0;
        let totalCourses = 0;
        
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
};