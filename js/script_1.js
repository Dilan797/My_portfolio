const menuIcon = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-menu');
const body = document.body;

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