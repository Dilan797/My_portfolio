document.addEventListener('DOMContentLoaded', function() {
    // DOM Element Selection
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const container = document.querySelector('.container');
    const closeBtn = document.querySelector('.close-btn');
    const links = document.querySelectorAll('.links a');
    const mainContainer = document.querySelector('.main-container');

    // Critical Elements Verification
    if (!container || !mainContainer) {
        console.error('Critical elements not found in the DOM');
        return;
    }

    // Clear residual state on load
    const existingStackedContainer = document.querySelector('.stacked-pages-container');
    if (existingStackedContainer) {
        existingStackedContainer.remove();
    }
    document.body.style.opacity = '1';

    // Using absolute paths for better compatibility with deployment
    const pages = ['/contact.html', '/projects.html', '/about.html'];
    let stackedPages = [];

    async function loadPageContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const pageContent = doc.querySelector('.page-content');
            
            if (!pageContent) {
                throw new Error('Page content structure not found');
            }
            
            return pageContent.innerHTML;
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
            return `<div class="error-message">
                        <h3>Error al cargar el contenido</h3>
                        <p>No se pudo cargar ${url}</p>
                        <p>Por favor, intente nuevamente más tarde</p>
                    </div>`;
        }
    }

    function createStackedPage(index, content, pageName) {
        const page = document.createElement('div');
        page.className = 'stacked-page';
        page.style.zIndex = -index;
        page.setAttribute('data-page', pageName);

        page.innerHTML = `
            <div class="page-preview">
                ${content}
            </div>
            <div class="shadow one"></div>
            <div class="shadow two"></div>
            <button class="return-button" style="display: none;">×</button>
        `;

        page.addEventListener('click', function(e) {
            if (this.classList.contains('show-page')) {
                if (e.target.classList.contains('return-button')) {
                    colapsePage(this);
                } else {
                    const pageName = this.getAttribute('data-page');
                    if (pageName) {
                        // Using absolute path for navigation
                        window.location.href = `/${pageName}.html`;
                    }
                }
            }
        });

        return page;
    }

    function colapsePage(page) {
        page.classList.remove('show-page');
        page.querySelector('.return-button').style.display = 'none';
        mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(310px) scale(0.65)';
        mainContainer.style.zIndex = '0';
    }

    async function initializeStackedPages() {
        try {
            if (!document.querySelector('.stacked-pages-container')) {
                const stackedContainer = document.createElement('div');
                stackedContainer.className = 'stacked-pages-container';

                for (let i = 0; i < pages.length; i++) {
                    const url = pages[i];
                    const content = await loadPageContent(url);
                    if (content) {
                        const pageName = url.replace('.html', '').replace('/', '');
                        const page = createStackedPage(i + 1, content, pageName);
                        stackedContainer.appendChild(page);
                        stackedPages.push(page);
                    }
                }

                container.appendChild(stackedContainer);
            }
        } catch (error) {
            console.error('Error initializing stacked pages:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = '<p>Error al cargar las páginas. Por favor, recargue la página.</p>';
            container.appendChild(errorMessage);
        }
    }

    // Hamburger menu handler
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', async () => {
            if (!container.classList.contains('active')) {
                container.classList.add('active');
                
                if (stackedPages.length === 0) {
                    await initializeStackedPages();
                }
                
                mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(310px) scale(0.65)';
                mainContainer.style.cursor = 'pointer';
            }
        });
    }

    // Main container click handler
    if (mainContainer) {
        mainContainer.addEventListener('click', function(e) {
            if (e.target.closest('.hamburger-menu')) return;

            if (container.classList.contains('active')) {
                const isExpanded = mainContainer.classList.contains('expanded');
                
                if (!isExpanded) {
                    // Check if we're on index page
                    const isIndex = window.location.pathname === '/' || 
                                  window.location.pathname === '/index.html';
                    
                    if (isIndex) {
                        resetState();
                    } else {
                        mainContainer.classList.add('expanded');
                        container.classList.remove('active');
                        mainContainer.style = '';
                        resetStackedPages();
                    }
                }
            }
        });
    }

    function resetState() {
        container.classList.remove('active');
        mainContainer.style = '';
        mainContainer.classList.remove('expanded');
        resetStackedPages();
        window.location.reload();
    }

    function resetStackedPages() {
        const stackedContainer = document.querySelector('.stacked-pages-container');
        if (stackedContainer) {
            stackedContainer.remove();
        }
        stackedPages = [];
    }

    // Close button handler
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.classList.remove('active');
            mainContainer.classList.remove('expanded');
            stackedPages.forEach(p => p.classList.remove('show-page'));
            mainContainer.style.transform = 'none';
            mainContainer.style.cursor = 'auto';
        });
    }

    // Navigation links handler
    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            if (href === 'index.html' || href === '/index.html' || href === '/') {
                mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(310px) scale(0.65)';
                mainContainer.style.zIndex = '0';
                stackedPages.forEach(p => p.classList.remove('show-page'));
            } else {
                const targetPageName = href.replace('.html', '').replace('/', '');
                mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(-766px) scale(0.65)';
                mainContainer.style.zIndex = '-3';

                stackedPages.forEach(p => {
                    p.classList.remove('show-page');
                    if (p.getAttribute('data-page') === targetPageName) {
                        p.classList.add('show-page');
                        p.querySelector('.return-button').style.display = 'block';
                    }
                });
            }
        });
    });
});