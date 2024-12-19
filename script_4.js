document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Aquí puedes agregar la lógica para enviar el formulario
            console.log('Formulario enviado:', { name, email, message });

            // Limpiar el formulario después del envío
            contactForm.reset();
        });
    }

    // Animaciones adicionales para la página de contacto
    const contactContent = document.querySelector('.contact-content');
    if (contactContent) {
        contactContent.style.opacity = '0';
        setTimeout(() => {
            contactContent.style.transition = 'opacity 0.5s ease';
            contactContent.style.opacity = '1';
        }, 100);
    }
});