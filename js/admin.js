let libros = JSON.parse(localStorage.getItem("libros")) || [];

const form = document.getElementById("formLibro");
const tabla = document.getElementById("tablaLibros").querySelector("tbody");


function renderizarTabla() {
  tabla.innerHTML = "";
  libros.forEach((libro, index) => {
    tabla.innerHTML += `
      <tr>
      <td><img src="${libro.imagen}" alt="${libro.titulo}"></td>
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.anio}</td>
      <td>${libro.genero}</td>
      <td>
  <button class="btn-eliminar" onclick="eliminarLibro(${index})">
    <img src="../img/trash.png" width="30px" height="30px" alt="Eliminar" title="Eliminar" />
  </button>
</td>
      </tr>
    `;
  });
}

function mostrarError(mensaje) {
  const errorDiv = document.getElementById("mensajeError");  // mostrar un mensaje de error en vez de la alerta fea
  errorDiv.textContent = mensaje;
  errorDiv.style.display = "block";

  
  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 3000);
}

function guardarEnStorage() {
  localStorage.setItem("libros", JSON.stringify(libros));
}

function eliminarLibro(index) {
    libros.splice(index, 1);
    guardarEnStorage();
    renderizarTabla();
  }

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const archivo = document.getElementById("imagen").files[0]; // agarro el primer archivo de imagen que el usuario eligió en el input
  const reader = new FileReader(); // creo lector para leer el contenido del archivo
  const link = document.getElementById("link").value.trim();

  if (archivo) {
    reader.readAsDataURL(archivo); // si el usuario cargó una imagen, la leo como texto
  }
  
  // Validar URL de Goodreads
  const esURLValida = /^https:\/\/(www\.)?goodreads\.com\/book\/show\/\d+(-[\w\d\.\-%]+)?/i.test(link);
  if (!esURLValida) {
    mostrarError("Ingrese una URL de Goodreads válida.");
    return;
  }

  // Verificar si ya existe un libro con ese link
  const linkRepetido = libros.some(libro => libro.link === link && link !== "");
  if (linkRepetido) {
    mostrarError("Este libro ya fue agregado.");
    return;
  }
  
  // cuando termina de leer la imagen, se ejecuta esta función
  reader.onload = function () {
    const nuevoLibro = {
      titulo: document.getElementById("titulo").value.trim(),
      autor: document.getElementById("autor").value.trim(),
      anio: parseInt(document.getElementById("anio").value),
      imagen: reader.result, // la imagen convertida a texto
      genero: document.getElementById("genero").value,
      link: link
    };

    libros.push(nuevoLibro);
    guardarEnStorage();
    renderizarTabla();
    form.reset();
  };
  
});

window.addEventListener("DOMContentLoaded", renderizarTabla);
