document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.hamburger-menu');  // Cambiamos a querySelector
    const navMenu = document.querySelector('.links');           // Cambiamos a querySelector
    const body = document.body;

    // Verificamos que los elementos existan
    if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', () => {
            const isActive = menuIcon.classList.contains('active');
            
            if (isActive) {
                menuIcon.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('no-scroll');
            } else {
                menuIcon.classList.add('active');
                navMenu.classList.add('active');
                body.classList.add('no-scroll');
            }
        });
    } else {
        console.log('Elementos del menú no encontrados');
    }
});