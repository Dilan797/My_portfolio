document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const container = document.querySelector('.container');
    const closeBtn = document.querySelector('.close-btn');
    const links = document.querySelectorAll('.links a');
    
    // Función para cargar el contenido de las páginas
    async function loadPageContent(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            // Seleccionar el contenido de la página
            const pageContent = doc.querySelector('.page-content');
            return pageContent ? pageContent.innerHTML : '<div>No content found</div>';
        } catch (error) {
            console.error('Error loading page:', error);
            return '<div>Error loading content</div>';
        }
    }

    // Función para crear página apilada
    function createStackedPage(index, content) {
        const page = document.createElement('div');
        page.className = 'stacked-page';
        page.style.zIndex = -index;
        
        // Crear estructura similar a tu página principal
        page.innerHTML = `
            <div class="main-container">
                <div class="page-preview">
                    ${content}
                </div>
                <div class="shadow one"></div>
                <div class="shadow two"></div>
            </div>
        `;
        return page;
    }

    // Función para inicializar páginas apiladas
    async function initializeStackedPages() {
        const stackedContainer = document.createElement('div');
        stackedContainer.className = 'stacked-pages-container';
        
        // URLs de las páginas a cargar
        const pages = ['contact.html', 'projects.html'];
        
        for (let i = 0; i < pages.length; i++) {
            const content = await loadPageContent(pages[i]);
            if (content) {
                const page = createStackedPage(i + 1, content);
                stackedContainer.appendChild(page);
            }
        }
        
        container.appendChild(stackedContainer);
    }

    // Inicializar cuando se abre el menú
    hamburgerMenu.addEventListener('click', () => {
        container.classList.add('active');
        if (!document.querySelector('.stacked-pages-container')) {
            initializeStackedPages();
        }
    });

    // Limpiar cuando se cierra el menú
    closeBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });
});