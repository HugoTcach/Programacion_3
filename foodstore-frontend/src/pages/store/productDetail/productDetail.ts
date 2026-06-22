interface Producto { id: number; nombre: string; descripcion: string; precio: number; stock: number; imagen: string; categoriaId: number; disponible: boolean; }
interface CartItem extends Producto { cantidadSeleccionada: number; }

// Validación de sesión
const usuarioActivo = localStorage.getItem('usuarioActivo');
if (!usuarioActivo) {
  window.location.replace('/src/pages/auth/login/index.html');
} else {
  const user = JSON.parse(usuarioActivo);
  const userNameDisplay = document.getElementById('user-name-display');
  if (userNameDisplay) userNameDisplay.textContent = `${user.nombre} ${user.apellido}`;
}

// Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  window.location.replace('/src/pages/auth/login/index.html');
});

const urlParams = new URLSearchParams(window.location.search);
const productId = Number(urlParams.get('id'));
const detailContainer = document.getElementById('product-detail') as HTMLDivElement;

async function init() {
  actualizarBadgeCarrito();
  if (!productId) {
    detailContainer.innerHTML = `<p style="color:red;">Producto no especificado.</p><br><button class="btn-secondary" onclick="window.history.back()">Volver</button>`;
    return;
  }

  try {
    let productos: Producto[] = [];
    const localProd = localStorage.getItem('productosLocales');
    
    if (localProd) {
      productos = JSON.parse(localProd);
    } else {
      const response = await fetch('/data/productos.json');
      productos = await response.json();
    }

    const producto = productos.find(p => p.id === productId);

    if (!producto) {
      detailContainer.innerHTML = `<p style="color:red;">Producto no encontrado.</p><br><button class="btn-secondary" onclick="window.history.back()">Volver</button>`;
      return;
    }

    renderProducto(producto);
  } catch (error) {
    console.error('Error:', error);
    detailContainer.innerHTML = `<p style="color:red;">Error interno al cargar el producto.</p>`;
  }
}

function renderProducto(producto: Producto) {
  detailContainer.innerHTML = `
    <div class="detail-img-placeholder">IMAGEN GRANDE</div>
    <div class="detail-info">
      <h2>${producto.nombre}</h2>
      <p class="price-large">$${producto.precio.toFixed(2)}</p>
      <span class="badge ${producto.disponible ? 'disp-yes' : 'disp-no'}">${producto.disponible ? 'Disponible' : 'No disponible'}</span>
      <p class="stock-info">Stock disponible: <span id="stock-value">${producto.stock}</span></p>
      <p class="desc-large">${producto.descripcion}</p>
      
      <div class="cart-controls">
        <label>Cantidad:</label>
        <div class="qty-selector">
          <button id="btn-minus" class="btn-qty" ${!producto.disponible || producto.stock === 0 ? 'disabled' : ''}>-</button>
          <input type="number" id="qty-input" value="1" min="1" max="${producto.stock}" readonly />
          <button id="btn-plus" class="btn-qty" ${!producto.disponible || producto.stock === 0 ? 'disabled' : ''}>+</button>
        </div>
      </div>
      
      <p id="feedback-msg" class="feedback-msg" style="display:none;"></p>
      
      <div class="action-buttons">
        <button id="btn-add-cart" class="btn-primary" ${!producto.disponible || producto.stock === 0 ? 'disabled' : ''}>Agregar al Carrito</button>
        <button class="btn-secondary" onclick="window.location.href='/src/pages/store/home/index.html'">Volver</button>
      </div>
    </div>
  `;

  setupControls(producto);
}

function setupControls(producto: Producto) {
  if (!producto.disponible || producto.stock === 0) return;

  const btnMinus = document.getElementById('btn-minus') as HTMLButtonElement;
  const btnPlus = document.getElementById('btn-plus') as HTMLButtonElement;
  const qtyInput = document.getElementById('qty-input') as HTMLInputElement;
  const btnAddCart = document.getElementById('btn-add-cart') as HTMLButtonElement;
  const feedbackMsg = document.getElementById('feedback-msg') as HTMLParagraphElement;

  btnMinus.addEventListener('click', () => {
    let current = parseInt(qtyInput.value);
    if (current > 1) qtyInput.value = (current - 1).toString();
  });

  btnPlus.addEventListener('click', () => {
    let current = parseInt(qtyInput.value);
    if (current < producto.stock) qtyInput.value = (current + 1).toString();
  });

  btnAddCart.addEventListener('click', () => {
    const cantidad = parseInt(qtyInput.value);
    agregarAlCarrito(producto, cantidad);
    
    feedbackMsg.textContent = `Se agregaron ${cantidad} unidad(es) al carrito.`;
    feedbackMsg.style.display = 'block';
    feedbackMsg.style.color = '#065f46';
    setTimeout(() => feedbackMsg.style.display = 'none', 3000);
  });
}

function agregarAlCarrito(producto: Producto, cantidad: number) {
  const carritoData = localStorage.getItem('carrito');
  let carrito: CartItem[] = carritoData ? JSON.parse(carritoData) : [];

  const index = carrito.findIndex(item => item.id === producto.id);
  if (index !== -1) {
    const nuevaCantidad = carrito[index].cantidadSeleccionada + cantidad;
    // Evita sumar en el carrito más de lo que hay en stock general
    carrito[index].cantidadSeleccionada = nuevaCantidad > producto.stock ? producto.stock : nuevaCantidad;
  } else {
    carrito.push({ ...producto, cantidadSeleccionada: cantidad });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function actualizarBadgeCarrito() {
  const carritoData = localStorage.getItem('carrito');
  const carrito: CartItem[] = carritoData ? JSON.parse(carritoData) : [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidadSeleccionada, 0);
  const badges = document.querySelectorAll('#cart-badge');
  badges.forEach(b => b.textContent = totalItems.toString());
}

init();