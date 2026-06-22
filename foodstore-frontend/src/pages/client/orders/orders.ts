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

const ordersList = document.getElementById('orders-list') as HTMLDivElement;
const emptyOrdersMsg = document.getElementById('empty-orders-msg') as HTMLDivElement;
const orderModal = document.getElementById('order-modal') as HTMLDivElement;
const modalClose = document.getElementById('modal-close') as HTMLSpanElement;
const modalBody = document.getElementById('modal-body') as HTMLDivElement;

let misPedidos: any[] = [];

async function init() {
  actualizarBadgeCarrito();
  try {
    const res = await fetch('/data/pedidos.json');
    let pedidosJson = [];
    try { pedidosJson = await res.json(); } catch(e) { /* Ignorar si el JSON está vacío */ }

    const pedidosLocalesStr = localStorage.getItem('pedidosLocales');
    const pedidosLocales = pedidosLocalesStr ? JSON.parse(pedidosLocalesStr) : [];

    const todosLosPedidos = [...pedidosJson, ...pedidosLocales];
    misPedidos = todosLosPedidos.filter(p => p.usuarioId === user.id);

    misPedidos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    renderPedidos();
  } catch (error) {
    console.error('Error cargando pedidos:', error);
  }
}

function renderPedidos() {
  if (misPedidos.length === 0) {
    emptyOrdersMsg.style.display = 'block';
    return;
  }

  misPedidos.forEach((pedido, index) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const fechaObj = new Date(pedido.fecha);
    const fecha = isNaN(fechaObj.getTime()) ? pedido.fecha : fechaObj.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' });
    
    const productosResumen = pedido.productos.slice(0, 3).map((p:any) => `<li>${p.cantidadSeleccionada}x ${p.nombre}</li>`).join('');
    const extra = pedido.productos.length > 3 ? `<li>... y ${pedido.productos.length - 3} más</li>` : '';

    card.innerHTML = `
      <div class="order-header">
        <div>
          <h4 class="order-id">Pedido #${pedido.id}</h4>
          <p class="order-date">📅 ${fecha}</p>
        </div>
        <span class="status-badge status-${pedido.estado.toLowerCase()}">${pedido.estado}</span>
      </div>
      <div class="order-body">
        <ul class="order-preview-list">
          ${productosResumen}
          ${extra}
        </ul>
        <div class="order-total-action">
          <p class="order-total">Total: $${pedido.total.toFixed(2)}</p>
          <button class="btn-secondary" onclick="abrirModal(${index})">Ver Detalle</button>
        </div>
      </div>
    `;
    ordersList.appendChild(card);
  });
}

(window as any).abrirModal = (index: number) => {
  const pedido = misPedidos[index];
  const fechaObj = new Date(pedido.fecha);
  const fecha = isNaN(fechaObj.getTime()) ? pedido.fecha : fechaObj.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' });
  
  const productosHtml = pedido.productos.map((p:any) => `
    <div class="modal-product-row">
      <span>${p.cantidadSeleccionada}x ${p.nombre}</span>
      <span>$${(p.precio * p.cantidadSeleccionada).toFixed(2)}</span>
    </div>
  `).join('');

  modalBody.innerHTML = `
    <h3>Detalle del Pedido #${pedido.id}</h3>
    <div class="modal-status-banner status-${pedido.estado.toLowerCase()}">
      Estado: <strong>${pedido.estado}</strong>
    </div>
    <p class="modal-date">Realizado el: ${fecha}</p>
    
    <div class="modal-section">
      <h4>Productos</h4>
      ${productosHtml}
    </div>
    
    <div class="modal-section breakdown">
      <div class="breakdown-row"><span>Subtotal</span><span>$${(pedido.total - 500).toFixed(2)}</span></div>
      <div class="breakdown-row"><span>Envío</span><span>$500.00</span></div>
      <div class="breakdown-row total"><span>Total</span><span>$${pedido.total.toFixed(2)}</span></div>
    </div>
  `;
  
  orderModal.style.display = 'flex';
};

modalClose.addEventListener('click', () => { orderModal.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === orderModal) orderModal.style.display = 'none'; });

function actualizarBadgeCarrito() {
  const carritoData = localStorage.getItem('carrito');
  const carrito = carritoData ? JSON.parse(carritoData) : [];
  const totalItems = carrito.reduce((acc: number, item: any) => acc + item.cantidadSeleccionada, 0);
  const badges = document.querySelectorAll('#cart-badge');
  badges.forEach(b => b.textContent = totalItems.toString());
}

init();