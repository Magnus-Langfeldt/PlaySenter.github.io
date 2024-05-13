const burgerEl = document.querySelector(".fa-bars")

const navEl = document.querySelector("nav2")

burgerEl.addEventListener("click", showNav)

function showNav(){
  navEl.classList.toggle("show")
}