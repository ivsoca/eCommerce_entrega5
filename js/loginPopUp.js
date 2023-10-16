document.addEventListener("DOMContentLoaded", function () {
  let contenido = document.getElementById("contenido");
  let loginPopup = document.getElementById("loginPopup");
  let loginButton = document.getElementById("loginButton");
  let usuarioLogueado = false;

  //Cambiar usuarioLogueado segun estado de login
  if (localStorage.getItem("email") != null) {
    usuarioLogueado = true;
  } else {
    usuarioLogueado = false;
  }

  //Mostrar pop up si no está logueado
  if (usuarioLogueado) {
    loginPopup.style.display = "none";
    contenido.style.pointerEvents = "all";
  } else {
    loginPopup.style.display = "flex";
    contenido.style.pointerEvents = "none";
  }
  loginButton.addEventListener("click", function () {
    loginPopup.style.display = window.location.href = "login.html";
  });
});
