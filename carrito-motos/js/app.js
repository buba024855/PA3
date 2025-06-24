let carrito = [];

// Clase con encapsulamiento y métodos
class Producto {
  #id;
  #nombre;
  #precio;
  #imagen;

  constructor(id, nombre, precio, imagen) {
    this.#id = id;
    this.#nombre = nombre;
    this.#precio = precio;
    this.#imagen = imagen;
  }

  obtenerHTML() {
    return `
      <div class="producto">
        <img src="${this.#imagen}" alt="${this.#nombre}">
        <h3>${this.#nombre}</h3>
        <p>Precio: S/ ${this.#precio}</p>
        <button onclick="agregarAlCarrito(${this.#id})">Agregar al carrito</button>
      </div>
    `;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get precio() { return this.#precio; }
}

const crearProductos = () => [
  new Producto(1, "Moto CRF 250", 22000, "./img/moto1.jpg"),
  new Producto(2, "KTM SX 125", 18500, "./img/moto2.jpg"),
  new Producto(3, "Yamaha YZ 450F", 26000, "./img/moto3.jpg")
];

const productos = crearProductos();
const productosContainer = document.getElementById('productos');
const listaCarrito = document.getElementById('lista-carrito');
const totalSpan = document.getElementById('total');
const formulario = document.getElementById('formulario-compra');

function contarCarrito(index = 0) {
  return index >= carrito.length ? 0 : 1 + contarCarrito(index + 1);
}

function mostrarProductos() {
  productos.forEach(p => {
    productosContainer.innerHTML += p.obtenerHTML();
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach((p, i) => {
    const li = document.createElement('li');
    li.textContent = `${p.nombre} - S/ ${p.precio}`;
    li.addEventListener("click", () => eliminarDelCarrito(i));
    listaCarrito.appendChild(li);
    total += p.precio;
  });
  totalSpan.textContent = total.toFixed(2);
  guardarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function guardarCarrito() {
  const carritoPlano = carrito.map(p => ({
    nombre: p.nombre,
    precio: p.precio
  }));
  localStorage.setItem('carrito', JSON.stringify(carritoPlano));
}

formulario.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const direccion = document.getElementById('direccion').value.trim();

  if (!nombre || !email || !dni || !direccion) {
    alert("Completa todos los campos");
    return;
  }

  if (carrito.length === 0) {
    alert("Agrega al menos un producto al carrito antes de enviar el pedido.");
    return;
  }

  localStorage.setItem('nombre', nombre);
  localStorage.setItem('correo', email);
  localStorage.setItem('dni', dni);
  localStorage.setItem('direccion', direccion);

  const carritoPlano = carrito.map(p => ({
    nombre: p.nombre,
    precio: p.precio
  }));
  localStorage.setItem('carrito', JSON.stringify(carritoPlano));

  alert(`Gracias por tu compra, ${nombre}! Te enviaremos un correo a ${email}.`);
  formulario.reset();
  carrito = [];
  actualizarCarrito();

  setTimeout(() => {
    window.location.href = "factura.html";
  }, 1000);
});

window.addEventListener('load', () => {
  console.log("Página cargada correctamente");
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'c') {
    alert("Has presionado la tecla 'c'");
  }
});

window.addEventListener('scroll', () => {
  console.log("Estás desplazándote por la página");
});

mostrarProductos();

document.getElementById('buscador').addEventListener('input', (e) => {
  const termino = e.target.value.toLowerCase();
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';
  productos
    .filter(p => p.nombre.toLowerCase().includes(termino))
    .forEach(p => contenedor.innerHTML += p.obtenerHTML());
});

document.getElementById('modoOscuroBtn').addEventListener('click', () => {
  document.body.classList.toggle('oscuro');
});

window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCarrito = actualizarCarrito;
