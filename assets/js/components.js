/**
 * Standardized Component Rendering System for Learning Platform
 * All UI styles are predefined in component.js to ensure consistency
 * JSON only provides data values, no custom styling
 */

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getFileName(filePath) {
    if (!filePath) return 'code.txt';
    return filePath.split(/[/\\]/).pop();
}

function generateSectionId(sectionName, componentType = '') {
    if (!sectionName) return generateId();

    const cleanName = sectionName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const prefix = componentType ? `${componentType}-` : '';
    return `${prefix}${cleanName}`;
}

// File reading utility dengan path resolution yang benar
async function readCodeFile(filePath) {
    try {
        // Normalisasi path - hapus leading slash dan resolve relative path
        let normalizedPath = filePath;
        
        // Jika path dimulai dengan ./ hapus prefix tersebut
        if (normalizedPath.startsWith('./')) {
            normalizedPath = normalizedPath.substring(2);
        }
        
        // Jika path tidak dimulai dengan / atau http, pastikan relative path benar
        if (!normalizedPath.startsWith('/') && !normalizedPath.startsWith('http')) {
            // Untuk relative path, gunakan dari root website
            normalizedPath = '/' + normalizedPath;
        }
        
        console.log(`Loading code from: ${normalizedPath}`); // Debug log
        
        const response = await fetch(normalizedPath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Failed to read file: ${filePath}`, error);
        return `// Error: Could not load file ${getFileName(filePath)}\n// ${error.message}`;
    }
}

// Standardized Component Renderers
const ComponentRenderers = {

    /**
     * Module Header - Standardized header for all modules with theme support
     */
    moduleHeader: (data) => {
        const { title, moduleName, description, theme = 'orange' } = data;
        const headerId = generateSectionId(title, 'header');

        const themeClasses = {
            orange: 'bg-gradient-to-br from-orange-500 to-red-600',
            navy: 'bg-gradient-to-br from-blue-800 to-indigo-900',
            blue: 'bg-gradient-to-br from-blue-600 to-indigo-700',
            white: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200'
        };

        const textColor = theme === 'white' ? 'text-gray-900' : 'text-white';
        const badgeColor = theme === 'white' ? 'bg-gray-900/10 text-gray-700' : 'bg-white/20';
        const subtitleColor = theme === 'white' ? 'text-gray-600' : 'text-orange-100';

        return `
            <section id="${headerId}" class="${themeClasses[theme]} ${textColor} py-16 px-6 rounded-xl mb-8 shadow-lg">
                <div class="max-w-4xl mx-auto text-center">
                    <div class="inline-block ${badgeColor} px-4 py-2 rounded-full text-sm font-medium mb-4">
                        ${moduleName}
                    </div>
                    <h1 class="text-3xl md:text-5xl font-bold mb-6">${title}</h1>
                    <p class="text-lg md:text-xl ${subtitleColor} max-w-2xl mx-auto leading-relaxed">
                        ${description}
                    </p>
                </div>
            </section>
        `;
    },

    /**
     * Info Box - Standardized information display with enhanced colors
     */
    info: (data) => {
        const { title, content, type = 'default', shared = false } = data;
        const infoId = generateSectionId(title, 'info');

        const typeStyles = {
            default: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200',
            primary: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-200',
            success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
            error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
            navy: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
        };

        const icons = {
            default: 'fas fa-info-circle',
            primary: 'fas fa-lightbulb',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle',
            navy: 'fas fa-anchor'
        };

        return `
            <div id="${infoId}" class="border-l-4 p-6 mb-6 ${typeStyles[type]} rounded-r-lg shadow-sm">
                <div class="flex items-start justify-between">
                    <div class="flex items-start flex-1">
                        <i class="${icons[type]} text-xl mr-4 mt-1"></i>
                        <div class="flex-1">
                            <h3 class="font-semibold text-lg mb-2">${title}</h3>
                            <div class="prose prose-sm max-w-none">${content}</div>
                        </div>
                    </div>
                    ${shared ? `
                        <button onclick="shareSection('${infoId}', '${title}')" 
                                class="ml-4 p-2 opacity-60 hover:opacity-100 transition-opacity hover:text-orange-600" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Material Section - Standardized content sections with theme support
     */
    material: (data) => {
        const { title, content, level = 'h2', shared = false, theme = 'default' } = data;
        const materialId = generateSectionId(title, 'material');

        const headingClasses = {
            h1: 'text-3xl font-bold mb-6',
            h2: 'text-2xl font-bold mb-4',
            h3: 'text-xl font-semibold mb-3',
            h4: 'text-lg font-semibold mb-2',
            h5: 'text-base font-semibold mb-2',
            h6: 'text-sm font-semibold mb-2'
        };

        const themeColors = {
            default: 'text-gray-900 dark:text-white',
            orange: 'text-orange-700 dark:text-orange-300',
            navy: 'text-blue-800 dark:text-blue-300'
        };

        return `
            <section id="${materialId}" class="mb-8 scroll-mt-20">
                <div class="flex items-center justify-between mb-4">
                    <${level} class="${headingClasses[level]} ${themeColors[theme]}">
                        ${title}
                    </${level}>
                    ${shared ? `
                        <button onclick="shareSection('${materialId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="prose prose-lg dark:prose-invert max-w-none">
                    ${content}
                </div>
            </section>
        `;
    },

    /**
     * Code Block - Standardized code display with enhanced UI
     */
    code: (data) => {
        const { title, description, filePath, language = 'javascript', shared = true, theme = 'orange' } = data;

        if (!filePath) {
            return `
                <div class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                    <p class="text-red-600">Error: filePath is required for code component</p>
                </div>
            `;
        }

        const codeId = generateId();
        const loaderId = `loader-${codeId}`;
        const containerId = generateSectionId(title, 'code');
        const displayFileName = getFileName(filePath);

        const themeColors = {
            orange: 'hover:text-orange-400',
            navy: 'hover:text-blue-400',
            blue: 'hover:text-blue-400'
        };

        // Initialize code loading
        setTimeout(async () => {
            const loader = document.getElementById(loaderId);
            if (loader) loader.style.display = 'flex';

            const codeContent = await readCodeFile(filePath);

            if (loader) loader.style.display = 'none';

            const codeElement = document.getElementById(codeId);
            if (codeElement) {
                codeElement.textContent = codeContent;
                if (typeof Prism !== 'undefined') {
                    Prism.highlightElement(codeElement);
                }
            }
        }, 100);

        return `
            <div id="${containerId}" class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden scroll-mt-20">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${title}</h3>
                            ${description ? `<p class="text-gray-600 dark:text-gray-300 mt-1">${description}</p>` : ''}
                        </div>
                        ${shared ? `
                            <button onclick="shareSection('${containerId}', '${title}')" 
                                    class="p-2 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" 
                                    title="Share this code">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="relative">
                    <!-- Code Header -->
                    <div class="flex items-center justify-between bg-gray-800 text-white px-4 py-3">
                        <div class="flex items-center space-x-3">
                            <div class="flex space-x-1">
                                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span class="text-sm font-mono text-gray-300">${displayFileName}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="downloadCodeFile('${filePath}', '${codeId}')" 
                                    class="p-2 hover:bg-gray-700 rounded-lg transition-colors group" 
                                    title="Download File">
                                <i class="fas fa-download text-sm ${themeColors[theme]}"></i>
                            </button>
                            <button onclick="copyCodeToClipboard('${codeId}')" 
                                    class="p-2 hover:bg-gray-700 rounded-lg transition-colors group" 
                                    title="Copy Code">
                                <i class="fas fa-copy text-sm group-hover:text-green-400"></i>
                            </button>
                            <button onclick="toggleFullscreen('${codeId}')" 
                                    class="p-2 hover:bg-gray-700 rounded-lg transition-colors group" 
                                    title="Fullscreen">
                                <i class="fas fa-expand text-sm ${themeColors[theme]}"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Loading indicator -->
                    <div id="${loaderId}" class="hidden absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
                        <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                            <span>Loading code...</span>
                        </div>
                    </div>
                    
                    <!-- Code Content -->
                    <div class="relative">
                        <pre class="!mt-0 !mb-0 overflow-x-auto bg-gray-50 dark:bg-gray-800 p-4" style="max-height: 600px;"><code id="${codeId}" class="language-${language} line-numbers">Loading...</code></pre>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Command Section - Standardized command/terminal display with theme support
     */
    command: (data) => {
        const { title, description, commands, type = 'terminal', shared = false, theme = 'orange' } = data;
        const commandId = generateSectionId(title, 'command');
        
        const themeColors = {
            orange: 'text-orange-700 dark:text-orange-300',
            navy: 'text-blue-800 dark:text-blue-300',
            blue: 'text-blue-700 dark:text-blue-300'
        };
        
        const typeStyles = {
            terminal: 'bg-gray-900 text-green-400',
            powershell: 'bg-blue-900 text-white',
            cmd: 'bg-black text-white'
        };
        
        const promptSymbols = {
            terminal: '$',
            powershell: 'PS>',
            cmd: 'C:\\>'
        };
        
        return `
            <section id="${commandId}" class="mb-8 scroll-mt-20">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold ${themeColors[theme]}">${title}</h3>
                    ${shared ? `
                        <button onclick="shareSection('${commandId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" 
                                title="Share this command">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    ` : ''}
                </div>
                ${description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>` : ''}
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <!-- Terminal Header -->
                    <div class="flex items-center justify-between bg-gray-200 dark:bg-gray-700 px-4 py-2">
                        <div class="flex items-center space-x-2">
                            <div class="flex space-x-1">
                                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">${type.toUpperCase()}</span>
                        </div>
                        <button onclick="copyCommandsToClipboard('${commandId}')" 
                                class="p-1 text-gray-500 hover:text-orange-600 rounded transition-colors" 
                                title="Copy all commands">
                            <i class="fas fa-copy text-sm"></i>
                        </button>
                    </div>
                    
                    <!-- Terminal Content -->
                    <div class="${typeStyles[type]} p-4 font-mono text-sm overflow-x-auto">
                        <div id="${commandId}-content">
                            ${commands.map((cmd, index) => {
                                const cmdId = `${commandId}-cmd-${index}`;
                                return `
                                    <div class="mb-2 group">
                                        <div class="flex items-center">
                                            <span class="text-gray-400 mr-2">${promptSymbols[type]}</span>
                                            <span class="flex-1">${cmd.command}</span>
                                            <button onclick="copyToClipboard('${cmd.command}')" 
                                                    class="ml-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all" 
                                                    title="Copy command">
                                                <i class="fas fa-copy text-xs"></i>
                                            </button>
                                        </div>
                                        ${cmd.output ? `
                                            <div class="mt-1 ml-6 text-gray-300 whitespace-pre-wrap">${cmd.output}</div>
                                        ` : ''}
                                        ${cmd.comment ? `
                                            <div class="mt-1 ml-6 text-gray-500 text-xs"># ${cmd.comment}</div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    /**
     * Card Section - Standardized card layout with theme support
     */
    cardSection: (data) => {
        const { title, cards, columns = 2, shared = false, theme = 'orange' } = data;
        const sectionId = generateSectionId(title, 'cards');
        const gridClass = `grid-cols-1 md:grid-cols-${Math.min(columns, 3)}`;

        const themeColors = {
            orange: 'text-orange-700 dark:text-orange-300',
            navy: 'text-blue-800 dark:text-blue-300',
            blue: 'text-blue-700 dark:text-blue-300'
        };

        return `
            <section id="${sectionId}" class="mb-8 scroll-mt-20">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold ${themeColors[theme]}">${title}</h2>
                    ${shared ? `
                        <button onclick="shareSection('${sectionId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    ` : ''}
                </div>
                
                <div class="grid ${gridClass} gap-6">
                    ${cards.map(card => `
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-orange-300 dark:hover:border-orange-600">
                            ${card.image ? `
                                <img src="${card.image}" alt="${card.title}" class="w-full h-48 object-cover">
                            ` : ''}
                            <div class="p-6">
                                <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">${card.title}</h3>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">${card.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    },

    /**
     * Accordion Section - Standardized accordion layout with theme support
     */
    accordionSection: (data) => {
        const { title, items, allowMultiple = false, shared = false, theme = 'orange' } = data;
        const accordionId = generateSectionId(title, 'accordion');

        const themeColors = {
            orange: 'text-orange-700 dark:text-orange-300',
            navy: 'text-blue-800 dark:text-blue-300',
            blue: 'text-blue-700 dark:text-blue-300'
        };

        return `
            <section id="${accordionId}" class="mb-8 scroll-mt-20">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold ${themeColors[theme]}">${title}</h2>
                    ${shared ? `
                        <button onclick="shareSection('${accordionId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    ` : ''}
                </div>
                
                <div class="space-y-3" data-accordion="${accordionId}" data-multiple="${allowMultiple}">
                    ${items.map((item, index) => {
            const itemId = `${accordionId}-item-${index}`;
            return `
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
                                <button 
                                    class="accordion-toggle w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
                                    data-target="${itemId}"
                                    onclick="toggleAccordion('${itemId}', '${accordionId}', ${allowMultiple})"
                                >
                                    <span class="font-medium text-gray-900 dark:text-white">${item.title}</span>
                                    <i class="fas fa-chevron-down transform transition-transform duration-200 text-orange-500"></i>
                                </button>
                                <div id="${itemId}" class="accordion-content hidden">
                                    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 prose prose-sm dark:prose-invert max-w-none">
                                        ${item.content}
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </section>
        `;
    },

    /**
     * Video Section - Standardized YouTube embed with theme support
     */
    video: (data) => {
        const { title, description, videoId, shared = true, theme = 'orange' } = data;
        const videoContainerId = generateSectionId(title, 'video');

        const themeColors = {
            orange: 'text-orange-700 dark:text-orange-300',
            navy: 'text-blue-800 dark:text-blue-300',
            blue: 'text-blue-700 dark:text-blue-300'
        };

        return `
            <section id="${videoContainerId}" class="mb-8 scroll-mt-20">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold ${themeColors[theme]}">${title}</h3>
                    ${shared ? `
                        <button onclick="shareSection('${videoContainerId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" 
                                title="Share this video">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    ` : ''}
                </div>
                ${description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>` : ''}
                
                <div class="relative pb-[56.25%] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-transparent hover:border-orange-300 transition-colors">
                    <iframe 
                        class="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
                        title="${title}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </section>
        `;
    },

    /**
     * Table Section - Standardized table display with theme support
     */
    table: (data) => {
        const { title, headers, rows, shared = false, theme = 'orange' } = data;
        const tableId = generateSectionId(title, 'table');

        const themeColors = {
            orange: 'text-orange-700 dark:text-orange-300',
            navy: 'text-blue-800 dark:text-blue-300',
            blue: 'text-blue-700 dark:text-blue-300'
        };

        return `
            <section id="${tableId}" class="mb-8 scroll-mt-20">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold ${themeColors[theme]}">${title}</h3>
                    ${shared ? `
                        <button onclick="shareSection('${tableId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" 
                                title="Share this table">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    ` : ''}
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                        <thead class="bg-orange-50 dark:bg-gray-700">
                            <tr>
                                ${headers.map(header => `
                                    <th class="px-6 py-3 text-left font-medium text-orange-700 dark:text-orange-300">${header}</th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            ${rows.map(row => `
                                <tr class="hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                                    ${row.map(cell => `
                                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">${cell}</td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    }
};

/**
 * Main rendering function
 */
function renderComponent(component) {
    const { type, data, id } = component;

    if (!ComponentRenderers[type]) {
        console.warn(`Unknown component type: ${type}`);
        return `
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p class="text-red-600">Unknown component type: <strong>${type}</strong></p>
            </div>
        `;
    }

    const renderedHTML = ComponentRenderers[type](data);

    if (id) {
        return `<div id="${id}" class="component-container" data-component-type="${type}">${renderedHTML}</div>`;
    }

    return renderedHTML;
}

function renderComponents(components) {
    return components.map(component => renderComponent(component)).join('');
}

// Interactive Functions (enhanced with better URL handling)
function copyCodeToClipboard(codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;

    navigator.clipboard.writeText(codeElement.textContent).then(() => {
        showToast('Code copied to clipboard!', 'success');

        const button = event.target.closest('button');
        const icon = button.querySelector('i');
        const originalClass = icon.className;

        icon.className = 'fas fa-check text-sm';
        button.classList.add('bg-green-600');

        setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove('bg-green-600');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
        showToast('Failed to copy code', 'error');
    });
}

function downloadCodeFile(filePath, codeId) {
    if (filePath) {
        // Normalisasi path untuk download
        let downloadPath = filePath;
        if (downloadPath.startsWith('./')) {
            downloadPath = downloadPath.substring(2);
        }
        if (!downloadPath.startsWith('/') && !downloadPath.startsWith('http')) {
            downloadPath = '/' + downloadPath;
        }
        
        const link = document.createElement('a');
        link.href = downloadPath;
        link.download = getFileName(filePath);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Download started!', 'success');
    }
}

// Function untuk copy semua commands
function copyCommandsToClipboard(commandId) {
    const commandContent = document.getElementById(`${commandId}-content`);
    if (!commandContent) return;
    
    // Extract hanya command text, bukan output
    const commands = Array.from(commandContent.querySelectorAll('.group')).map(group => {
        const commandSpan = group.querySelector('span:nth-child(2)');
        return commandSpan ? commandSpan.textContent.trim() : '';
    }).filter(cmd => cmd).join('\n');
    
    navigator.clipboard.writeText(commands).then(() => {
        showToast('All commands copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy commands: ', err);
        showToast('Failed to copy commands', 'error');
    });
}

function shareSection(sectionId, title) {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('section', sectionId);

    const shareData = {
        title: title,
        text: `Check out this section: ${title}`,
        url: currentUrl.toString()
    };

    // Langsung pakai popup, skip native share
    showShareModal(shareData);
}

function showShareModal(shareData) {
    const modal = document.createElement('div');
    const modalId = generateId();
    
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 transform animate-slide-in">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Share: ${shareData.title}</h3>
                <button onclick="closeShareModal('${modalId}')" 
                        class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- URL Display -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share URL:</label>
                <div class="flex items-center space-x-2">
                    <input type="text" 
                           id="share-url-${modalId}" 
                           value="${shareData.url}" 
                           readonly 
                           class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                    <button onclick="copyShareUrl('${modalId}')" 
                            class="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            
            <!-- Social Share Buttons -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Share on:</label>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="shareToWhatsApp('${encodeURIComponent(shareData.text + ' ' + shareData.url)}')" 
                            class="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fab fa-whatsapp mr-2"></i>WhatsApp
                    </button>
                    <button onclick="shareToTelegram('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')" 
                            class="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fab fa-telegram mr-2"></i>Telegram
                    </button>
                    <button onclick="shareToTwitter('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')" 
                            class="flex items-center justify-center px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                        <i class="fab fa-twitter mr-2"></i>Twitter
                    </button>
                    <button onclick="shareToFacebook('${encodeURIComponent(shareData.url)}')" 
                            class="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fab fa-facebook mr-2"></i>Facebook
                    </button>
                    <button onclick="shareToLinkedIn('${encodeURIComponent(shareData.title)}', '${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')" 
                            class="flex items-center justify-center px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                        <i class="fab fa-linkedin mr-2"></i>LinkedIn
                    </button>
                    <button onclick="shareToEmail('${encodeURIComponent(shareData.title)}', '${encodeURIComponent(shareData.text + ' ' + shareData.url)}')" 
                            class="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <i class="fas fa-envelope mr-2"></i>Email
                    </button>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-3">
                <button onclick="copyShareUrl('${modalId}')" 
                        class="flex-1 flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <i class="fas fa-link mr-2"></i>Copy Link
                </button>
                <button onclick="closeShareModal('${modalId}')" 
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeShareModal(modalId);
        }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeShareModal(modalId);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function closeShareModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('animate-fade-out');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 200);
    }
}

function copyShareUrl(modalId) {
    const input = document.getElementById(`share-url-${modalId}`);
    if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(() => {
            showToast('Link copied to clipboard!', 'success');
            
            // Visual feedback
            const button = event.target.closest('button');
            const icon = button.querySelector('i');
            const originalClass = icon.className;
            
            icon.className = 'fas fa-check';
            button.classList.add('bg-green-500');
            
            setTimeout(() => {
                icon.className = originalClass;
                button.classList.remove('bg-green-500');
                button.classList.add('bg-orange-500');
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy link', 'error');
        });
    }
}

// Social media share functions
function shareToWhatsApp(text) {
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareToTelegram(text, url) {
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

function shareToTwitter(text, url) {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToLinkedIn(title, text, url) {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${text}`, '_blank');
}

function shareToEmail(subject, body) {
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}


function toggleFullscreen(codeId) {
    const codeContainer = document.getElementById(codeId).closest('.component-container') ||
        document.getElementById(codeId).closest('div[class*="bg-white"]');
    if (!codeContainer) return;

    if (codeContainer.classList.contains('fullscreen-code')) {
        codeContainer.classList.remove('fullscreen-code');
        document.body.classList.remove('overflow-hidden');
    } else {
        codeContainer.classList.add('fullscreen-code');
        document.body.classList.add('overflow-hidden');
    }
}

function toggleAccordion(itemId, accordionId, allowMultiple) {
    const item = document.getElementById(itemId);
    const button = document.querySelector(`[data-target="${itemId}"]`);
    const icon = button.querySelector('i');

    if (!allowMultiple) {
        const accordion = document.querySelector(`[data-accordion="${accordionId}"]`);
        const allItems = accordion.querySelectorAll('.accordion-content');
        const allButtons = accordion.querySelectorAll('.accordion-toggle i');

        allItems.forEach(otherItem => {
            if (otherItem.id !== itemId && !otherItem.classList.contains('hidden')) {
                otherItem.classList.add('hidden');
            }
        });

        allButtons.forEach(otherIcon => {
            if (otherIcon !== icon) {
                otherIcon.classList.remove('rotate-180');
            }
        });
    }

    if (item.classList.contains('hidden')) {
        item.classList.remove('hidden');
        item.style.maxHeight = '0px';
        item.style.overflow = 'hidden';
        item.style.transition = 'max-height 0.3s ease-out';

        item.offsetHeight;
        item.style.maxHeight = item.scrollHeight + 'px';

        setTimeout(() => {
            item.style.maxHeight = '';
            item.style.overflow = '';
            item.style.transition = '';
        }, 300);
    } else {
        item.style.maxHeight = item.scrollHeight + 'px';
        item.style.overflow = 'hidden';
        item.style.transition = 'max-height 0.3s ease-out';

        item.offsetHeight;
        item.style.maxHeight = '0px';

        setTimeout(() => {
            item.classList.add('hidden');
            item.style.maxHeight = '';
            item.style.overflow = '';
            item.style.transition = '';
        }, 300);
    }

    icon.classList.toggle('rotate-180');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const toastId = generateId();

    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-orange-500 text-white'
    };

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.id = toastId;
    toast.className = `fixed top-4 right-4 ${typeClasses[type]} px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="closeToast('${toastId}')" class="ml-2 opacity-70 hover:opacity-100">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        closeToast(toastId);
    }, 5000);
}

function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;

    toast.classList.add('translate-x-full');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}


function closeModal(element) {
    const modal = element.closest('.fixed');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy', 'error');
    });
}

// Enhanced CSS Styles with orange theme
const componentCSS = `
<style>
.fullscreen-code {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
    background: white !important;
    overflow: auto !important;
}

.dark .fullscreen-code {
    background: #1f2937 !important;
}

.fullscreen-code pre {
    max-height: none !important;
    height: calc(100vh - 120px) !important;
}

.highlight-section {
    animation: highlightPulse 3s ease-in-out;
    border: 2px solid #f97316;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}

@keyframes highlightPulse {
    0% {
        box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
    }
    50% {
        box-shadow: 0 0 30px rgba(249, 115, 22, 0.6);
    }
    100% {
        box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-in {
    animation: slideIn 0.3s ease-out;
}

/* Enhanced smooth scroll behavior */
html {
    scroll-behavior: smooth;
}

/* Section anchor offset for fixed headers */
.component-container {
    scroll-margin-top: 100px;
}

.scroll-mt-20 {
    scroll-margin-top: 5rem;
}

/* Enhanced prose styling for content */
.prose {
    line-height: 1.7;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: #c2410c;
}

.dark .prose h1, .dark .prose h2, .dark .prose h3, 
.dark .prose h4, .dark .prose h5, .dark .prose h6 {
    color: #fdba74;
}

.prose p {
    margin-bottom: 1em;
}

.prose ul, .prose ol {
    margin: 1em 0;
    padding-left: 1.5em;
}

.prose li {
    margin: 0.25em 0;
}

.prose code {
    background-color: #fed7aa;
    color: #c2410c;
    padding: 0.125em 0.25em;
    border-radius: 0.25rem;
    font-size: 0.875em;
}

.dark .prose code {
    background-color: #431407;
    color: #fdba74;
}

.prose a {
    color: #ea580c;
    text-decoration: underline;
}

.prose a:hover {
    color: #c2410c;
}

.dark .prose a {
    color: #fb923c;
}

.dark .prose a:hover {
    color: #fdba74;
}

/* Enhanced responsive grid adjustments */
@media (max-width: 768px) {
    .grid-cols-1.md\\:grid-cols-2,
    .grid-cols-1.md\\:grid-cols-3 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    .scroll-mt-20 {
        scroll-margin-top: 3rem;
    }
}

@media (min-width: 768px) {
    .md\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .md\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

/* Loading animation */
.loading-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .5;
    }
}

/* Scroll indicator */
.scroll-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #f97316, #ea580c);
    transform-origin: left;
    z-index: 9999;
}

/* Enhanced focus styles */
button:focus-visible,
a:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

.animate-fade-out {
    animation: fadeOut 0.2s ease-out;
}

.animate-slide-in {
    animation: slideInModal 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

@keyframes slideInModal {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
`;

// Inject CSS
if (!document.getElementById('component-styles')) {
    const styleElement = document.createElement('style');  // ✅ Benar
    styleElement.id = 'component-styles';
    styleElement.textContent = componentCSS.replace(/<\/?style>/g, ''); // ✅ Remove style tags
    document.head.appendChild(styleElement);
}

// Enhanced Navigation dengan MutationObserver
async function navigateToSection() {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionId = urlParams.get('section');

    if (sectionId) {
        try {
            const section = await waitForElement(sectionId, 3000);

            // Smooth scroll to section with offset
            const yOffset = -80;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });

            // Add highlight effect
            section.classList.add('highlight-section');
            setTimeout(() => {
                section.classList.remove('highlight-section');
            }, 3000);

            // Update browser history
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('section', sectionId);
            window.history.replaceState({}, '', newUrl);

            showToast(`Navigated to: ${section.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || sectionId}`, 'info');

        } catch (error) {
            console.warn(`Section with ID '${sectionId}' not found:`, error.message);
            showToast(`Section '${sectionId}' not found`, 'warning');
        }
    }
}

// Enhanced scroll progress indicator
function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;

    let indicator = document.getElementById('scroll-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'scroll-indicator';
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);
    }

    indicator.style.transform = `scaleX(${scrollProgress / 100})`;
}

// Auto-render function for dynamic content with enhanced error handling
function autoRenderComponents(containerId, components) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        showToast(`Container '${containerId}' not found`, 'error');
        return;
    }

    try {
        // Show loading state
        container.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="flex items-center space-x-3 text-orange-600">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <span class="text-lg">Loading content...</span>
                </div>
            </div>
        `;

        // Render components dengan callback setelah selesai
        setTimeout(() => {
            const renderedHTML = renderComponents(components);
            container.innerHTML = renderedHTML;

            // Initialize syntax highlighting if Prism.js is available
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }

            // PENTING: Navigate to section SETELAH render selesai
            setTimeout(() => {
                navigateToSection();
            }, 100); // Delay kecil untuk memastikan DOM sudah update

            // Add scroll progress indicator
            if (!window.scrollListenerAdded) {
                window.addEventListener('scroll', updateScrollProgress);
                window.scrollListenerAdded = true;
            }
            updateScrollProgress();

            showToast('Content loaded successfully!', 'success');
        }, 300);

    } catch (error) {
        console.error('Error rendering components:', error);
        container.innerHTML = `
            <div class="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 class="text-red-800 font-semibold mb-2">Rendering Error</h3>
                <p class="text-red-600">${error.message}</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Retry
                </button>
            </div>
        `;
        showToast('Failed to render content', 'error');
    }
}

// Helper function to wait for element to exist
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.getElementById(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.getElementById(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// Export all functions for global use
window.ComponentRenderers = ComponentRenderers;
window.renderComponent = renderComponent;
window.renderComponents = renderComponents;
window.autoRenderComponents = autoRenderComponents;
window.generateSectionId = generateSectionId;
window.copyCodeToClipboard = copyCodeToClipboard;
window.downloadCodeFile = downloadCodeFile;
window.shareSection = shareSection;
window.toggleFullscreen = toggleFullscreen;
window.toggleAccordion = toggleAccordion;
window.navigateToSection = navigateToSection;
window.showToast = showToast;
window.closeToast = closeToast;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.updateScrollProgress = updateScrollProgress;
window.copyCommandsToClipboard = copyCommandsToClipboard; // Export function baru

// Enhanced initialization on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize syntax highlighting if Prism.js is available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Navigate to section if specified in URL
    navigateToSection();

    // Initialize scroll progress
    updateScrollProgress();

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Press 'S' to share current section
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            const activeSection = document.querySelector('.highlight-section');
            if (activeSection) {
                const title = activeSection.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || 'Section';
                shareSection(activeSection.id, title);
            }
        }
    });
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    navigateToSection();
});

// Enhanced utility function to load and render JSON content
async function loadAndRenderModule(jsonPath, containerId) {
    try {
        showToast('Loading module...', 'info');

        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const moduleData = await response.json();

        // Validate JSON structure
        if (!moduleData.components || !Array.isArray(moduleData.components)) {
            throw new Error('Invalid JSON structure: components array is required');
        }

        // Render components
        autoRenderComponents(containerId, moduleData.components);

        // Update page title if available
        if (moduleData.title) {
            document.title = moduleData.title;
        }

        // Update meta description if available
        if (moduleData.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = moduleData.description;
        }

    } catch (error) {
        console.error('Failed to load module:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="p-6 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
                        <h3 class="text-red-800 font-semibold">Failed to Load Module</h3>
                    </div>
                    <p class="text-red-600 mb-4">${error.message}</p>
                    <div class="flex space-x-3">
                        <button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <i class="fas fa-redo mr-2"></i>Retry
                        </button>
                        <button onclick="window.history.back()" class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i>Go Back
                        </button>
                    </div>
                </div>
            `;
        }
        showToast('Failed to load module', 'error');
    }
}

// Export utility function
window.loadAndRenderModule = loadAndRenderModule;

// Add global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showToast('An unexpected error occurred', 'error');
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('An unexpected error occurred', 'error');
});

// Tambahkan di bagian export functions
window.showShareModal = showShareModal;
window.closeShareModal = closeShareModal;
window.copyShareUrl = copyShareUrl;
window.shareToWhatsApp = shareToWhatsApp;
window.shareToTelegram = shareToTelegram;
window.shareToTwitter = shareToTwitter;
window.shareToFacebook = shareToFacebook;
window.shareToLinkedIn = shareToLinkedIn;
window.shareToEmail = shareToEmail;
