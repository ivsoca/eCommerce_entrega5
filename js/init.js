//Constantes de la api y el .json
const BASE_URL = "https://japceibal.github.io/emercado-api/";
const EXT_TYPE = ".json";

//Spinner de carga
const showSpinner = () => {
  document.getElementById("spinner-wrapper").style.display = "block";
};

//Spinner de carga oculto
const hideSpinner = () => {
  document.getElementById("spinner-wrapper").style.display = "none";
};

//Obtener los productos y categorias del json
const getJSONData = async (url) => {
  const result = { status: "ok", data: null };
  

  //Se hace un fetch que hace un pedido de informacion
  try {
    const response = await fetch(url);

    //Revisar si se encontro o no
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    //Se fija si lo anterior se encontró y si no actualiza los productos (muestra todos)
    result.data = await response.json();
  } catch (error) {
    result.status = "error";
    result.data = error;
  }

  return result;
};

//Traer las categorias del json
const CATEGORIES_URL = `${BASE_URL}cats/cat${EXT_TYPE}`;
getJSONData(CATEGORIES_URL)
  .then((categoriesData) => {
    console.log(categoriesData);
  })
  .catch((error) => {
    console.error("Error al obtener datos de categorías:", error);
  });

//Traer los productos del json
const PUBLISH_PRODUCT_URL = `${BASE_URL}sell/publish${EXT_TYPE}`;
getJSONData(PUBLISH_PRODUCT_URL)
  .then((publishProductData) => {
    console.log(publishProductData);
  })
  .catch((error) => {
    console.error("Error al obtener datos de publicación de productos:", error);
  });


  /*
  Esta funcion la hice porque necesitaba una forma de mostrar 3 productos recomendados en la parte de abajo de una pagina y me parecio util
  tenerla acá para futuros usos. Lo que hace es que agarra un sourceArray que seguramente tenga varios datos y agrega
  datos aleatorios de ese array a un nuevo array (en el caso original vacio pero puede tener items previos).
  placeholderArray se crea en la funcion y es una copia del sourceArray, la diferencia es que se le quitan los items ya seleccionados
  para evitar que aparezcan dos veces, así no afecta el sourceArray en caso de que se vaya a usar dsp para otra cosa
  */
  function agregarAlArraySiExiste(sourceArray, newArray, maxElements){
    if (sourceArray.length>0){
      let placeholderArray = [...sourceArray];
      for(let i=0; i<maxElements && i<sourceArray.length; i++){
        let randomNumber = Math.floor(Math.random()*placeholderArray.length);
        newArray.push(placeholderArray[randomNumber]);
        placeholderArray.splice(randomNumber, 1);
      }

      
    }
  }
