/**
 * Footer Component for Learning Platform
 * Provides consistent footer across all pages
 */

/**
 * Generate footer HTML
 */
function generateFooterHTML() {
    return `
        <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div class="max-w-7xl mx-auto px-6 py-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Main Info Section -->
                    <div class="col-span-1 md:col-span-2">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 bg-gradient-to-br from-primary-orange to-accent-orange rounded-lg flex items-center justify-center mr-3">
                                <i class="fas fa-mobile-alt text-white text-lg"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Modul Praktikum Mobile</h3>
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            Platform pembelajaran untuk praktikum pengembangan aplikasi mobile Laboratorium Informatika UMM.
                        </p>
                    </div>

                    <!-- Quick Links Section -->
                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul class="space-y-2 text-sm">
                            <li>
                                <a href="/index.html" class="text-gray-600 dark:text-gray-300 hover:text-primary-orange transition-colors duration-200">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/modules.html" class="text-gray-600 dark:text-gray-300 hover:text-primary-orange transition-colors duration-200">
                                    Modules
                                </a>
                            </li>
                            <li>
                                <a href="/pages/about.html" class="text-gray-600 dark:text-gray-300 hover:text-primary-orange transition-colors duration-200">
                                    About
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Institution Info -->
                <div class="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Laboratorium Informatika - Universitas Muhammadiyah Malang
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                        &copy; 2025 
                        <span class="font-medium text-primary-orange">Faizal Qadri Trianto</span>
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    `;
}

/**
 * Inject footer into page and ensure it's always at bottom
 */
function injectFooter() {
    // Check if footer already exists
    if (document.querySelector('footer')) {
        return;
    }

    // Ensure main content has flex layout for sticky footer
    const mainContent = document.querySelector('main');
    const body = document.body;
    
    if (mainContent) {
        // Make main content a flex container
        mainContent.style.minHeight = '100vh';
        mainContent.style.display = 'flex';
        mainContent.style.flexDirection = 'column';
        
        // Make page content grow to fill space
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.style.flex = '1';
        }
        
        // Create footer element
        const footerElement = document.createElement('div');
        footerElement.innerHTML = generateFooterHTML();
        
        // Append footer to main content
        mainContent.appendChild(footerElement.firstElementChild);
    } else {
        // Fallback: add to body with sticky positioning
        body.style.minHeight = '100vh';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        
        const footerElement = document.createElement('div');
        footerElement.innerHTML = generateFooterHTML();
        body.appendChild(footerElement.firstElementChild);
    }
}

/**
 * Replace existing footer with consistent footer
 */
function replaceFooter() {
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
        const newFooterHTML = generateFooterHTML();
        existingFooter.outerHTML = newFooterHTML;
        
        // Ensure sticky footer layout
        ensureStickyFooterLayout();
    } else {
        injectFooter();
    }
}

/**
 * Ensure footer sticks to bottom
 */
function ensureStickyFooterLayout() {
    const mainContent = document.querySelector('main');
    const body = document.body;
    
    if (mainContent) {
        mainContent.style.minHeight = '100vh';
        mainContent.style.display = 'flex';
        mainContent.style.flexDirection = 'column';
        
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.style.flex = '1';
        }
    } else {
        body.style.minHeight = '100vh';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
    }
}

/**
 * Initialize footer with smooth animation
 */
function initializeFooter() {
    // Replace or inject footer
    replaceFooter();
    
    // Add scroll-to-top functionality
    addScrollToTop();
    
    // Add footer animations
    addFooterAnimations();
    
    // Update footer links based on current page
    updateFooterLinks();
}

/**
 * Add scroll to top button
 */
function addScrollToTop() {
    // Remove existing button if any
    const existingButton = document.getElementById('scroll-to-top');
    if (existingButton) {
        existingButton.remove();
    }

    const scrollButton = document.createElement('button');
    scrollButton.id = 'scroll-to-top';
    scrollButton.className = 'fixed bottom-6 right-6 w-12 h-12 bg-primary-orange hover:bg-accent-orange text-white rounded-full shadow-lg transition-all duration-300 opacity-0 invisible z-50';
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollButton.title = 'Scroll to top';
    
    // Add click handler
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollButton);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.remove('opacity-0', 'invisible');
            scrollButton.classList.add('opacity-100', 'visible');
        } else {
            scrollButton.classList.add('opacity-0', 'invisible');
            scrollButton.classList.remove('opacity-100', 'visible');
        }
    });
}

/**
 * Add footer animations
 */
function addFooterAnimations() {
    // Add CSS for animations and sticky footer
    if (!document.getElementById('footer-styles')) {
        const style = document.createElement('style');
        style.id = 'footer-styles';
        style.textContent = `
            /* Sticky Footer Styles */
            html, body {
                height: 100%;
            }
            
            main {
                display: flex !important;
                flex-direction: column !important;
                min-height: 100vh !important;
            }
            
            #page-content {
                flex: 1 !important;
            }
            
            /* Footer Animation */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out;
            }
            
            /* Footer Link Hover Effect */
            footer a {
                position: relative;
            }
            
            footer a::after {
                content: '';
                position: absolute;
                width: 0;
                height: 1px;
                bottom: -2px;
                left: 0;
                background-color: #FF6B35;
                transition: width 0.3s ease;
            }
            
            footer a:hover::after {
                width: 100%;
            }
            
            /* Scroll to Top Button */
            #scroll-to-top:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Intersection Observer for footer animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, {
        threshold: 0.1
    });
    
    observer.observe(footer);
}

/**
 * Update footer links based on current page
 */
function updateFooterLinks() {
    const currentPath = window.location.pathname;
    const footerLinks = document.querySelectorAll('footer a[href^="/"]');
    
    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/index.html')) {
            link.classList.add('text-primary-orange', 'font-medium');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Get footer statistics (for admin/analytics)
 */
function getFooterStats() {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    
    return {
        linksCount: footer.querySelectorAll('a').length,
        sectionsCount: footer.querySelectorAll('h4').length,
        isVisible: footer.getBoundingClientRect().top < window.innerHeight
    };
}

/**
 * Update footer year automatically
 */
function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('footer .text-sm');
    if (yearElement && yearElement.textContent.includes('2025')) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFooter();
    updateFooterYear();
});

// Re-initialize on navigation (for SPA-like behavior)
window.addEventListener('popstate', () => {
    setTimeout(() => {
        updateFooterLinks();
    }, 100);
});

// Export functions for global use
window.FooterComponent = {
    initialize: initializeFooter,
    inject: injectFooter,
    replace: replaceFooter,
    updateLinks: updateFooterLinks,
    getStats: getFooterStats,
    updateYear: updateFooterYear
};

// Export individual functions
window.injectFooter = injectFooter;
window.replaceFooter = replaceFooter;
window.initializeFooter = initializeFooter;

