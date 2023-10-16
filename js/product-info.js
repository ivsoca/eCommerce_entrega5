//Se genera un EventListenner para que al seleccionar la card haga varias funciones.
const cargarInfoProducto = (product, productCategoryName) => {
  //Se crean constantes para traer los elementos por su id del html
  const nombreProduct = document.getElementById("nombreProduct");
  const precioProduct = document.getElementById("precioProducto");
  const descripcionProducto = document.getElementById("descripcionProducto");
  const categoriaProducto = document.getElementById("categoriaProducto");
  const cantidadProducto = document.getElementById("cantidadProducto");
  const carruselProduct = document.getElementById("carruselProducto");

  //Pone la info del producto en el lugar correcto del html para verlos
  document.create;
  const nombreProductText = document.createTextNode(product.name);
  const precioProductText = document.createTextNode(
    product.cost + " " + product.currency
  );
  const descripcionProductoText = document.createTextNode(product.description);
  const categoriaProductoText = document.createTextNode(productCategoryName);
  const cantidadProductoText = document.createTextNode(product.soldCount);
  nombreProduct.appendChild(nombreProductText);
  precioProduct.appendChild(precioProductText);
  descripcionProducto.appendChild(descripcionProductoText);
  categoriaProducto.appendChild(categoriaProductoText);
  cantidadProducto.appendChild(cantidadProductoText);

  //Muestra las imagenes relacionadas con el producto (son 4 imagenes por producto por eso i=1; i<5)
  // Función para cambiar la imagen actual del carrusel
  // let intervalo = false;

  // function cambiarImagenCarrusel() {
  //   let imagenActual = 1; // Inicialmente, muestra la primera imagen

  //   return function () {
  //     // Elimina todas las imágenes actuales del carrusel
  //     carruselProduct.innerHTML = "";

  //     // Crea una nueva imagen y la agrega al carrusel
  //     const nuevaImagen = document.createElement("img");
  //     nuevaImagen.classList.add("image-producto");
  //     nuevaImagen.classList.add("card-img-top");
  //     nuevaImagen.src = `./img/prod${product.id}_${imagenActual}.jpg`;
  //     carruselProduct.appendChild(nuevaImagen);

  //     // Incrementa las imagenes y al llegar a la última regresa a la 1ra
  //     imagenActual++;
  //     if (imagenActual > 4) {
  //       imagenActual = 1;
  //     }
  //   };
  // }

  // // Crea una función para cambiar la imagen

  // const cambiarImagen = cambiarImagenCarrusel();

  // // Intervalo para cambiar automáticamente la imagen cada 3.5 segundos
  // if (!intervalo) {
  //   cambiarImagen();
  //   intervalo = true;
  // }

  // setInterval(() => {
  //   cambiarImagen();
  // }, 3500);
};

//Carrusel-slide

// const carouselInner = document.querySelector('.carousel-inner');

// data.forEach((item, index) => {
//   const carouselItem = document.createElement('div');
//   carouselItem.classList.add('carousel-item');
//   if (index === 0) {
//     carouselItem.classList.add('active');
//   }

//   const img = document.createElement('img');
//   img.src =  item.url; // Asigna la URL de la imagen desde los datos de la API
//   img.classList.add('d-block', 'w-100');
//   img.alt = '...'; // Puedes asignar una descripción alternativa aquí si es necesario

//   carouselItem.appendChild(img);
//   carouselInner.appendChild(carouselItem);
// });

const cargarComentariosProducto = async (product) => {
  if (!product.id) return console.error("the product doesn't have an id");
  const baseCommentUrl = `https://raw.githubusercontent.com/JaPCeibal/emercado-api/main/products_comments/${product.id}.json`;
  const response = await fetch(baseCommentUrl);
  if (!response.ok)
    return console.error("Something went wrong when retrieving the comments");
  const comments = await response.json();

  comments.forEach((comment) => {
    const divComment = document.createElement("div");
    divComment.classList.add("wrapper-comentario");
    divComment.classList.add("fondo-modo-oscuro");

    const comentarioHeader = document.createElement("p");
    comentarioHeader.classList.add("headerComentario");

    divComment.appendChild(comentarioHeader);

    const user = document.createElement("span");
    user.classList.add("user-comentario");

    const dateTime = document.createElement("span");
    dateTime.classList.add("date-time");

    const description = document.createElement("span");
    const userText = document.createTextNode(comment.user);
    const dateTimeText = document.createTextNode(comment.dateTime);
    const descriptionText = document.createTextNode(comment.description);
    const scoreStar = document.createElement("span");

    //Agregue barras para la separacion del user con las flechas y las estrellas
    //Barra1
    // const BarraSeparacion = document.createElement("span");
    // BarraSeparacion.innerHTML = " - "
    // dateTime.appendChild(BarraSeparacion);

    //Barra2
    const BarraSeparacion2 = document.createElement("span");
    BarraSeparacion2.innerHTML = " ";
    scoreStar.appendChild(BarraSeparacion2);

    //Logica para que aparezcan las estrellas
    for (let i = 0; i < 5; i++) {
      if (i < comment.score) {
        const scoreStarText = document.createElement("span");
        scoreStarText.innerHTML = "&#9733";
        scoreStarText.innerHTML = "&#9733";
        scoreStarText.classList.add("star-comment");
        scoreStar.appendChild(scoreStarText);
      } else {
        const scoreStarText = document.createElement("span");
        scoreStarText.innerHTML = "&#9734";
        scoreStarText.classList.add("star-comment");
        scoreStar.appendChild(scoreStarText);
      }
    }

    user.appendChild(userText);
    dateTime.appendChild(dateTimeText);
    description.appendChild(descriptionText);

    comentarioHeader.appendChild(user);
    comentarioHeader.appendChild(scoreStar);
    comentarioHeader.appendChild(dateTime);

    divComment.appendChild(descriptionText);

    document.getElementById("comentarios").appendChild(divComment);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  //Se crean const que traen info del localStorage(producto que se clickeo y su nombre de categoria)
  const product = JSON.parse(localStorage.getItem("productoClickeado"));
  const productCategoryName = localStorage.getItem("catName");
  let catURL = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem(
    "catID"
  )}.json`; //json con productos de la misma categoria
  let catData = await getJSONData(catURL);
  let productURL = `https://japceibal.github.io/emercado-api/products/${product.id}.json`;
  let productfetch = await getJSONData(productURL);
  let relatedProductsDiv = document.getElementById("productosSimilares");
  let agregarButton = document.getElementById("agregarAlCarritoButton");

  //Carrusel-slide, logica para que el carrusel con las flechas funcione
  let imgCarousel = document.getElementsByClassName("carouselimg");

  for (let i = 0; i < imgCarousel.length; i++) {
    imgCarousel[i].src = `./img/prod${product.id}_${i + 1}.jpg`;
  }

  //bloque para sacar el producto clickeado de productos relacionados para que no se vea dos veces
  let productsMenosElActual = [];
  catData.data.products.forEach((element) => {
    if (element.id !== product.id) {
      productsMenosElActual.push(element);
    }
  });
  // console.log(productsMenosElActual);
  //fin del bloque

  cargarInfoProducto(product, productCategoryName);
  await cargarComentariosProducto(product);

  //hago un fetch similar a el de products.js para conseguir los elementos relacionados

  let showProducts = [...productfetch.data.relatedProducts]; //array de 2 productos relacionados
  console.log(productfetch.data.relatedProducts);
  console.log(showProducts);

  //function en init

  if (showProducts == []) {
    console.log("No hay productos relacionados");
  } else {
    console.log(showProducts);
    showProducts.forEach((element) => {
      let colmd = document.createElement("div");
      colmd.classList.add("col-md-6");

      let productoRelacionado = document.createElement("div");
      productoRelacionado.classList.add("card");
      productoRelacionado.classList.add("related-product");

      let productBody = document.createElement("div");
      productBody.classList.add("card-body");

      let productImg = document.createElement("img");
      productImg.src = element.image;
      productImg.className = "card-img-top";

      let productName = document.createElement("h5");
      productName.classList.add("card-title");
      productName.classList.add("texto-modo-oscuro");
      productName.textContent = element.name;
      productBody.appendChild(productName);

      let productDescription = document.createElement("p");
      productDescription.classList.add("card-text");
      productDescription.textContent = element.description;
      productBody.appendChild(productDescription);

      productoRelacionado.appendChild(productImg);
      productoRelacionado.appendChild(productBody);
      colmd.appendChild(productoRelacionado);
      relatedProductsDiv.appendChild(colmd);

      productoRelacionado.addEventListener("click", async () => {
        productObject = await getJSONData(
          `https://japceibal.github.io/emercado-api/products/${element.id}.json`
        );
        console.log(productObject);
        localStorage.setItem(
          "productoClickeado",
          JSON.stringify(await productObject.data)
        );
        window.location.href = "product-info.html";
      });
    });
  }

  //acá agrega el producto comprado al localstorage
  agregarButton.addEventListener("click", async () => {
    let productosCarrito =
      JSON.parse(localStorage.getItem("productosCarrito")) || {};
    const productId = product.id;
    productosCarrito = { ...productosCarrito, [productId]: product };
    console.log(productosCarrito, product);
    localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
  });
});
