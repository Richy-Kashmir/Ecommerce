
const productos = [
    { 
        id: "guitarra1", nombre: "Guitarra Acústica", categoria: "cuerdas", precio: 899, img: "https://www.laguitarreria.es/7073-large_default/guitarra-clasica-valencia-vc104-4-4-modelo-brillo.jpg" 
    },
    { 
        id: "piano1",   nombre: "Piano Eléctrico", categoria: "teclado", precio: 599, img: "https://static.bax-shop.es/image/product/1023619/3872743/6e5c26eb/1664874834yamaha_P-S500BK_1.jpg" },
    { 
        id: "caja1",    nombre: "Caja de Percusión", categoria: "percusión", precio: 120, img: "https://www.tamtampercusion.com/12386-superlarge_default/yamaha-ms9314ch-caja-marching-blanca.jpg" },
    { 
        id: "guitarra2",nombre: "Guitarra Eléctrica", categoria: "cuerdas", precio: 699, img: "https://r2.gear4music.com/media/11/119626/600/preview.jpg" },
    { 
        id: "teclado1", nombre: "Teclado MIDI", categoria: "teclado", precio: 350, img: "https://drunkat.es/upload/productos/800x800/arturia_minilab-3-black_1.jpg" },
        {
            id: "bateria1", nombre: "Batería", categoria: "percusión", precio: 499, img: "https://img.vevorstatic.com/es%2FWJTJZG5JT22HFIWG5V0%2Fgoods_img-v2%2Fdrum-set-m100-1.2.jpg?timestamp=1716800022000&format=webp&format=webp"
        },
        {
                id: "bajo", nombre: "Bajo Eléctrico", categoria: "cuerdas", precio: 450, img: "https://www.musicalpontevedra.es/63698-thickbox_default/bajo-electrico-mini-flight-rock-lite-negro.jpg"
        },
        {
            id: "saxofon1", nombre: "Saxofón", categoria: "viento", precio: 299, img: "https://tempomusica.com/357-large_default/saxofon-alto-yamaha-62.jpg"
        }
];


let carrito = [];

// Si ya hay algo guardado
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

/**
 * Añade un producto al carrito.
 * @param {string} id - id del producto (ej. "guitarra1")
 */
function agregarAlCarrito(id) {
    // Busca el producto en la lista de datos
    const prod = productos.find(p => p.id === id);
    if (!prod) {
        alert("Producto no encontrado");
        return;
    }

    // ¿Ya está en el carrito? 
    const existente = carrito.find(p => p.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        // Si no, lo añadimos con cantidad 1
        carrito.push({ ...prod, cantidad: 1 });
    }

    
    localStorage.setItem("carrito", JSON.stringify(carrito));


    alert(`${prod.nombre} añadido al carrito`);
}




function calcularTotal() {
    // Sumar (precio * cantidad) de todos los productos del carrito
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });
    return total;
}


function filtrarPorCategoria(categoria) {
    // Si la categoría es "todos", devolvemos todos los productos
    if (categoria === "todos") return productos;

    // De lo contrario, devolvemos solo los que coinciden
    return productos.filter(p => p.categoria === categoria);
}


function ordenarPorPrecioAscendente(lista) {
    // Copiamos la lista para no modificar el original
    const copia = lista.slice();
    copia.sort((a, b) => a.precio - b.precio);
    return copia;
}


function actualizarBadgeCarrito() {
    // El número de productos (suma de cantidades) se muestra en el icono del carrito
    const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const badge = document.getElementById("cartIcon");
    if (badge) badge.textContent = `🛒 ${totalItems}`;
}

function renderizarCarrito() {
    const contenedor = document.getElementById("cartItems");
    if (!contenedor) return; // solo se ejecuta en la página del carrito

    contenedor.innerHTML = ""; // limpiamos

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        document.getElementById("cartTotal").textContent = "0.00";
        return;
    }

    // Recorremos cada línea del carrito
    carrito.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <span>${item.nombre} × ${item.cantidad}</span>
            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            <button class="btn btn-danger" data-id="${item.id}" data-action="eliminar">✖</button>
        `;
        contenedor.appendChild(div);
    });

    // Total al final
    document.getElementById("cartTotal").textContent = calcularTotal().toFixed(2);
}



// Botón "Añadir al carrito" que está en cada tarjeta de producto
document.addEventListener("click", e => {
    // 1) Añadir al carrito (tarjetas de la lista)
    if (e.target && e.target.classList.contains("btn-add")) {
        const id = e.target.dataset.id;
        agregarAlCarrito(id);
        actualizarBadgeCarrito();
    }

    // 2) Eliminar ítem del carrito (página cart.html)
    if (e.target && e.target.classList.contains("btn-danger")) {
        const id = e.target.dataset.id;
        // Quitamos todas las unidades del producto o solo una?
        // Aquí quitamos todo (más simple)
        carrito = carrito.filter(p => p.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarBadgeCarrito();
        renderizarCarrito();
    }
});




document.addEventListener("DOMContentLoaded", () => {
    // 8.1  Si estamos en la página principal (index.html) → cargamos los productos destacados
    // En los HTML de TiendaCompra el contenedor de destacados tiene id "rasgoGrid"
    if (document.getElementById('rasgoGrid')) {
        const grid = document.getElementById('rasgoGrid');
        productos.slice(0, 4).forEach(p => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'product-card';
            tarjeta.innerHTML = `
                <img src="${p.img}" alt="${p.nombre}">
                <div class="product-info">
                    <h3>${p.nombre}</h3>
                    <p class="price">$${p.precio}</p>
                    <button class="btn btn-uno btn-add" data-id="${p.id}">Añadir</button>
                </div>
            `;
            grid.appendChild(tarjeta);
        });
    }

    // 8.2  Si estamos en la página de lista (products.html) → cargamos y filtramos
    // Ajustado a los IDs presentes en TiendaCompra/productos.html
    if (document.getElementById('categoriaFiltro')) {
        const categoriaSelect = document.getElementById('categoriaFiltro');
        const ordenSelect = document.getElementById('sortOption');
        const filtrarBtn = document.getElementById('filterBtn');

        // Función de orden flexible
        function ordenarProductos(lista, criterio) {
            const copia = lista.slice();
            if (criterio === 'precio-asc') copia.sort((a, b) => a.precio - b.precio);
            else if (criterio === 'precio-desc') copia.sort((a, b) => b.precio - a.precio);
            else if (criterio === 'nombre') copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
            return copia;
        }

        // Cada vez que cambiamos el filtro o el orden, volvemos a dibujar
        const dibujar = () => {
            const lista = filtrarPorCategoria(categoriaSelect.value);
            const ordenada = ordenarProductos(lista, ordenSelect.value);
            const grid = document.getElementById('productosGrid');
            if (grid) {
                grid.innerHTML = '';
                ordenada.forEach(p => {
                    const tarjeta = document.createElement('div');
                    tarjeta.className = 'product-card';
                    tarjeta.innerHTML = `
                        <img src="${p.img}" alt="${p.nombre}">
                        <div class="product-info">
                            <h3>${p.nombre}</h3>
                            <p class="price">$${p.precio}</p>
                            <button class="btn btn-uno btn-add" data-id="${p.id}">Añadir</button>
                        </div>
                    `;
                    grid.appendChild(tarjeta);
                });
                // No es necesario volver a ligar eventos si usamos delegación global ('.btn-add')
            }
        };

        categoriaSelect.addEventListener('change', dibujar);
        ordenSelect.addEventListener('change', dibujar);
        filtrarBtn.addEventListener('click', dibujar);
        // Dibujar inicial
        dibujar();
    }

    // 8.3  Si estamos en la página del carrito (cart.html) → renderizamos
    if (document.getElementById("cartItems")) {
        renderizarCarrito();
        actualizarBadgeCarrito();
    }

    // 8.4  Si estamos en la página de detalle (product-detail.html) → botón "Añadir"
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const qty = parseInt(document.getElementById('qtySelect').value, 10) || 1;
            // Obtener id del producto desde la URL (?id=producto-id)
            const params = new URLSearchParams(window.location.search);
            const productoId = params.get('id');
            const producto = productos.find(p => p.id === productoId);
            if (producto) {
                const existente = carrito.find(p => p.id === producto.id);
                if (existente) {
                    existente.cantidad += qty;
                } else {
                    carrito.push({ ...producto, cantidad: qty });
                }
                localStorage.setItem('carrito', JSON.stringify(carrito));
                actualizarBadgeCarrito();
                alert(`${producto.nombre} (x${qty}) añadido al carrito`);
            }
        });
    }
});

