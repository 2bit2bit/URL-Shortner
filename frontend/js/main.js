const host = "https://www.scly.live";
// const host = "http://localhost:8080";


const navOpen = document.querySelector(".mobile-nav_toggle-btn");
const navClose = document.querySelector(".mobile-nav_close");
const mobileNav = document.querySelector(".mobile-nav");

const logoutBtn = document.getElementById("logoutBtn");
const logoutBtnMobile = document.getElementById("logoutBtnMobile");

logoutBtn.addEventListener("click", logout)
logoutBtnMobile.addEventListener("click", logout)  

function logout() {
    console.log('yea')
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("./login.html");
}

const openNav = () => {
    mobileNav.style.right = "0"
}

const closeNav = () => {
    mobileNav.style.right = "-20rem"
}


navOpen.addEventListener("click", openNav)
navClose.addEventListener("click", closeNav)