const BASE_URL = "https://68acdebbb996fea1c08b1420.mockapi.io/librosAdmin";
const api = axios.create({ baseURL: BASE_URL });

const form = document.getElementById("formLibro");
const tabla = document.getElementById("tablaLibros").querySelector("tbody");
const mensajeError = document.getElementById("mensajeError");

// obtener todos los libros
async function obtenerLibros() {
  try {
    const respuesta = await api.get("/");
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener libros", error);
    return [];
  }
}

// renderizar tabla de admin
async function renderizarTabla() {
  const libros = await obtenerLibros();
  tabla.innerHTML = "";

  libros.forEach((libro) => {
    tabla.innerHTML += `
      <tr>
        <td><img src="${libro.imagen}" alt="${libro.titulo}" width="50"></td>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.anio}</td>
        <td>${libro.genero}</td>
        <td>
          <button class="btn-editar" onclick="editarLibro(${libro.id})">
          <img src="../img/edit.png" alt="Editar" title="Editar">
          </button>
          <button class="btn-eliminar" onclick="eliminarLibro(${libro.id})">
            <img src="../img/trash.png" width="30" height="30" alt="Eliminar" title="Eliminar">
          </button>
        </td>
      </tr>
    `;
  });
}

// mostrar error temporal
function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.style.display = "block";
  setTimeout(() => {
    mensajeError.style.display = "none";
  }, 3000);
}

// crear nuevo libro
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoLibro = {
    titulo: document.getElementById("titulo").value.trim(),
    autor: document.getElementById("autor").value.trim(),
    anio: parseInt(document.getElementById("anio").value),
    genero: document.getElementById("genero").value,
    imagen: document.getElementById("imagen").value.trim(),
    link: document.getElementById("link").value.trim(),
  };

  // validar url de goodreads
  const esURLValida =
    /^https:\/\/(www\.)?goodreads\.com\/book\/show\/\d+(-[\w\d\.\-%]+)?/i.test(
      nuevoLibro.link
    );
  if (!esURLValida) {
    mostrarError("Ingrese una URL de Goodreads válida.");
    return;
  }

  // verificar si ya existe un libro con ese link 
  try {
    const respuesta = await api.get("/");
    const librosExistentes = respuesta.data;

    const linkRepetido = librosExistentes.some(
      (libro) => libro.link === nuevoLibro.link
    );
    if (linkRepetido) {
      mostrarError("Este libro ya fue agregado.");
      return;
    }
  } catch (error) {
    console.error("Error al validar link", error);
    mostrarError("No se pudo validar el link.");
    return;
  }

  // validar url de imagen
  const esImagenValida =
    /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)$/i.test(
      nuevoLibro.imagen
    );
  if (!esImagenValida) {
    mostrarError("Ingrese una URL de imagen válida (jpg, jpeg, png, gif).");
    return;
  }

  try {
    await api.post("/", nuevoLibro);
    form.reset();
    renderizarTabla();
  } catch (error) {
    console.error("Error al agregar libro", error);
    mostrarError("No se pudo agregar el libro.");
  }
});

//eliminar libro
async function eliminarLibro(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esto",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#a2c7c0",
    cancelButtonColor: "#d6a4a4",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.delete(`/${id}`);
        renderizarTabla();
        Swal.fire("Eliminado", "El libro ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar libro", error);
        mostrarError("No se pudo eliminar el libro.");
      }
    }
  });
}

//editar libro
async function editarLibro(id) {
  try {
    const libro = await api.get(`/${id}`);
    const datos = libro.data;

    const { value: valores } = await Swal.fire({
      title: "Editar libro",
      html: `
          <input id="swal-titulo" class="swal2-input" placeholder="Título" value="${
            datos.titulo
          }">
          <input id="swal-autor" class="swal2-input" placeholder="Autor" value="${
            datos.autor
          }">
          <input id="swal-anio" type="number" class="swal2-input" placeholder="Año" value="${
            datos.anio
          }">
          
          <select id="swal-genero" class="swal2-input swal2-select">
            <option value="Fantasía" ${
              datos.genero === "Fantasía" ? "selected" : ""
            }>Fantasía</option>
            <option value="Romance" ${
              datos.genero === "Romance" ? "selected" : ""
            }>Romance</option>
            <option value="Ciencia Ficción" ${
              datos.genero === "Ciencia Ficción" ? "selected" : ""
            }>Ciencia Ficción</option>
            <option value="Terror" ${
              datos.genero === "Terror" ? "selected" : ""
            }>Terror</option>
            <option value="Misterio" ${
              datos.genero === "Misterio" ? "selected" : ""
            }>Misterio</option>
            <option value="No Ficción" ${
              datos.genero === "No Ficción" ? "selected" : ""
            }>No Ficción</option>
          </select>
  
          <input id="swal-imagen" class="swal2-input" placeholder="URL de imagen" value="${
            datos.imagen
          }">
          <input id="swal-link" class="swal2-input" placeholder="Goodreads" value="${
            datos.link
          }">
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#a2c7c0",
      cancelButtonColor: "#d6a4a4",
      preConfirm: async () => {
        const titulo = document.getElementById("swal-titulo").value.trim();
        const autor = document.getElementById("swal-autor").value.trim();
        const anio = parseInt(document.getElementById("swal-anio").value);
        const genero = document.getElementById("swal-genero").value;
        const imagen = document.getElementById("swal-imagen").value.trim();
        const link = document.getElementById("swal-link").value.trim();

        // validar link de Goodreads
        const esURLValida =
          /^https:\/\/(www\.)?goodreads\.com\/book\/show\/\d+(-[\w\d\.\-%]+)?/i.test(
            link
          );
        if (!esURLValida) {
          Swal.showValidationMessage("Ingrese una URL de Goodreads válida.");
          return false;
        }

        // validar que no esté repetido el link en otro libro
        const librosExistentes = await obtenerLibros();
        const linkRepetido = librosExistentes.some(
          (libro) => libro.link === link && libro.id != id
        );
        if (linkRepetido) {
          Swal.showValidationMessage(
            "Ya existe un libro con ese link de Goodreads."
          );
          return false;
        }

        // validar URL de imagen
        const esImagenValida =
          /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/i.test(imagen);
        if (!esImagenValida) {
          Swal.showValidationMessage(
            "Ingrese una URL de imagen válida (jpg, png, gif, webp)."
          );
          return false;
        }

        return { titulo, autor, anio, genero, imagen, link };
      },
    });

    if (valores) {
      await api.put(`/${id}`, valores);
      renderizarTabla();
      Swal.fire("Guardado", "Los cambios fueron aplicados.", "success");
    }
  } catch (error) {
    console.error("Error al editar libro", error);
    mostrarError("No se pudo editar el libro.");
  }
}

// inicializar tabla
window.addEventListener("DOMContentLoaded", renderizarTabla);
