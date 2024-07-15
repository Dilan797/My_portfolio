var tl = gsap.timeline()

// Configuración inicial
tl.set("#main", {
    y: "0",
    scale: 0.5
})
.set("#page1, #page2", {
    y: "100vh"
})

// Animación
tl.to("#main", {
    scale: 1,
    duration: 1,
    delay: 1
})
.to("#page1, #page2", {
    y: "0vh",
    duration: 1
}, "-=0.5")
.to("#main", {
    rotate: 360,
    duration: 0.9
}, "-=0.7")


// Animación del contenedor principal
tl.to("#main,#page1, #page2", {
    y: "-80vh",
    duration: 1.5,
    delay: 1
})