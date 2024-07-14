const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

//En esta parte del código damos el efecto cundo inicia la web
var tl = gsap.timeline()

tl.to("#page1",{
    y:"100vh",
    scale:0.5
})
tl.to("#page1",{
    y:"30vh",
    duration: 1,
    delay:1     
})
tl.to("#page1",{
    y:"0vh",
    rotate:360,
    scale:1,
    duration: 0.8
})