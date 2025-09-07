const librosFijos = [
  {
    titulo: "1984",
    autor: "George Orwell",
    anio: 1949,
    genero: "Distopía",
    imagen: "../img/1984.jpg",
    link: "https://www.goodreads.com/book/show/61439040-1984"
  },
  {
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    anio: 1967,
    genero: "Realismo Mágico",
    imagen: "../img/Cien_años_de_soledad.jpg",
    link: "https://www.goodreads.com/book/show/370523.Cien_a_os_de_soledad"
  },
  {
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    anio: 1813,
    genero: "Romance",
    imagen: "../img/orgullo_y_prejuicio.jpg",
    link: "https://www.goodreads.com/book/show/110815.Orgullo_y_prejuicio"
  },
  {
    titulo: "Cumbres borrascosas",
    autor: "Emily Brontë",
    anio: 1847,
    genero: "Romance",
    imagen: "../img/cumbres_borrascosas.jpg",
    link: "https://www.goodreads.com/book/show/10520714-cumbres-borrascosas"
  },
  {
    titulo: "Crimen y castigo",
    autor: "Fyodor Dostoievski",
    anio: 1866,
    genero: "Novela",
    imagen: "../img/crimen_y_castigo.jpg",
    link: "https://www.goodreads.com/book/show/103582.Crimen_y_castigo"
  },
  {
    titulo: "El retrato de Dorian Grey",
    autor: "Oscar Wilde",
    anio: 1890,
    genero: "Novela psicológica",
    imagen: "../img/el_retrato_de_doran.jpg",
    link: "https://www.goodreads.com/book/show/48326.El_retrato_de_Dorian_Gray"
  },
  {
    titulo: "Rayuela",
    autor: "Julio Cortázar",
    anio: 1963,
    genero: "Ficción",
    imagen: "../img/rayuela.jpg",
    link: "https://www.goodreads.com/book/show/46171.Rayuela"
  },
  {
    titulo: "La comunidad del anillo",
    autor: "J. R. R. Tolkien",
    anio: 1954,
    genero: "Fantasía",
    imagen: "../img/el_señor_de_los_anillos.jpg",
    link: "https://www.goodreads.com/book/show/222947.La_comunidad_del_anillo"
  },
  {
    titulo: "La metamorfosis",
    autor: "Franz Kafka",
    anio: 1915,
    genero: "Fantasía",
    imagen: "../img/la_metamorfosis.jpg",
    link: "https://www.goodreads.com/book/show/59186.La_metamorfosis"
  },
  {
    titulo: "El conde de montecristo",
    autor: "Alexandre Dumas",
    anio: 1846,
    genero: "Ficción",
    imagen: "../img/el_conde_de_montecristo.jpg",
    link: "https://www.goodreads.com/book/show/22060147-el-conde-de-montecristo"
  },
];

function mostrarLibrosFijos() {
  const contenedor = document.getElementById("librosFijos");
  contenedor.innerHTML = "";
  librosFijos.forEach((libro) => {
    contenedor.innerHTML += `
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

function mostrarRecomendaciones(generoFiltro = "todos") {
  const recomendaciones = JSON.parse(localStorage.getItem("libros")) || [];  // libros guardados desde localStorage
  const contenedor = document.getElementById("recomendaciones");
  contenedor.innerHTML = "";

  recomendaciones
    .filter(
      (libro) => generoFiltro === "todos" || libro.genero === generoFiltro // filtro está en "todos", muestro todo. Si no, comparo el género del libro.
    )
    .forEach((libro) => {
      contenedor.innerHTML += `
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

// mostrar libros al cargar la página 
window.addEventListener("DOMContentLoaded", () => {
  mostrarLibrosFijos();
  mostrarRecomendaciones();

 // filtro por genero 
  const filtro = document.getElementById("filtroGenero");
  filtro.addEventListener("change", () => {
    mostrarRecomendaciones(filtro.value);
  });
});
