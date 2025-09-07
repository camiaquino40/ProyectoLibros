const BASE_URL = 'https://68acdebbb996fea1c08b1420.mockapi.io/librosAdmin';
const api = axios.create({ baseURL: BASE_URL });

const form = document.getElementById("formLibro");
const tabla = document.getElementById("tablaLibros").querySelector("tbody");
const mensajeError = document.getElementById("mensajeError");

// Obtener todos los libros
async function obtenerLibros() {
  try {
    const respuesta = await api.get('/');
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener libros", error);
    return [];
  }
}

// Renderizar tabla de admin
async function renderizarTabla() {
  const libros = await obtenerLibros();
  tabla.innerHTML = "";

  libros.forEach(libro => {
    tabla.innerHTML += `
      <tr>
        <td><img src="${libro.imagen}" alt="${libro.titulo}" width="50"></td>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.anio}</td>
        <td>${libro.genero}</td>
        <td>
          <button class="btn-editar" onclick="editarLibro(${libro.id})">✏️</button>
          <button class="btn-eliminar" onclick="eliminarLibro(${libro.id})">
            <img src="../img/trash.png" width="30" height="30" alt="Eliminar" title="Eliminar">
          </button>
        </td>
      </tr>
    `;
  });
}

// Mostrar error temporal
function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.style.display = "block";
  setTimeout(() => {
    mensajeError.style.display = "none";
  }, 3000);
}

// Crear nuevo libro
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoLibro = {
    titulo: document.getElementById("titulo").value.trim(),
    autor: document.getElementById("autor").value.trim(),
    anio: parseInt(document.getElementById("anio").value),
    genero: document.getElementById("genero").value,
    imagen: document.getElementById("imagen").value.trim(), // ahora solo URL
    link: document.getElementById("link").value.trim()
  };

  // Validar URL de Goodreads
  const esURLValida = /^https:\/\/(www\.)?goodreads\.com\/book\/show\/\d+(-[\w\d\.\-%]+)?/i.test(nuevoLibro.link);
  if (!esURLValida) {
    mostrarError("Ingrese una URL de Goodreads válida.");
    return;
  }

  // Validar URL de imagen
  const esImagenValida = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)$/i.test(nuevoLibro.imagen);
  if (!esImagenValida) {
    mostrarError("Ingrese una URL de imagen válida (jpg, jpeg, png, gif).");
    return;
  }

  try {
    await api.post('/', nuevoLibro);
    form.reset();
    renderizarTabla();
  } catch (error) {
    console.error("Error al agregar libro", error);
    mostrarError("No se pudo agregar el libro.");
  }
});

// Eliminar libro
async function eliminarLibro(id) {
  try {
    await api.delete(`/${id}`);
    renderizarTabla();
  } catch (error) {
    console.error("Error al eliminar libro", error);
    mostrarError("No se pudo eliminar el libro.");
  }
}

// Editar libro (llena formulario con datos actuales y hace PUT)
async function editarLibro(id) {
  try {
    const respuesta = await api.get(`/${id}`);
    const libro = respuesta.data;

    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("anio").value = libro.anio;
    document.getElementById("genero").value = libro.genero;
    document.getElementById("imagen").value = libro.imagen;
    document.getElementById("link").value = libro.link;

    // Cambiar submit para actualizar
    form.onsubmit = async (e) => {
      e.preventDefault();
      const libroActualizado = {
        titulo: document.getElementById("titulo").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        anio: parseInt(document.getElementById("anio").value),
        genero: document.getElementById("genero").value,
        imagen: document.getElementById("imagen").value.trim(),
        link: document.getElementById("link").value.trim()
      };
      await api.put(`/${id}`, libroActualizado);
      form.reset();
      renderizarTabla();

      // Restaurar submit normal
      form.onsubmit = null;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // aquí iría la lógica de crear nuevo libro
      });
    };

  } catch (error) {
    console.error("Error al cargar libro para editar", error);
    mostrarError("No se pudo cargar el libro para editar.");
  }
}

// Inicializar tabla
window.addEventListener("DOMContentLoaded", renderizarTabla);
