document.addEventListener('DOMContentLoaded', function() {
    // Selección de elementos del DOM
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const container = document.querySelector('.container');
    const closeBtn = document.querySelector('.close-btn');
    const links = document.querySelectorAll('.links a');
    const mainContainer = document.querySelector('.main-container');
    let scrollPosition = 0;

    // Verificación inicial
    if (!container || !mainContainer) {
        console.error('Elementos críticos no encontrados');
        return;
    }

    // Limpieza inicial
    const existingStackedContainer = document.querySelector('.stacked-pages-container');
    if (existingStackedContainer) {
        existingStackedContainer.remove();
    }
    document.body.style.opacity = '1';

    // Configuración inicial
    const pages = ['contact.html', 'projects.html', 'about.html'];
    let stackedPages = [];

    // Función mejorada para el manejo del scroll
    function toggleScroll(enable) {
        if (!enable) {
            scrollPosition = window.pageYOffset;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('position');
            document.body.style.removeProperty('top');
            document.body.style.removeProperty('width');
            document.body.style.removeProperty('touch-action');
            window.scrollTo(0, scrollPosition);
        }
    }

    // Función para cargar contenido de páginas
    async function loadPageContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            const mainContainer = doc.querySelector('.main-container');
            
            if (!mainContainer) {
                const nav = doc.querySelector('#nav');
                const content = doc.querySelector('#elements') || 
                            doc.querySelector('.page-content') ||
                            doc.querySelector('.main');
                            
                if (nav && content) {
                    return `
                        <div class="main">
                            ${nav.outerHTML}
                            ${content.outerHTML}
                        </div>
                    `;
                }
            } else {
                return mainContainer.querySelector('.main').innerHTML;
            }
            
            throw new Error('Content structure not found');
            
        } catch (error) {
            console.error(`Error al cargar ${url}:`, error);
            return `
                <div id="nav">
                    <h5>Huila, Co.</h5>
                    <img src="https://uploads-ssl.webflow.com/5f2429f172d117fcee10e819/5f7f87c8b81a6e7a214312f0_header.svg">
                    <div id="menu-icon" class="hamburger-menu">
                        <div class="bar"></div>
                    </div>
                </div>
                <div id="elements">
                    <div class="error-message">
                        <h3>Error al cargar el contenido</h3>
                        <p>No se pudo cargar ${url}</p>
                    </div>
                </div>
            `;
        }
    }

    // Función para crear páginas apiladas
    function createStackedPage(index, content, pageName) {
        const page = document.createElement('div');
        page.className = 'stacked-page';
        page.style.zIndex = -index;
        page.setAttribute('data-page', pageName);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        tempDiv.querySelectorAll('.return-button').forEach(btn => btn.remove());

        page.innerHTML = `
            <div class="page-preview">
                <div class="page-inner">
                    ${tempDiv.innerHTML}
                </div>
            </div>
            <div class="shadow one"></div>
            <div class="shadow two"></div>
            <button class="return-button">×</button>
        `;

        const returnButton = page.querySelector('.return-button');
        if (returnButton) {
            Object.assign(returnButton.style, {
                display: 'none',
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: '100',
                background: 'transparent',
                color: 'transparent',
                border: 'none',
                padding: '10px',
                cursor: 'pointer',
                fontSize: '24px'
            });
        }

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

    // Función para inicializar páginas apiladas
    async function initializeStackedPages() {
        if (!document.querySelector('.stacked-pages-container')) {
            toggleScroll(false);
            
            const stackedContainer = document.createElement('div');
            stackedContainer.className = 'stacked-pages-container';

            try {
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
            } finally {
                toggleScroll(true);
            }
        }
    }

    // Función para manejar transiciones de página
    function handlePageTransition(targetPageName) {
        mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(-766px) scale(0.65)';
        mainContainer.style.zIndex = '-3';
        
        stackedPages.forEach(p => {
            p.classList.remove('show-page');
            if (p.getAttribute('data-page') === targetPageName) {
                p.classList.add('show-page');
                const returnButton = p.querySelector('.return-button');
                if (returnButton) {
                    returnButton.style.display = 'block';
                }
            }
        });

        setTimeout(() => toggleScroll(true), 700);
    }

    // Función para restablecer el estado
    function resetState() {
        container.classList.remove('active');
        mainContainer.style.transform = 'none';
        mainContainer.style.cursor = 'auto';
        mainContainer.style.zIndex = '0';
        
        stackedPages.forEach(p => {
            p.classList.remove('show-page');
            const returnButton = p.querySelector('.return-button');
            if (returnButton) {
                returnButton.style.display = 'none';
            }
        });
        
        toggleScroll(true);
    }

    // Función para colapsar página
    function colapsePage(page) {
        page.classList.remove('show-page');
        page.querySelector('.return-button').style.display = 'none';
        mainContainer.style.transform = 'perspective(1300px) rotateY(15deg) translateZ(310px) scale(0.65)';
        mainContainer.style.zIndex = '0';
        toggleScroll(true);
    }

    // Event Listeners
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', async () => {
            if (!container.classList.contains('active')) {
                toggleScroll(false);
                container.classList.add('active');
                
                if (stackedPages.length === 0) {
                    await initializeStackedPages();
                }
                
                mainContainer.style.transform = 'perspective(1300px) rotateY(15deg) translateZ(271px) translateX(-16px) scale(0.7)';
                mainContainer.style.cursor = 'pointer';
            }
        });
    }

    if (mainContainer) {
        mainContainer.addEventListener('click', function(e) {
            if (e.target.closest('.hamburger-menu')) return;
            if (container.classList.contains('active')) {
                resetState();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', resetState);
    }

    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            toggleScroll(false);

            if (href === 'index.html' || href === '/index.html' || href === '/') {
                mainContainer.style.transform = 'perspective(1300px) rotateY(15deg) translateZ(289px) translateX(-16px) scale(0.69)';
                mainContainer.style.zIndex = '0';
                stackedPages.forEach(p => p.classList.remove('show-page'));
                setTimeout(() => toggleScroll(true), 700);
            } else {
                const targetPageName = href.replace('.html', '');
                handlePageTransition(targetPageName);
            }
        });
    });

    // Manejadores de eventos adicionales para el scroll
    window.addEventListener('resize', () => {
        if (!container.classList.contains('active')) {
            toggleScroll(true);
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !container.classList.contains('active')) {
            toggleScroll(true);
        }
    });
}); 