document.addEventListener('DOMContentLoaded', function() {
    // Selección de elementos del DOM
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const container = document.querySelector('.container');
    const closeBtn = document.querySelector('.close-btn');
    const links = document.querySelectorAll('.links a');
    const mainContainer = document.querySelector('.main-container');

    // Verificación de elementos críticos
    if (!container || !mainContainer) {
        console.error('Elementos críticos no encontrados');
        return;
    }

    // Limpiar cualquier estado residual al cargar
    const existingStackedContainer = document.querySelector('.stacked-pages-container');
    if (existingStackedContainer) {
        existingStackedContainer.remove();
    }
    document.body.style.opacity = '1';

    const pages = ['contact.html', 'projects.html', 'about.html'];
    let stackedPages = [];

    async function loadPageContent(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const pageContent = doc.querySelector('.page-content');
            return pageContent ? pageContent.innerHTML : '<div>No se encontró contenido</div>';
        } catch (error) {
            console.error('Error al cargar la página:', error);
            return '<div>Error al cargar el contenido</div>';
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
                        window.location.href = `${pageName}.html`;
                    }
                }
            }
        });

        return page;
    }

    async function initializeStackedPages() {
        if (!document.querySelector('.stacked-pages-container')) {
            const stackedContainer = document.createElement('div');
            stackedContainer.className = 'stacked-pages-container';

            for (let i = 0; i < pages.length; i++) {
                const url = pages[i];
                const content = await loadPageContent(url);
                if (content) {
                    const pageName = url.replace('.html', '');
                    const page = createStackedPage(i + 1, content, pageName);
                    stackedContainer.appendChild(page);
                    stackedPages.push(page);
                }
            }

            container.appendChild(stackedContainer);
        }
    }

    // Manejador del menú hamburguesa
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

    // Manejador de clic para el contenedor principal
        // Manejador de clic para el contenedor principal
    if (mainContainer) {
        const mainContent = mainContainer.querySelector('.main');
        
        mainContainer.addEventListener('click', function(e) {
            if (e.target.closest('.hamburger-menu')) return;

            if (container.classList.contains('active')) {
                const isExpanded = mainContainer.classList.contains('expanded');
                
                if (!isExpanded) {
                    // Verificar si estamos en index.html
                    if (window.location.pathname.includes('index.html')) {
                        // Limpiar todo el estado
                        container.classList.remove('active');
                        mainContainer.style = '';
                        mainContainer.classList.remove('expanded');
                        
                        // Remover el contenedor de páginas apiladas
                        const stackedContainer = document.querySelector('.stacked-pages-container');
                        if (stackedContainer) {
                            stackedContainer.remove();
                        }
                        
                        // Reiniciar todo el estado
                        stackedPages = [];
                        
                        // Recargar la página
                        window.location.reload();
                    } else {
                        mainContainer.classList.add('expanded');
                        container.classList.remove('active');
                        mainContainer.style = '';
                        
                        const stackedContainer = document.querySelector('.stacked-pages-container');
                        if (stackedContainer) {
                            stackedContainer.remove();
                        }
                        
                        stackedPages = [];
                    }
                }
            }
        });
    }

    // Botón de cierre
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.classList.remove('active');
            mainContainer.classList.remove('expanded');
            stackedPages.forEach(p => p.classList.remove('show-page'));
            mainContainer.style.transform = 'none';
            mainContainer.style.cursor = 'auto';
        });
    }

    // Enlaces de navegación
    
    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            if (href === 'index.html') {
                // Solo mover la página principal al frente
                mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(310px) scale(0.65)';
                mainContainer.style.zIndex = '0';
                
                // Asegurarnos que las otras páginas estén detrás
                stackedPages.forEach(p => {
                    p.classList.remove('show-page');
                });
                
            } else {
                const targetPageName = href.replace('.html', '');
                mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(-766px) scale(0.65)';
                mainContainer.style.zIndex = '-3';

                stackedPages.forEach(p => {
                    p.classList.remove('show-page');
                    if (p.getAttribute('data-page') === targetPageName) {
                        p.classList.add('show-page');
                    }
                });
            }
        });
    });
});