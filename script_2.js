document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const container = document.querySelector('.container');
    const closeBtn = document.querySelector('.close-btn');
    const links = document.querySelectorAll('.links a');
    const body = document.body;
    
    // Guarda la posición del scroll antes de bloquearlo
    let scrollPosition = 0;
    
    // Función para bloquear el scroll
    function lockScroll() {
        // Guarda la posición actual del scroll
        scrollPosition = window.pageYOffset;
        // Aplica los estilos para bloquear el scroll
        body.classList.add('scroll-lock');
        // Mantiene la posición visual de la página
        body.style.top = `-${scrollPosition}px`;
    }
    
    // Función para desbloquear el scroll
    function unlockScroll() {
        body.classList.remove('scroll-lock');
        // Restaura la posición del scroll
        window.scrollTo(0, scrollPosition);
        body.style.top = '';
    }

    // Abre el menú y bloquea el scroll
    hamburgerMenu.addEventListener('click', () => {
        container.classList.add('active');
        lockScroll();
    });

    // Cierra el menú y desbloquea el scroll
    closeBtn.addEventListener('click', () => {
        container.classList.remove('active');
        unlockScroll();
    });

    // Maneja la navegación a través de los enlaces
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Previene el comportamiento por defecto
            container.classList.remove('active');
            unlockScroll();
            
            // Navega a la sección después de que se cierre el menú
            setTimeout(() => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        });
    });
});