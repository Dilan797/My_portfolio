const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

var tl = gsap.timeline()

// Configuración inicial
tl.set("#page1, #page2", {
    y: "100vh",
    scale: 0.5
})

// Animación simultánea de ambas páginas
tl.to("#main, #page1,#page2", {
    y: "0vh",
    duration: 1,
    delay: 1.2
})
.to("#page1,#page2", {
    y: "10vh",
    rotate: 360,
    scale: 1,
    duration: 0.8
},"-=0.2")
// Ajuste final para asegurar que ambas páginas estén en su lugar
.set("#main, #page1,#page2", {
    y: "0vh"
});

