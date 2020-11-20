export const hideShowFav = (function() {
    const container = document.querySelector('.main-container'),
    toggleButton = document.querySelector(".favourites-hamburger");

    toggleButton.addEventListener( "click", function(e) {
      e.preventDefault();
      container.classList.toggle("is-active");
    });
}())