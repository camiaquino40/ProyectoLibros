const BASE_URL = 'https://68acdebbb996fea1c08b1420.mockapi.io';
const api = axios.create({ baseURL: BASE_URL });

const contenedorFijos = document.getElementById("librosFijos");
const contenedorRecomendaciones = document.getElementById("recomendaciones");
const filtroGenero = document.getElementById("filtroGenero");

// obtener libros fijos
async function obtenerLibrosFijos() {
  try {
    const respuesta = await api.get('/librosFijos');
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener libros fijos", error);
    return [];
  }
}

// obtener recomendaciones
async function obtenerRecomendaciones() {
  try {
    const respuesta = await api.get('/librosAdmin');
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener recomendaciones", error);
    return [];
  }
}

// renderizar libros fijos
function renderizarLibrosFijos(libros) {
  contenedorFijos.innerHTML = '';
  libros.forEach(libro => {
    contenedorFijos.innerHTML += `
      <div class="libro">
        <img src="${libro.imagen}" alt="${libro.titulo}">
        <h3>${libro.titulo}</h3>
        <p>${libro.autor} (${libro.anio})</p>
        <p><strong>${libro.genero}</strong></p>
        ${libro.link ? `<a href="${libro.link}" target="_blank" class="btn-link">Ver en Goodreads</a>` : ""}
      </div>
    `;
  });
}

// renderizar recomendaciones
function renderizarRecomendaciones(libros) {
  contenedorRecomendaciones.innerHTML = '';

  if (libros.length === 0) {
    contenedorRecomendaciones.innerHTML = '<p>No hay recomendaciones para mostrar.</p>';
    return;
  }

  libros.forEach(libro => {
    contenedorRecomendaciones.innerHTML += `
      <div class="libro">
        <img src="${libro.imagen}" alt="${libro.titulo}">
        <h3>${libro.titulo}</h3>
        <p>${libro.autor} (${libro.anio})</p>
        <p><strong>${libro.genero}</strong></p>
        ${libro.link ? `<a href="${libro.link}" target="_blank" class="btn-link">Ver en Goodreads</a>` : ""}
      </div>
    `;
  });
}

// refrescar recomendaciones con filtro
async function refrescarRecomendaciones() {
  let libros = await obtenerRecomendaciones();
  const generoSeleccionado = filtroGenero.value;

  if (generoSeleccionado !== 'todos') {
    libros = libros.filter(libro => libro.genero === generoSeleccionado);
  }

  renderizarRecomendaciones(libros);
}

// inicializar pagina
window.addEventListener("DOMContentLoaded", async () => {
  const fijos = await obtenerLibrosFijos();
  renderizarLibrosFijos(fijos);
  refrescarRecomendaciones();
});

// escuchar filtro
filtroGenero.addEventListener('change', refrescarRecomendaciones);
