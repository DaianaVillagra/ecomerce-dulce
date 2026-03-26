/**
 * Carrito de Compras - Pastelería Artesanal
 * Versión: 2.1 - Sin emojis en botones
 */

// 1. LISTA DE PRODUCTOS
const productos = [
  { id: 1, nombre: "Torta de chocolate", precio: 22000, imagen: "img/T-Chocolate.jpg", categoria: "tortas" },
  { id: 2, nombre: "Torta de crema con Durazno", precio: 18400, imagen: "img/T-Crema-Durazno.webp", categoria: "tortas" },
  { id: 3, nombre: "Torta Oreo", precio: 20200, imagen: "img/T-Oreo.webp", categoria: "tortas" },
  { id: 4, nombre: "Torta Selva Negra", precio: 25000, imagen: "img/T_SN.jfif", categoria: "tortas" },
  { id: 5, nombre: "Tarta Cabsha", precio: 17500, imagen: "img/Tarta-Cabsha.jpg", categoria: "tartas" },
  { id: 6, nombre: "Tarta Frutilla", precio: 12800, imagen: "img/Tarta-Frutilla.avif", categoria: "tartas" },
  { id: 7, nombre: "Tarta de Durazno", precio: 10000, imagen: "img/Tarta_.jpg", categoria: "tartas" },
  { id: 8, nombre: "Lemon Pie", precio: 11000, imagen: "img/lemon-pie.jpg", categoria: "postres" },
  { id: 9, nombre: "Alfajores de Maicena", precio: 700, imagen: "img/Alf-MAicena.jfif", categoria: "alfajores" },
  { id: 10, nombre: "Alfajor de Chocolate", precio: 1200, imagen: "img/Alf-chocolate.jpg", categoria: "alfajores" },
  { id: 11, nombre: "Box Alfajores", precio: 5000, imagen: "img/Box-Alfajores.webp", categoria: "alfajores" },
  { id: 12, nombre: "Macarrones", precio: 1600, imagen: "img/Macarrones.jpg", categoria: "postres" },
  { id: 13, nombre: "Brownies", precio: 1600, imagen: "img/Browinie.jpg", categoria: "postres" },
  { id: 14, nombre: "Cupcakes Red Velvet", precio: 1600, imagen: "img/Cupcakes-Red.jfif", categoria: "cupcakes" },
  { id: 15, nombre: "Cupcakes Vainilla", precio: 2000, imagen: "img/Cupcakes-Vainilla.jfif", categoria: "cupcakes" },
  { id: 16, nombre: "Cupcakes Chocolate", precio: 2500, imagen: "img/cupcakes-Chocolate.jpg", categoria: "cupcakes" }
];

// 2. ESTADO DEL CARRITO
let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];

// 3. REFERENCIAS AL DOM
let galeria, carritoContainer, carritoOverlay, carritoCerrar;
let subtotalTexto, ivaTexto, totalTexto, lista;
let notificacion, notiImg, notiNombre, notiCantidad, notiPrecio;
let btnAbrirCarrito, btnVaciar, btnIniciar, btnVolver, btnCerrarCompra, formCompra;

// 4. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  if (!verificarElementos()) return;
  obtenerReferencias();
  configurarEventos();
  mostrarProductos();
  actualizarCarrito();
});

// Verificar elementos necesarios
function verificarElementos() {
  const requeridos = [
    "galeria-productos", "carrito-container", "carrito-overlay", 
    "carrito-lista", "carrito-subtotal", "carrito-iva", "carrito-total",
    "notificacion-producto", "form-compra"
  ];
  
  const faltantes = requeridos.filter(id => !document.getElementById(id));
  
  if (faltantes.length > 0) {
    console.error("Faltan elementos en el HTML:", faltantes);
    return false;
  }
  return true;
}

// Obtener referencias al DOM
function obtenerReferencias() {
  galeria = document.getElementById("galeria-productos");
  carritoContainer = document.getElementById("carrito-container");
  carritoOverlay = document.getElementById("carrito-overlay");
  carritoCerrar = document.getElementById("carrito-cerrar");
  subtotalTexto = document.getElementById("carrito-subtotal");
  ivaTexto = document.getElementById("carrito-iva");
  totalTexto = document.getElementById("carrito-total");
  lista = document.getElementById("carrito-lista");
  
  notificacion = document.getElementById("notificacion-producto");
  notiImg = document.getElementById("noti-img");
  notiNombre = document.getElementById("noti-nombre");
  notiCantidad = document.getElementById("noti-cantidad");
  notiPrecio = document.getElementById("noti-precio");
  
  btnAbrirCarrito = document.getElementById("btn-abrir-carrito");
  btnVaciar = document.getElementById("vaciar-carrito");
  btnIniciar = document.getElementById("iniciar-compra");
  btnVolver = document.getElementById("volver-productos");
  btnCerrarCompra = document.getElementById("cerrar-compra");
  formCompra = document.getElementById("form-compra");
}

// Configurar eventos
function configurarEventos() {
  btnAbrirCarrito?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirCarrito();
  });
  
  carritoCerrar?.addEventListener("click", cerrarCarrito);
  carritoOverlay?.addEventListener("click", cerrarCarrito);
  btnVolver?.addEventListener("click", cerrarCarrito);
  
  btnVaciar?.addEventListener("click", vaciarCarrito);
  btnIniciar?.addEventListener("click", iniciarCompra);
  
  btnCerrarCompra?.addEventListener("click", cerrarCompra);
  formCompra?.addEventListener("submit", procesarCompra);
  
  document.getElementById("noti-cerrar")?.addEventListener("click", () => {
    notificacion.style.display = "none";
  });
  
  document.getElementById("noti-ver-carrito")?.addEventListener("click", () => {
    notificacion.style.display = "none";
    abrirCarrito();
  });
  
  galeria?.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-agregar")) {
      const id = parseInt(e.target.dataset.id);
      agregarAlCarrito(id);
    }
  });
  
  lista?.addEventListener("change", manejarCantidad);
  lista?.addEventListener("click", manejarEliminar);
}

// 5. FUNCIONES DE RENDERIZADO

// Mostrar productos en la galería
function mostrarProductos() {
  if (!galeria) return;
  
  galeria.innerHTML = productos.map(prod => `
    <article class="producto" data-id="${prod.id}" data-categoria="${prod.categoria}">
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" />
      <h3>${prod.nombre}</h3>
      <p class="precio">$${formatearPrecio(prod.precio)}</p>
      <button class="btn-agregar" data-id="${prod.id}">
        Agregar
      </button>
    </article>
  `).join("");
}

// Formatear precio estilo argentino
function formatearPrecio(precio) {
  return precio.toLocaleString('es-AR', { minimumFractionDigits: 0 });
}

// 6. LÓGICA DEL CARRITO

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) {
    console.warn("Producto no encontrado:", id);
    return;
  }
  
  const existente = carrito.find(p => p.id === id);
  
  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + 1, 99);
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  
  guardarCarrito();
  mostrarNotificacion(producto);
}

// Guardar en localStorage
function guardarCarrito() {
  localStorage.setItem("Carrito", JSON.stringify(carrito));
}

// Mostrar notificación flotante
function mostrarNotificacion(producto) {
  const item = carrito.find(p => p.id === producto.id);
  
  notiImg.src = producto.imagen;
  notiNombre.textContent = producto.nombre;
  notiCantidad.textContent = "Cantidad: " + (item?.cantidad || 1);
  notiPrecio.textContent = "Total: $" + formatearPrecio(producto.precio * (item?.cantidad || 1));
  
  notificacion.style.display = "flex";
  
  setTimeout(() => {
    if (notificacion.style.display !== "none") {
      notificacion.style.display = "none";
    }
  }, 3000);
}

// 7. ACTUALIZAR VISTA DEL CARRITO

function actualizarCarrito() {
  if (!lista) return;
  
  lista.innerHTML = "";
  
  if (carrito.length === 0) {
    lista.innerHTML = '<li class="carrito-vacio">Tu carrito está vacío</li>';
    subtotalTexto.textContent = "$0";
    ivaTexto.textContent = "$0";
    totalTexto.textContent = "$0";
    return;
  }
  
  let subtotal = 0;
  
  carrito.forEach((item, index) => {
    const totalItem = item.precio * item.cantidad;
    subtotal += totalItem;
    
    const li = document.createElement("li");
    li.className = "carrito-item";
    li.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      <div class="info-producto">
        <h4>${item.nombre}</h4>
        <p class="precio-unitario">$${formatearPrecio(item.precio)} c/u</p>
      </div>
      <div class="controles-cantidad">
        <input type="number" class="cantidad" min="1" max="99" 
               value="${item.cantidad}" data-index="${index}">
        <button class="eliminar" data-index="${index}">
          Eliminar
        </button>
      </div>
      <p class="precio-total">$${formatearPrecio(totalItem)}</p>
    `;
    lista.appendChild(li);
  });
  
  const iva = subtotal * 0.21;
  const total = subtotal + iva;
  
  subtotalTexto.textContent = "$" + formatearPrecio(subtotal);
  ivaTexto.textContent = "$" + formatearPrecio(iva);
  totalTexto.textContent = "$" + formatearPrecio(total);
}

// Manejar cambio de cantidad
function manejarCantidad(e) {
  if (!e.target.classList.contains("cantidad")) return;
  
  const index = parseInt(e.target.dataset.index);
  const valor = parseInt(e.target.value);
  
  if (!isNaN(valor) && valor >= 1 && valor <= 99) {
    carrito[index].cantidad = valor;
    guardarCarrito();
    actualizarCarrito();
  } else {
    e.target.value = carrito[index].cantidad;
  }
}

// Manejar eliminación
function manejarEliminar(e) {
  if (!e.target.classList.contains("eliminar")) return;
  
  const index = parseInt(e.target.dataset.index);
  const nombreProducto = carrito[index]?.nombre;
  
  if (confirm("¿Eliminar \"" + nombreProducto + "\" del carrito?")) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
  }
}

// 8. ACCIONES DEL CARRITO

function abrirCarrito() {
  actualizarCarrito();
  carritoContainer.style.display = "flex";
  carritoOverlay.style.display = "block";
  document.body.style.overflow = "hidden";
}

function cerrarCarrito() {
  carritoContainer.style.display = "none";
  carritoOverlay.style.display = "none";
  document.body.style.overflow = "";
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    alert("El carrito ya está vacío");
    return;
  }
  
  if (confirm("¿Estás seguro de vaciar todo el carrito?")) {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
  }
}

function iniciarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agregá productos primero.");
    return;
  }
  
  cerrarCarrito();
  document.getElementById("pantalla-compra").style.display = "flex";
  carritoOverlay.style.display = "block";
}

function cerrarCompra() {
  document.getElementById("pantalla-compra").style.display = "none";
  carritoOverlay.style.display = "none";
  document.body.style.overflow = "";
}

// Procesar formulario de compra
function procesarCompra(e) {
  e.preventDefault();
  
  const datos = {
    titular: document.getElementById("titular").value,
    total: totalTexto.textContent,
    items: carrito.length
  };
  
  alert("¡Compra confirmada!\n\nGracias " + datos.titular + ".\nTotal: " + datos.total + "\n\nTe contactaremos para coordinar la entrega.");
  
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  cerrarCompra();
  formCompra.reset();
}

// Función para filtrar por categoría
function filtrarPorCategoria(categoria) {
  if (!galeria) return;
  
  const productosFiltrados = categoria === "todos" 
    ? productos 
    : productos.filter(p => p.categoria === categoria);
  
  galeria.innerHTML = productosFiltrados.map(prod => `
    <article class="producto" data-id="${prod.id}" data-categoria="${prod.categoria}">
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" />
      <h3>${prod.nombre}</h3>
      <p class="precio">$${formatearPrecio(prod.precio)}</p>
      <button class="btn-agregar" data-id="${prod.id}">Agregar</button>
    </article>
  `).join("");
}

// Funciones globales
window.agregarAlCarrito = agregarAlCarrito;
window.filtrarPorCategoria = filtrarPorCategoria;