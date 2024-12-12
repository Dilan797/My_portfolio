// Controlador de visibilidad para el menú y las páginas
class MenuVisibilityController {
    constructor() {
        this.container = document.querySelector('.container');
        this.mainContainer = document.querySelector('.main-container');
        this.stackedPages = document.querySelectorAll('.stacked-page');
        this.menuIcon = document.querySelector('#menu-icon');
        
        this.isMenuActive = false;
        this.activePageIndex = null;
        
        this.initialize();
    }

    initialize() {
        // Inicializar eventos
        this.menuIcon.addEventListener('click', () => this.toggleMenu());
        
        // Eventos para las páginas apiladas
        this.stackedPages.forEach((page, index) => {
            page.addEventListener('click', () => this.showPage(index));
        });
        
        // Evento para regresar a la vista principal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.resetView();
        });
    }

    toggleMenu() {
        this.isMenuActive = !this.isMenuActive;
        this.container.classList.toggle('active');
        
        if (this.isMenuActive) {
            // Cuando el menú está activo
            this.mainContainer.style.opacity = '0.2';
            this.mainContainer.style.pointerEvents = 'none';
            this.mainContainer.style.filter = 'blur(2px)';
            this.mainContainer.style.transform = 'perspective(1300px) rotateY(20deg) translateZ(310px) scale(0.65)';
            
            // Mostrar páginas apiladas
            this.stackedPages.forEach((page, index) => {
                page.style.visibility = 'visible';
                page.style.opacity = `${0.2 + (index * 0.3)}`;
                page.style.zIndex = index + 1;
            });
        } else {
            this.resetView();
        }
    }

    showPage(index) {
        if (!this.isMenuActive) return;
        
        this.activePageIndex = index;
        
        // Ocultar la página principal
        this.mainContainer.style.opacity = '0';
        this.mainContainer.style.zIndex = '-1';
        
        // Ajustar las páginas apiladas
        this.stackedPages.forEach((page, i) => {
            if (i === index) {
                // Página seleccionada al frente
                page.classList.add('show-page');
                page.style.opacity = '1';
                page.style.zIndex = '99';
                page.style.pointerEvents = 'auto';
            } else {
                // Ocultar otras páginas
                page.style.opacity = '0';
                page.style.zIndex = '1';
                page.style.pointerEvents = 'none';
            }
        });
    }

    resetView() {
        // Restablecer todo a su estado original
        this.isMenuActive = false;
        this.activePageIndex = null;
        this.container.classList.remove('active');
        
        this.mainContainer.style.opacity = '1';
        this.mainContainer.style.pointerEvents = 'auto';
        this.mainContainer.style.filter = 'none';
        this.mainContainer.style.transform = 'none';
        this.mainContainer.style.zIndex = '10';
        
        this.stackedPages.forEach(page => {
            page.classList.remove('show-page');
            page.style.visibility = 'hidden';
            page.style.opacity = '0';
            page.style.pointerEvents = 'none';
        });
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const menuController = new MenuVisibilityController();
});