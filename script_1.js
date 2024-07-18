document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('page5');
    const lines = container.querySelectorAll('.line');
    
    const leftContainer = document.createElement('div');
    leftContainer.className = 'left-container';
    const rightContainer = document.createElement('div');
    rightContainer.className = 'right-container';
    
    lines.forEach((line, index) => {
        const h1 = line.querySelector('h1');
        const span = h1.querySelector('span');
        
        if (index === 0) { // Solo tomamos el primer conjunto de texto
            leftContainer.textContent = h1.childNodes[0].textContent.trim();
            rightContainer.appendChild(span.cloneNode(true));
        }
    });
    
    container.innerHTML = '';
    container.appendChild(leftContainer);
    container.appendChild(rightContainer);
});