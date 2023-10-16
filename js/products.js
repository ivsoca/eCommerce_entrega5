document.addEventListener("DOMContentLoaded", function () {


  
  const url = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem(
    "catID"
  )}.json`;
  const productList = document.querySelector("#product-list");
  const spanproducts = document.getElementById("categoria-producto");

  //* Obtener articulos
  function obtenerArticulos(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al hacer la solicitud.");
        }
        return response.json();
      })
      .then((data) => {
        const products = data.products;
        spanproducts.innerText = data.catName;
        mostrarArticulos(products);
        let stringproducts = JSON.stringify(products)
        sessionStorage.setItem("productsArray", stringproducts)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  obtenerArticulos(url); //Muestra inicial

  //* Actualizar articulos en busqueda, orden y filtro. Ya no usa fetch.
  function actualizarArticulos() {
    eliminarArticulos();
    mostrarArticulos(JSON.parse(sessionStorage.getItem("productsArray")));
  }
  // Busqueda
  document.getElementById("busqueda-input").addEventListener("keyup", () => {
    debounce(()=>{actualizarArticulos();
    }, 50);
  });
  // Orden
  document.getElementById("orden-productos").addEventListener("mouseup", () => {
    debounce(()=>{actualizarArticulos();
    }, 50);
  });
  // Filtro
  document.getElementById("filtro-precio-btn").addEventListener("click", () => {
    debounce(()=>{actualizarArticulos();
    }, 50);
  });

  //* Mostrar articulos
   function mostrarArticulos(prodArr) {
    ordenarArticulos(prodArr);
    let filteredProdArr = filtrarArticulos(prodArr);

    filteredProdArr.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");
      //Al hacer click en un producto, guarda los datos del json en el localStorage pero en strings Luego se redirige al usuario a product-info.html
      productItem.addEventListener("click", () => {
        localStorage.setItem("productoClickeado", JSON.stringify(product));
        window.location = "product-info.html";
      });
      productItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2 class="encabezado" title="${product.name}">${product.name}</h2>
          <div class="product-gradient"></div>
          <p class="precio-producto">$${product.cost} ${product.currency}</p>
          <p class="descripcion-producto">${product.description}</p>
          <button class="boton-producto" data-id="${product.id}">Comprar</button>
          <p class="vendidos-producto">Vendidos: ${product.soldCount}</p>
          `;

      productList.appendChild(productItem);
    });
  }

  //* Eliminar articulos viejos
  function eliminarArticulos() {
    document.getElementById("product-list").innerHTML = "";
  }

  //* Ordenar articulos
  const ordenAlfabetico = document.getElementById("orden-alfabetico");
  const ordenAlfabeticoInverso = document.getElementById(
    "orden-alfabetico-inv"
  );
  const ordenPrecio = document.getElementById("orden-precio");
  const ordenPrecioInverso = document.getElementById("orden-precio-inv");
  const ordenMasVendidos = document.getElementById("orden-vendidos");

  function ordenarArticulos(prodArr) {
    switch (true) {
      case ordenAlfabeticoInverso.checked:
        ordenarArticulosAlfaInv(prodArr);
        break;
      case ordenPrecio.checked:
        ordenarArticulosPrecio(prodArr);
        break;
      case ordenPrecioInverso.checked:
        ordenarArticulosPrecioInv(prodArr);
        break;
      case ordenMasVendidos.checked:
        ordenarArticulosVendido(prodArr);
        break;
      default:
        ordenarArticulosAlfa(prodArr);
        break;
    }
  }
  function ordenarArticulosAlfa(prodArr) {
    return prodArr.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
  function ordenarArticulosAlfaInv(prodArr) {
    return prodArr.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return 1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  }
  function ordenarArticulosPrecio(prodArr) {
    return prodArr.sort((a, b) => {
      if (a.cost < b.cost) {
        return 1;
      }
      if (a.cost > b.cost) {
        return -1;
      }
      return 0;
    });
  }
  function ordenarArticulosPrecioInv(prodArr) {
    return prodArr.sort((a, b) => {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  }
  function ordenarArticulosVendido(prodArr) {
    return prodArr.sort((a, b) => {
      if (a.soldCount < b.soldCount) {
        return 1;
      }
      if (a.soldCount > b.soldCount) {
        return -1;
      }
      return 0;
    });
  }

  //* Filtrar articulos
  function filtrarArticulos(prodArr) {
    const filtroBusqueda = filtrarArticulosBusqueda(prodArr);
    const filtroPrecio = filtrarArticulosPrecio(filtroBusqueda);
    return filtroPrecio;
  }
  // Por busqueda
  function filtrarArticulosBusqueda(prodArr) {
    const busquedaElemento = document.getElementById("busqueda-input");
    const regex = new RegExp(busquedaElemento.value, "gi");
    let prodArrFiltrado = prodArr.filter((product) => {
      return regex.test(product.name) || regex.test(product.description);
    });
    return prodArrFiltrado;
  }
  // Por precio
  function filtrarArticulosPrecio(prodArr) {
    const precioMinimo = document.getElementById("filtro-precio-min").value;
    const precioMaximo = document.getElementById("filtro-precio-max").value;
    let prodArrFiltrado = [];

    // Devuelve el array original si no se puso nada en uno de los campos
    if (precioMinimo === "" && precioMaximo === "") {
      return prodArr;
    }

    // Si se ingresó precio minimo y maximo
    if (precioMinimo !== "" && precioMaximo !== "") {
      prodArrFiltrado = prodArr.filter((product) => {
        if (product.cost >= precioMinimo && product.cost <= precioMaximo) {
          return true;
        }
        return false;
      });
    }

    // Si solo hay precio minimo
    if (precioMinimo !== "" && precioMaximo === "") {
      prodArrFiltrado = prodArr.filter((product) => {
        if (product.cost >= precioMinimo) {
          return true;
        }
        return false;
      });
    }

    // Si solo hay precio máximo
    if (precioMaximo !== "" && precioMinimo === "") {
      prodArrFiltrado = prodArr.filter((product) => {
        if (product.cost <= precioMaximo) {
          return true;
        }
        return false;
      });
    }

    return prodArrFiltrado;
  }

  /*Básicamete lo que hace es añadir un delay a la función que se elija en el parámetro func
   porque hay algún evento que es asincrónico o que no espera para ser ejecutado en algún lado del 
   código. Yo lo uso para actualizar el array de productos. Sin está funcion la actualización
   se atrasa y causa que esté un input atrás. Es decir, si clickeas A-Z no pasa nada, pero si luego
   clickeas otra cosa se aplica A-Z*/

   //TODO: probar con internet de la feria para ver si 50ms es suficiente


  let debounceTimeout;

  function debounce(func, delay) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
  }
});

/*document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("busqueda-input");
  const botonBorrar = document.getElementById("borrar-filtros-btn");

  //TODO arreglar Uncaught Error
  botonBorrar.addEventListener("click", () => {
    input.value = ""; // Borra el contenido del campo de búsqueda
  });
});*/

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".boton-producto");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // Obtén el id del producto desde el atributo data-id
      const productId = button.getAttribute("data-id");

      // Redirige a la página "product-info.html" con el id del producto como parámetro
      window.location.href = `product-info.html?id=${productId}`;
    });
  });
});
