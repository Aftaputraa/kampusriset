// Progress management
export function getProgress() {
    return JSON.parse(localStorage.getItem('lmsProgress') || '{}');
}

export function updateProgress(key, value) {
    const progress = getProgress();
    progress[key] = value;
    localStorage.setItem('lmsProgress', JSON.stringify(progress));
    return progress;
}

export function calculateProgress() {
    const progress = getProgress();
    const totalWeeks = 4;
    let completed = 0;
    
    for (let i = 1; i <= totalWeeks; i++) {
        if (progress['pekan' + i]) completed++;
    }
    
    return Math.round((completed / totalWeeks) * 100);
}

// Formatting helpers
export function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Validation helpers
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}