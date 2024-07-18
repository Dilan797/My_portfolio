function setPage1Height() {
    const page1 = document.getElementById('page1');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Añade la clase para establecer la altura base
    page1.classList.add('height-set');

    // Calcula la altura deseada en píxeles
    let desiredHeight;
    if (viewportWidth >= 1200) {
        desiredHeight = viewportHeight * 1.3; // 130vh
    } else {
        desiredHeight = viewportHeight * 0.93; // 93vh
    }

    // Establece la altura en píxeles
    page1.style.height = `${desiredHeight}px`;
}

// Ejecuta la función cuando la página carga y cuando se redimensiona la ventana
window.addEventListener('load', setPage1Height);
window.addEventListener('resize', setPage1Height);

// Ejecuta la función cuando cambia el zoom (funciona en la mayoría de los navegadores)
window.addEventListener('scroll', function() {
    if (window.visualViewport) {
        setPage1Height();
    }
});