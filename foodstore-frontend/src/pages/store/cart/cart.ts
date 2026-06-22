interface Producto { id: number; nombre: string; descripcion: string; precio: number; stock: number; imagen: string; categoriaId: number; disponible: boolean; }
interface CartItem extends Producto { cantidadSeleccionada: number; }

const usuarioActivo = localStorage.getItem('usuarioActivo');
let user: any = null;
if (!usuarioActivo) {
  window.location.replace('/src/pages/auth/login/index.html');
} else {
  user = JSON.parse(usuarioActivo);
  const userNameDisplay = document.getElementById('user-name-display');
  if (userNameDisplay) userNameDisplay.textContent = `${user.nombre} ${user.apellido}`;
}

document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  window.location.replace('/src/pages/auth/login/index.html');
});

const cartItemsContainer = document.getElementById('cart-items-container') as HTMLDivElement;
const emptyCartMsg = document.getElementById('empty-cart-msg') as HTMLDivElement;
const cartContent = document.getElementById('cart-content') as HTMLDivElement;
const summarySubtotal = document.getElementById('summary-subtotal') as HTMLSpanElement;
const summaryTotal = document.getElementById('summary-total') as HTMLSpanElement;
const btnEmptyCart = document.getElementById('btn-empty-cart') as HTMLButtonElement;
const btnConfirmOrder = document.getElementById('btn-confirm-order') as HTMLButtonElement;

let carrito: CartItem[] = [];

function init() {
  const carritoData = localStorage.getItem('carrito');
  carrito = carritoData ? JSON.parse(carritoData) : [];
  actualizarBadgeCarrito();
  renderizarCarrito();
}

function renderizarCarrito() {
  if (carrito.length === 0) {
    emptyCartMsg.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  emptyCartMsg.style.display = 'none';
  cartContent.style.display = 'flex';
  cartItemsContainer.innerHTML = '';
  
  let subtotal = 0;

  carrito.forEach((item, index) => {
    const itemSubtotal = item.precio * item.cantidadSeleccionada;
    subtotal += itemSubtotal;

    const card = document.createElement('div');
    card.className = 'cart-item-card';
    card.innerHTML = `
      <div class="cart-item-img">IMG</div>
      <div class="cart-item-info">
        <h4>${item.nombre}</h4>
        <p class="desc" style="height: auto; margin-bottom: 0.5rem;">${item.descripcion}</p>
        <p class="price">$${item.precio.toFixed(2)} c/u</p>
      </div>
      <div class="cart-item-actions">
        <div class="qty-selector">
          <button class="btn-qty" onclick="modificarCantidad(${index}, -1)">-</button>
          <input type="text" value="${item.cantidadSeleccionada}" readonly />
          <button class="btn-qty" onclick="modificarCantidad(${index}, 1)">+</button>
        </div>
        <p class="item-subtotal">$${itemSubtotal.toFixed(2)}</p>
        <button class="btn-remove" onclick="eliminarItem(${index})">🗑️</button>
      </div>
    `;
    cartItemsContainer.appendChild(card);
  });

  const costoEnvio = 500;
  summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
  summaryTotal.textContent = `$${(subtotal + costoEnvio).toFixed(2)}`;
}

// Se exponen al entorno global porque se inyectan en el HTML como strings
(window as any).modificarCantidad = (index: number, delta: number) => {
  const item = carrito[index];
  const nuevaCantidad = item.cantidadSeleccionada + delta;

  if (nuevaCantidad > 0 && nuevaCantidad <= item.stock) {
    carrito[index].cantidadSeleccionada = nuevaCantidad;
    guardarYRenderizar();
  } else if (nuevaCantidad > item.stock) {
    alert(`Stock insuficiente. Máximo disponible: ${item.stock}`);
  }
};

(window as any).eliminarItem = (index: number) => {
  carrito.splice(index, 1);
  guardarYRenderizar();
};

btnEmptyCart.addEventListener('click', () => {
  if(confirm('¿Estás seguro de vaciar el carrito?')) {
    carrito = [];
    guardarYRenderizar();
  }
});

btnConfirmOrder.addEventListener('click', () => {
  if (carrito.length === 0) return;
  
  // Simulamos la persistencia del pedido en localStorage para usarlo en la siguiente pantalla (Mis Pedidos)
  const nuevoPedido = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    usuarioId: user.id,
    estado: 'PENDIENTE',
    total: carrito.reduce((acc, item) => acc + (item.precio * item.cantidadSeleccionada), 0) + 500,
    productos: [...carrito]
  };

  const pedidosGuardados = localStorage.getItem('pedidosLocales');
  const pedidosArray = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
  pedidosArray.push(nuevoPedido);
  localStorage.setItem('pedidosLocales', JSON.stringify(pedidosArray));

  alert('¡Pedido confirmado con éxito!');
  carrito = [];
  guardarYRenderizar();
  
  // Redirigir al historial
  window.location.href = '/src/pages/client/orders/index.html';
});

function guardarYRenderizar() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarBadgeCarrito();
  renderizarCarrito();
}

function actualizarBadgeCarrito() {
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidadSeleccionada, 0);
  const badges = document.querySelectorAll('#cart-badge');
  badges.forEach(b => b.textContent = totalItems.toString());
}

init();