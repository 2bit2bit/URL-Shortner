const navOpen = document.querySelector(".mobile-nav_toggle-btn");
const navClose = document.querySelector(".mobile-nav_close");
const mobileNav = document.querySelector(".mobile-nav");



const openNav = () => {
    mobileNav.style.right = "0"
}

const closeNav = () => {
    mobileNav.style.right = "-20rem"
}


navOpen.addEventListener("click", openNav)
navClose.addEventListener("click", closeNav)