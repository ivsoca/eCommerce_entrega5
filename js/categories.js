//Criterios para ordenar
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = ORDER_ASC_BY_NAME;
let minCount = undefined;
let maxCount = undefined;

//ordena el array segun el criterio de orden que le damos y compara entre las categorias segun el criterio que le dimos
function sortCategories(criteria, array) {
  return array.sort((a, b) => {
    if (criteria === ORDER_ASC_BY_NAME) {
      return a.name.localeCompare(b.name);
    } else if (criteria === ORDER_DESC_BY_NAME) {
      return b.name.localeCompare(a.name);
    } else if (criteria === ORDER_BY_PROD_COUNT) {
      return parseInt(b.productCount) - parseInt(a.productCount);
    }
  });
}

//se guarda el id y el catName de la categoria en el localStorage y luego redirecciona a la pagina de la categoria
function setCatID(id, name) {
  localStorage.setItem("catID", id);
  localStorage.setItem("catName", name);
  window.location = "products.html";
}

//Llena el array con los productos filtrados segun minimo y maximo de precio utilizando filter para filtrar y map para crear el html
function showCategoriesList() {
  const htmlContentToAppend = currentCategoriesArray
    .filter(
      (category) =>
        (minCount === undefined ||
          parseInt(category.productCount) >= minCount) &&
        (maxCount === undefined || parseInt(category.productCount) <= maxCount)
    )
    .map(
      (category) => `
      <div onclick="setCatID(${category.id},'${category.name}')" class="product-item list-product-item">
        <img src="${category.imgSrc}" alt="${category.description}">
        <h2 class="encabezado">${category.name}</h2>
        <div class="product-gradient"></div>
        <p class="precio-producto"></p>
        <p class="descripcion-producto box-descripcion">${category.description}</p>
        <button class="boton-producto box-botonpr">Ir</button>
        <small class="text-muted cant-articulos">${category.productCount} artículos</small>
      </div>
    `
    )
    .join("");

  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

//
function sortAndShowCategories(sortCriteria) {
  currentSortCriteria = sortCriteria;
  currentCategoriesArray = sortCategories(
    currentSortCriteria,
    currentCategoriesArray
  );
  showCategoriesList();
}

//Se carga el documento html, se obtienen los datos del json y los muestra, y luego segun los filtros que se utilicen se van activando los addEventListenner
document.addEventListener("DOMContentLoaded", function () {
  getJSONData(CATEGORIES_URL).then((resultObj) => {
    if (resultObj.status === "ok") {
      currentCategoriesArray = resultObj.data;
      showCategoriesList();
      sortAndShowCategories(ORDER_ASC_BY_NAME);
    }
  });

  document
    .getElementById("orden-alfabetico")
    .addEventListener("click", () => sortAndShowCategories(ORDER_ASC_BY_NAME));
  document
    .getElementById("orden-alfabetico-inv")
    .addEventListener("click", () => sortAndShowCategories(ORDER_DESC_BY_NAME));
  document
    .getElementById("sortByCount")
    .addEventListener("click", () =>
      sortAndShowCategories(ORDER_BY_PROD_COUNT)
    );
  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    minCount = undefined;
    maxCount = undefined;
    showCategoriesList();
  });
  document.getElementById("rangeFilterCount").addEventListener("click", () => {
    minCount =
      parseInt(document.getElementById("rangeFilterCountMin").value) ||
      undefined;
    maxCount =
      parseInt(document.getElementById("rangeFilterCountMax").value) ||
      undefined;
    showCategoriesList();
  });
});

//Busqueda en tiempo real de titulo o descripcion
document.addEventListener("keyup", (e) => {
  if (e.target.matches("#busqueda-input")) {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll(".list-product-item").forEach((articulo) => {
      const articuloText = articulo.textContent.toLowerCase();
      articulo.classList.toggle("filtro", !articuloText.includes(searchTerm));
    });
  }
});
