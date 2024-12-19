document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const container = document.querySelector('.container');
    const closeBtn = document.querySelector('.close-btn');
    const links = document.querySelectorAll('.links a');
    const mainContainer = document.querySelector('.main-container');
    let scrollEnabled = true;

    if (!container || !mainContainer) {
        console.error('Elementos críticos no encontrados');
        return;
    }

    const existingStackedContainer = document.querySelector('.stacked-pages-container');
    if (existingStackedContainer) {
        existingStackedContainer.remove();
    }
    document.body.style.opacity = '1';

    const pages = ['contact.html', 'projects.html', 'about.html'];
    let stackedPages = [];

    // Reemplaza la función toggleScroll
    function toggleScroll(enable) {
        scrollEnabled = enable;
        if (enable) {
            document.body.classList.remove('no-scroll');
            document.querySelectorAll('.stacked-page').forEach(page => {
                const preview = page.querySelector('.page-preview');
                if (preview) {
                    preview.classList.add('preview-hidden');
                }
            });
        } else {
            document.body.classList.add('no-scroll');
        }
    }

    async function loadPageContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // Get the main container that includes all content
            const mainContainer = doc.querySelector('.main-container');
            
            if (!mainContainer) {
                // If we can't find the main container, try to get individual components
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
                // If we found the main container, use its content
                return mainContainer.querySelector('.main').innerHTML;
            }
            
            // Fallback content if nothing is found
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
    
    async function initializeStackedPages() {
        if (!document.querySelector('.stacked-pages-container')) {
            const stackedContainer = document.createElement('div');
            stackedContainer.className = 'stacked-pages-container';
            function createStackedPage(index, content, pageName) {
                const page = document.createElement('div');
                page.className = 'stacked-page';
                page.style.zIndex = -index;
                page.setAttribute('data-page', pageName);
            
                // Crear un elemento temporal para manipular el contenido
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
            
                // Remover cualquier botón de retorno existente
                tempDiv.querySelectorAll('.return-button').forEach(btn => btn.remove());
            
                // Construir la estructura de la página sin estilos inline en el botón
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
            
                // Recuperar el botón y aplicar estilos mediante JavaScript
                const returnButton = page.querySelector('.return-button');
                if (returnButton) {
                    Object.assign(returnButton.style, {
                        display: 'none',
                        position: 'absolute', // Cambiado de 'fixed' a 'absolute'
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

    function resetState() {
        container.classList.remove('active');
        mainContainer.style.transform = 'none';
        mainContainer.style.cursor = 'auto';
        toggleScroll(true);
        stackedPages.forEach(p => p.classList.remove('show-page'));
    }

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', async () => {
            if (!container.classList.contains('active')) {
                container.classList.add('active');
                toggleScroll(true);
                
                if (stackedPages.length === 0) {
                    await initializeStackedPages();
                }
                
                mainContainer.style.transform = 'perspective(1300px) rotateY(15deg) translateZ(271px) scale(0.65)';
                mainContainer.style.cursor = 'pointer';
            }
        });
    }

    function colapsePage(page) {
        page.classList.remove('show-page');
        page.querySelector('.return-button').style.display = 'none';
        mainContainer.style.transform = 'perspective(1300px) rotateY(15deg) translateZ(310px) scale(0.65)';
        mainContainer.style.zIndex = '0';
        toggleScroll(true);
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

            if (href === 'index.html' || href === '/index.html' || href === '/') {
                mainContainer.style.transform = 'perspective(1300px) rotateY(16deg) translateZ(289px) scale(0.65)';
                mainContainer.style.zIndex = '0';
                stackedPages.forEach(p => p.classList.remove('show-page'));
                toggleScroll(true);
            } else {
                const targetPageName = href.replace('.html', '');
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