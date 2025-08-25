/**
 * Main application controller for the learning platform
 * Handles page initialization, routing, and data loading
 */

// Application state
const AppState = {
    currentPage: null,
    sidebarData: null,
    userData: {
        theme: localStorage.getItem('theme') || 'light',
        completedModules: JSON.parse(localStorage.getItem('completedModules') || '[]'),
        bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]')
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        // Initialize breadcrumb first (safe initialization)
        initializeBreadcrumb();
        
        // Load sidebar data first
        await loadSidebarData();

        // Update theme toggle icon setelah sidebar di-render
        if (window.updateThemeToggleIcon) {
            window.updateThemeToggleIcon();
        }

        // Determine current page type
        const currentPath = window.location.pathname;
        const currentPage = determinePageType(currentPath);

        // Initialize page-specific functionality
        switch (currentPage) {
            case 'home':
                await initializeHomePage();
                break;
            case 'modules':
                await initializeModulesPage();
                break;
            case 'module':
                await initializeModulePage();
                break;
            case 'about':
            case 'contact':
                await initializeStaticPage(currentPage);
                break;
            default:
                await initializeHomePage(); // Fallback to home
        }

        // Initialize common components
        initializeMobileMenu();
        setupEventListeners();

        // Trigger content loaded event for other scripts
        document.dispatchEvent(new Event('contentLoaded'));

    } catch (error) {
        showErrorMessage('Failed to load page content. Please refresh the page.');
    }
}

/**
 * Determine page type from current path
 */
function determinePageType(path) {
    const normalizedPath = path.toLowerCase();
    
    if (normalizedPath.includes('index.html') || normalizedPath === '/' || normalizedPath.endsWith('/learning-platform/') || normalizedPath.endsWith('/learning-platform')) {
        return 'home';
    } else if (normalizedPath.includes('modules.html')) {
        return 'modules';
    } else if (normalizedPath.includes('modul/') || normalizedPath.includes('modul')) {
        return 'module';
    } else if (normalizedPath.includes('about.html')) {
        return 'about';
    } else if (normalizedPath.includes('contact.html')) {
        return 'contact';
    }
    return 'home';
}

/**
 * Load sidebar data and render sidebar
 */
async function loadSidebarData() {
    try {
        const response = await fetch('/assets/data/sidebar.json');
        if (!response.ok) throw new Error('Failed to load sidebar data');

        AppState.sidebarData = await response.json();
        renderSidebar(AppState.sidebarData);
    } catch (error) {
        renderFallbackSidebar();
    }
}

/**
 * Render sidebar navigation
 */
function renderSidebar(data) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const { brand, navigation } = data;

    sidebar.innerHTML = `
        <!-- Brand Section -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3">
                ${brand.logo ? `<img src="${brand.logo}" alt="${brand.name}" class="w-8 h-8">` : ''}
                <div>
                    <h1 class="text-lg font-bold text-gray-900 dark:text-white">${brand.name}</h1>
                    ${brand.subtitle ? `<p class="text-xs text-gray-500 dark:text-gray-400">${brand.subtitle}</p>` : ''}
                </div>
            </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 p-4 overflow-y-auto">
            <ul class="space-y-2">
                ${renderNavigationItems(navigation)}
            </ul>
        </nav>
        
        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                © 2025 Faizal Qadri Trianto
            </p>
        </div>
    `;
}

/**
 * Render navigation items recursively - SIMPLE VERSION WITH ABSOLUTE PATHS
 */
function renderNavigationItems(items) {
    return items.map(item => {
        const isActive = isActiveNavItem(item.url);
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return `
                <li>
                    <button class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group" onclick="toggleNavGroup('${item.id}')">
                        <div class="flex items-center">
                            ${item.icon ? `<i class="${item.icon} mr-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"></i>` : ''}
                            <span>${item.title}</span>
                        </div>
                        <i class="fas fa-chevron-down transform transition-transform duration-200" id="${item.id}-chevron"></i>
                    </button>
                    <ul id="${item.id}-children" class="ml-6 mt-2 space-y-1 hidden">
                        ${renderNavigationItems(item.children)}
                    </ul>
                </li>
            `;
        } else {
            // ✅ LANGSUNG PAKE item.url - BODO AMAT CURRENT PATH!
            return `
                <li>
                    <a href="${item.url}" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-primary-orange text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} group">
                        ${item.icon ? `<i class="${item.icon} mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}"></i>` : ''}
                        <span>${item.title}</span>
                        ${item.badge ? `<span class="ml-auto bg-primary-orange text-white text-xs px-2 py-1 rounded-full">${item.badge}</span>` : ''}
                    </a>
                </li>
            `;
        }
    }).join('');
}

/**
 * Check if navigation item is active - SIMPLE VERSION
 */
function isActiveNavItem(url) {
    if (!url) return false;
    
    // Skip external links
    if (url.startsWith('http')) return false;
    
    const currentPath = window.location.pathname;
    
    // Direct match dengan URL dari JSON
    if (currentPath === url) return true;
    
    // Handle index.html cases
    if (url === '/index.html' && (currentPath === '/' || currentPath.endsWith('/') || currentPath.includes('index.html'))) {
        return true;
    }
    
    // Handle file name match (untuk yang di subfolder)
    const urlFileName = url.split('/').pop();
    const currentFileName = currentPath.split('/').pop();
    
    return urlFileName === currentFileName;
}

/**
 * Toggle navigation group
 */
function toggleNavGroup(groupId) {
    const children = document.getElementById(`${groupId}-children`);
    const chevron = document.getElementById(`${groupId}-chevron`);

    if (children && chevron) {
        children.classList.toggle('hidden');
        chevron.classList.toggle('rotate-180');
    }
}

/**
 * Initialize home page
 */
async function initializeHomePage() {
    try {
        const response = await fetch('/assets/data/homepage.json');
        if (!response.ok) throw new Error('Failed to load homepage data');

        const data = await response.json();
        renderPageContent(data.components);
        updateBreadcrumb([{ title: 'Home', url: '/index.html' }]);
    } catch (error) {
        renderFallbackHomePage();
        updateBreadcrumb([{ title: 'Home', url: '/index.html' }]);
    }
}

/**
 * Initialize modules page
 */
async function initializeModulesPage() {
    try {
        const response = await fetch('/assets/data/modules.json');
        if (!response.ok) throw new Error('Failed to load modules data');

        const data = await response.json();
        renderModulesGrid(data);
        updateBreadcrumb([
            { title: 'Home', url: '/index.html' },
            { title: 'Modules', url: '/pages/modules.html' }
        ]);
    } catch (error) {
        renderFallbackModulesPage();
        updateBreadcrumb([
            { title: 'Home', url: '/index.html' },
            { title: 'Modules', url: '/pages/modules.html' }
        ]);
    }
}

/**
 * Initialize individual module page
 */
async function initializeModulePage() {
    try {
        // Extract module number from URL
        const moduleMatch = window.location.pathname.match(/modul(\d+)\.html/);
        if (!moduleMatch) throw new Error('Invalid module URL');

        const moduleNumber = moduleMatch[1];
        const response = await fetch(`/assets/data/content/modul${moduleNumber}.json`);
        if (!response.ok) throw new Error('Failed to load module data');

        const data = await response.json();
        renderPageContent(data.components);
        updateBreadcrumb([
            { title: 'Home', url: '/index.html' },
            { title: 'Modules', url: '/pages/modules.html' },
            { title: data.title || `Modul ${moduleNumber}`, url: window.location.pathname }
        ]);

        // Initialize module-specific features
        initializeModuleNavigation(data);

    } catch (error) {
        renderFallbackModulePage();
        updateBreadcrumb([
            { title: 'Home', url: '/index.html' },
            { title: 'Modules', url: '/pages/modules.html' },
            { title: 'Module', url: window.location.pathname }
        ]);
    }
}

/**
 * Initialize static page (about, contact)
 */
async function initializeStaticPage(pageType) {
    try {
        const response = await fetch(`/assets/data/${pageType}.json`);
        if (!response.ok) throw new Error(`Failed to load ${pageType} data`);

        const data = await response.json();
        renderPageContent(data.components);
        updateBreadcrumb([
            { title: 'Home', url: '/index.html' },
            { title: data.title || pageType.charAt(0).toUpperCase() + pageType.slice(1), url: window.location.pathname }
        ]);
    } catch (error) {
        renderFallbackStaticPage(pageType);
        updateBreadcrumb([
            { title: 'Home', url: '/index.html' },
            { title: pageType.charAt(0).toUpperCase() + pageType.slice(1), url: window.location.pathname }
        ]);
    }
}

/**
 * Render page content using components
 */
function renderPageContent(components) {
    const contentContainer = document.getElementById('page-content');
    if (!contentContainer || !components) return;

    // Check if renderComponents function exists
    if (typeof renderComponents === 'function') {
        contentContainer.innerHTML = renderComponents(components);
    } else {
        contentContainer.innerHTML = '<div class="p-8 text-center text-gray-600 dark:text-gray-300">Content loading...</div>';
    }

    // Initialize Prism.js for syntax highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
}

/**
 * Render modules grid
 */
function renderModulesGrid(data) {
    const { title, description, modules } = data;

    const contentContainer = document.getElementById('page-content');
    if (!contentContainer) return;

    contentContainer.innerHTML = `
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">${title}</h1>
                <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">${description}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${modules.map(module => renderModuleCard(module)).join('')}
            </div>
        </div>
    `;
}

/**
 * Render individual module card
 */
function renderModuleCard(module) {
    const isCompleted = AppState.userData.completedModules.includes(module.id);
    const isBookmarked = AppState.userData.bookmarks.includes(module.id);

    return `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            ${module.image ? `
                <img src="${module.image}" alt="${module.title}" class="w-full h-48 object-cover">
            ` : `
                <div class="w-full h-48 bg-gradient-to-br from-primary-orange to-accent-orange flex items-center justify-center">
                    <i class="fas fa-mobile-alt text-white text-4xl"></i>
                </div>
            `}
            
            <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${module.title}</h3>
                    <button onclick="toggleBookmark('${module.id}')" class="text-gray-400 hover:text-yellow-500 transition-colors">
                        <i class="fas fa-star ${isBookmarked ? 'text-yellow-500' : ''}"></i>
                    </button>
                </div>
                
                <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">${module.description}</p>
                
                <div class="flex items-center justify-between">
                    <a href="${module.url}" class="inline-flex items-center px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-accent-orange transition-colors">
                        ${isCompleted ? 'Review' : 'Start Learning'}
                        <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                    
                    ${isCompleted ? `
                        <span class="text-green-600 dark:text-green-400">
                            <i class="fas fa-check-circle mr-1"></i>
                            Completed
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (mobileMenuBtn && sidebar && overlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }
}

/**
 * Initialize breadcrumb (safe initialization)
 */
function initializeBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        updateBreadcrumb([{ title: 'Loading...', url: '#' }]);
    }
}

/**
 * Update breadcrumb navigation
 */
function updateBreadcrumb(breadcrumbItems) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (!breadcrumb || !breadcrumbItems) return;

    breadcrumb.innerHTML = breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        if (isLast) {
            return `<span class="text-gray-500 dark:text-gray-400">${item.title}</span>`;
        } else {
            return `
                <a href="${item.url}" class="text-primary-orange hover:text-accent-orange transition-colors">${item.title}</a>
                <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
            `;
        }
    }).join('');
}

/**
 * Initialize module navigation (prev/next)
 */
function initializeModuleNavigation(moduleData) {
    if (moduleData.navigation) {
        const { previous, next } = moduleData.navigation;

        const contentContainer = document.getElementById('page-content');
        const navHTML = `
            <div class="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                ${previous ? `
                    <a href="${previous.url}" class="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <i class="fas fa-arrow-left mr-3"></i>
                        <div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Previous</div>
                            <div class="font-medium">${previous.title}</div>
                        </div>
                    </a>
                ` : '<div></div>'}
                
                ${next ? `
                    <a href="${next.url}" class="flex items-center px-6 py-3 bg-primary-orange text-white hover:bg-accent-orange rounded-lg transition-colors">
                        <div class="text-right">
                            <div class="text-sm text-orange-100">Next</div>
                            <div class="font-medium">${next.title}</div>
                        </div>
                        <i class="fas fa-arrow-right ml-3"></i>
                    </a>
                ` : '<div></div>'}
            </div>
        `;

        contentContainer.insertAdjacentHTML('beforeend', navHTML);
    }
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Handle external links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="http"]');
        if (link && !link.href.includes(window.location.hostname)) {
            e.preventDefault();
            window.open(link.href, '_blank');
        }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search (if implemented)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Implement search functionality
        }
    });
}

/**
 * Toggle bookmark for module
 */
function toggleBookmark(moduleId) {
    const bookmarks = AppState.userData.bookmarks;
    const index = bookmarks.indexOf(moduleId);

    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(moduleId);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Update UI
    const button = event.target.closest('button');
    const icon = button.querySelector('i');

    if (index > -1) {
        icon.classList.remove('text-yellow-500');
    } else {
        icon.classList.add('text-yellow-500');
    }
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    const contentContainer = document.getElementById('page-content');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="max-w-2xl mx-auto text-center py-12">
                <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Something went wrong</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-6">${message}</p>
                <button onclick="window.location.reload()" class="px-6 py-2 bg-primary-orange text-white rounded-lg hover:bg-accent-orange transition-colors">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Fallback rendering functions

/**
 * Render fallback sidebar when data fails to load
 */
function renderFallbackSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">Modul Praktikum</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Mobile Development</p>
        </div>
        <nav class="flex-1 p-4">
            <ul class="space-y-2">
                <li><a href="/index.html" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-home mr-3"></i>Home
                </a></li>
                <li><a href="/pages/modules.html" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-book mr-3"></i>Modules
                </a></li>
            </ul>
        </nav>
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                © 2025 Faizal Qadri Trianto
            </p>
        </div>
    `;
}

/**
 * Render fallback home page
 */
function renderFallbackHomePage() {
    const contentContainer = document.getElementById('page-content');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="text-center py-12">
                <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Mobile Development Platform</h1>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">Learn mobile app development step by step</p>
                <a href="/pages/modules.html" class="inline-flex items-center px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-accent-orange transition-colors">
                    Start Learning <i class="fas fa-arrow-right ml-2"></i>
                </a>
            </div>
        `;
    }
}

/**
 * Render fallback modules page
 */
function renderFallbackModulesPage() {
    const contentContainer = document.getElementById('page-content');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="text-center py-12">
                <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Learning Modules</h1>
                <p class="text-gray-600 dark:text-gray-300 mb-8">Content is being loaded...</p>
            </div>
        `;
    }
}

/**
 * Render fallback module page
 */
function renderFallbackModulePage() {
    const contentContainer = document.getElementById('page-content');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="text-center py-12">
                <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Module Content</h1>
                <p class="text-gray-600 dark:text-gray-300 mb-8">Unable to load module content. Please try again later.</p>
                <a href="/pages/modules.html" class="inline-flex items-center px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-accent-orange transition-colors">
                    Back to Modules <i class="fas fa-arrow-left ml-2"></i>
                </a>
            </div>
        `;
    }
}

/**
 * Render fallback static page
 */
function renderFallbackStaticPage(pageType) {
    const contentContainer = document.getElementById('page-content');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="text-center py-12">
                <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">${pageType.charAt(0).toUpperCase() + pageType.slice(1)}</h1>
                <p class="text-gray-600 dark:text-gray-300">Content will be available soon.</p>
            </div>
        `;
    }
}

// Export functions for global use
window.toggleNavGroup = toggleNavGroup;
window.toggleBookmark = toggleBookmark;
window.AppState = AppState;
