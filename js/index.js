//redirige al usuario a "products.html" y almacena los valores en el localStorage segun la categoria que se haya activado el addEventListener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("autos").addEventListener("click", function () {
    localStorage.setItem("catID", 101);
    localStorage.setItem("catName", "Autos");
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function () {
    localStorage.setItem("catID", 102);
    localStorage.setItem("catName", "Juguetes");
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function () {
    localStorage.setItem("catID", 103);
    localStorage.setItem("catName", "Muebles");
    window.location = "products.html";
  });
  let intervalo = false;
  const carruselProduct = document.getElementById("carruselProducto");

  function crearCarrusel() {
    for (let i = 1; i <= 4; i++) {
      const nuevaImagen = document.createElement("img");
      nuevaImagen.id = `banner-${i}`;
      nuevaImagen.classList.add("banner");
      nuevaImagen.classList.add("card-img-top");
      nuevaImagen.src = `/img/banners/banner_sales${i}.jpg`;
      carruselProduct.appendChild(nuevaImagen);
    }
  }
  let bannerActivo;
  function cambiarImagenCarrusel() {
    let imagenActual = 1; // Inicialmente, muestra la primera imagen
    return function () {
      bannerActivo = document.getElementById(`banner-${imagenActual}`);
      // Incrementa las imagenes y al llegar a la última regresa a la 1ra
      imagenActual++;
      bannerActivo.classList.add("banner-active");
      if (imagenActual > 4) {
        imagenActual = 1;
      }
    };
  }
  crearCarrusel();
  // Crea una función para cambiar la imagen

  const cambiarImagen = cambiarImagenCarrusel();

  // Intervalo para cambiar automáticamente la imagen cada 3.5 segundos
  if (!intervalo) {
    cambiarImagen();
    intervalo = true;
  }

  setInterval(() => {
    bannerActivo.classList.remove("banner-active");
    cambiarImagen();
  }, 3500);
});
