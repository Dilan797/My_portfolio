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

    // Configuración inicial
    const pages = ['index.html', 'projects.html', 'about.html'];
    let stackedPages = [];

    // Función para cargar el contenido de las páginas
    async function loadPageContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP! estado: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            if (url.includes('index.html')) {
                const mainContent = doc.querySelector('.main');
                if (mainContent) {
                    return mainContent.outerHTML;
                }
                
                const mainDiv = doc.querySelector('#main');
                if (mainDiv) {
                    const page1 = doc.querySelector('#page1');
                    const nav = doc.querySelector('#nav');
                    const elements = doc.querySelector('#elements');
                    
                    if (page1 && nav && elements) {
                        return `
                            <div class="main">
                                <div id="main">
                                    <div id="page1" class="height-set">
                                        ${nav.outerHTML}
                                        ${elements.outerHTML}
                                        <h1>DILAN</h1>
                                    </div>
                                    ${doc.querySelector('#page2')?.outerHTML || ''}
                                    ${doc.querySelector('#page3')?.outerHTML || ''}
                                    ${doc.querySelector('#page4')?.outerHTML || ''}
                                    ${doc.querySelector('#page5')?.outerHTML || ''}
                                    ${doc.querySelector('#page6')?.outerHTML || ''}
                                </div>
                            </div>
                        `;
                    }
                }
            }
            
            const mainContainer = doc.querySelector('.main-container');
            if (mainContainer) {
                const mainContent = mainContainer.querySelector('.main');
                return mainContent ? mainContent.outerHTML : mainContainer.outerHTML;
            }
            
            const fallbackContent = doc.querySelector('#elements') || 
                                doc.querySelector('.main') ||
                                doc.querySelector('#main');
            
            return fallbackContent ? fallbackContent.outerHTML : 
                '<div class="error-message">Contenido no encontrado</div>';
        } catch (error) {
            console.error(`Error al cargar ${url}:`, error);
            return `<div class="error-message">Error al cargar ${url}</div>`;
        }
    }

    // Función para manejar estados de transformación
    function handleTransformStates(state, mainContainer) {
        const transforms = {
            'default': {
                transform: 'none',
                zIndex: '0',
                cursor: 'auto'
            },
            'menu-open': {
                transform: 'perspective(1300px) rotateY(16deg) translateZ(310px) translateX(-21px) scale(0.65)',
                zIndex: '0',
                cursor: 'pointer'
            },
            'page-active': {
                transform: 'perspective(1300px) rotateY(20deg) translateZ(-420px) translateX(57px) scale(0.65)',
                zIndex: '-3',
                cursor: 'pointer'
            }
        };

        const currentState = transforms[state] || transforms.default;
        
        Object.assign(mainContainer.style, {
            transform: currentState.transform,
            zIndex: currentState.zIndex,
            cursor: currentState.cursor,
            transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.7s'
        });
    }

    // Función para manejar el clic en páginas apiladas
    function handleStackedPageClick(page) {
        if (page.classList.contains('show-page')) {
            window.location.href = `${page.getAttribute('data-page')}.html`;
        } else {
            stackedPages.forEach(p => p.classList.remove('show-page'));
            page.classList.add('show-page');
            handleTransformStates('page-active', mainContainer);
            const returnButton = page.querySelector('.return-button');
            if (returnButton) {
                returnButton.style.display = 'block';
            }
        }
    }

    // Función para crear una página apilada
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
            if (e.target.classList.contains('return-button')) {
                colapsePage(this);
            } else {
                handleStackedPageClick(this);
            }
        });

        return page;
    }

    // Función para colapsar una página
    function colapsePage(page) {
        page.classList.remove('show-page');
        page.querySelector('.return-button').style.display = 'none';
        handleTransformStates('menu-open', mainContainer);
    }

    // Función para inicializar páginas apiladas
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

    // Event Listeners
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', async () => {
            if (!container.classList.contains('active')) {
                container.classList.add('active');
                
                if (stackedPages.length === 0) {
                    await initializeStackedPages();
                }
                
                handleTransformStates('menu-open', mainContainer);
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.classList.remove('active');
            handleTransformStates('default', mainContainer);
            stackedPages.forEach(p => p.classList.remove('show-page'));
        });
    }

    if (mainContainer) {
        mainContainer.addEventListener('click', function(e) {
            if (e.target.closest('.hamburger-menu')) return;

            if (container.classList.contains('active')) {
                container.classList.remove('active');
                handleTransformStates('default', mainContainer);
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            if (href === 'contact.html') {
                handleTransformStates('menu-open', mainContainer);
                stackedPages.forEach(p => p.classList.remove('show-page'));
                return;
            }

            const targetPageName = href.replace('.html', '');
            handleTransformStates('page-active', mainContainer);

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
        });
    });
});
