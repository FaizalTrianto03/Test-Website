/**
 * Theme management for the learning platform
 */

// Initialize theme immediately
initializeTheme();

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function setupThemeToggle() {
    // Event delegation untuk handle dynamic buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('#theme-toggle')) {
            e.preventDefault();
            toggleTheme();
        }
    });
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        // Switch to light
        html.classList.remove('dark');
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark
        html.classList.add('dark');
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    
    // Force Tailwind to re-evaluate
    forceStyleUpdate();
    updateThemeToggleIcon();
    
    console.log('Theme toggled to:', isDark ? 'light' : 'dark');
}

function forceStyleUpdate() {
    // Force browser to recalculate styles
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    // Alternative: trigger class change on body
    document.body.classList.toggle('theme-transition');
    setTimeout(() => {
        document.body.classList.toggle('theme-transition');
    }, 10);
}

function updateThemeToggleIcon() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const isDark = document.documentElement.classList.contains('dark');
        const sunIcon = themeToggleBtn.querySelector('.fa-sun');
        const moonIcon = themeToggleBtn.querySelector('.fa-moon');
        
        if (sunIcon && moonIcon) {
            if (isDark) {
                sunIcon.classList.add('hidden', 'dark:hidden');
                moonIcon.classList.remove('hidden');
                moonIcon.classList.add('dark:block');
            } else {
                sunIcon.classList.remove('hidden', 'dark:hidden');
                moonIcon.classList.add('hidden');
                moonIcon.classList.remove('dark:block');
            }
        }
    }
}

// Export for global use
window.toggleTheme = toggleTheme;
window.initializeTheme = initializeTheme;
window.updateThemeToggleIcon = updateThemeToggleIcon;
