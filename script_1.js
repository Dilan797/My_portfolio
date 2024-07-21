function adjustElements() {
    const img = document.getElementById('responsive-img');
    const text = document.getElementById('responsive-text');
    const container = document.getElementById('page2-right');

    // Ajustar imagen
    img.style.width = '100%';
    img.style.height = 'auto';
    
    // Ajustar texto
    const containerWidth = container.offsetWidth;
    text.style.fontSize = (containerWidth * 0.05) + 'px';
}

// Ajustar al cargar la página
window.onload = adjustElements;

// Ajustar al cambiar el tamaño de la ventana
window.onresize = adjustElements;