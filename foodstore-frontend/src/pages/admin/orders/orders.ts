// Route Guard
const usuarioActivo = localStorage.getItem('usuarioActivo');
if (!usuarioActivo) {
  window.location.replace('/src/pages/auth/login/index.html');
} else {
  const user = JSON.parse(usuarioActivo);
  if (user.rol !== 'ADMIN') {
    alert('Acceso bloqueado: Se requieren permisos de Administrador.');
    window.location.replace('/src/pages/store/home/index.html');
  } else {
    document.body.style.display = 'block';
    const adminNameDisplay = document.getElementById('admin-name');
    if (adminNameDisplay) adminNameDisplay.textContent = `${user.nombre} ${user.apellido}`;
  }
}

document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  window.location.replace('/src/pages/auth/login/index.html');
});

// Referencias DOM
const tbody = document.getElementById('orders-tbody') as HTMLTableSectionElement;
const modal = document.getElementById('order-modal') as HTMLDivElement;
const modalClose = document.getElementById('modal-close') as HTMLSpanElement;
const btnCancelModal = document.getElementById('btn-cancel-modal') as HTMLButtonElement;
const form = document.getElementById('order-status-form') as HTMLFormElement;
const modalOrderDetails = document.getElementById('modal-order-details') as HTMLDivElement;
const inputId = document.getElementById('order-id') as HTMLInputElement;
const selectStatus = document.getElementById('order-status') as HTMLSelectElement;

let pedidosJson: any[] = [];
let pedidosLocales: any[] = [];
let todosLosPedidos: any[] = [];

async function init() {
  try {
    const res = await fetch('/data/pedidos.json');
    try { pedidosJson = await res.json(); } catch(e) { pedidosJson = []; }

    const pedidosLocalesStr = localStorage.getItem('pedidosLocales');
    pedidosLocales = pedidosLocalesStr ? JSON.parse(pedidosLocalesStr) : [];

    // Combinamos y eliminamos duplicados en caso de que un pedido del JSON haya sido modificado y guardado en local
    const mapPedidos = new Map();
    pedidosJson.forEach(p => mapPedidos.set(p.id, p));
    pedidosLocales.forEach(p => mapPedidos.set(p.id, p)); // El local pisa al JSON si tienen el mismo ID
    
    todosLosPedidos = Array.from(mapPedidos.values());
    todosLosPedidos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    renderTable();
  } catch (error) {
    console.error('Error cargando pedidos:', error);
  }
}

function renderTable() {
  tbody.innerHTML = '';
  if(todosLosPedidos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No hay pedidos registrados.</td></tr>`;
    return;
  }

  todosLosPedidos.forEach((pedido) => {
    const fechaObj = new Date(pedido.fecha);
    const fecha = isNaN(fechaObj.getTime()) ? pedido.fecha : fechaObj.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' });
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${pedido.id}</strong></td>
      <td>${fecha}</td>
      <td>Usuario ID: ${pedido.usuarioId}</td>
      <td>$${pedido.total.toFixed(2)}</td>
      <td><span class="status-badge status-${pedido.estado.toLowerCase()}">${pedido.estado}</span></td>
      <td>
        <button class="btn-secondary" onclick="gestionarPedido(${pedido.id})" style="padding: 0.3rem 0.6rem; font-size: 0.85rem;">Gestionar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

(window as any).gestionarPedido = (id: number) => {
  const pedido = todosLosPedidos.find(p => p.id === id);
  if(!pedido) return;

  inputId.value = pedido.id.toString();
  selectStatus.value = pedido.estado;

  const productosHtml = pedido.productos.map((p:any) => `
    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; padding: 0.25rem 0;">
      <span>${p.cantidadSeleccionada}x ${p.nombre}</span>
      <span>$${(p.precio * p.cantidadSeleccionada).toFixed(2)}</span>
    </div>
  `).join('');

  modalOrderDetails.innerHTML = `
    <p><strong>Pedido #${pedido.id}</strong></p>
    <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">Usuario ID: ${pedido.usuarioId}</p>
    <div style="margin-bottom: 1rem;">
      <strong>Productos:</strong>
      ${productosHtml}
    </div>
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem; color: #f26b21; border-top: 1px solid #ccc; padding-top: 0.5rem;">
      <span>Total Abonado:</span>
      <span>$${pedido.total.toFixed(2)}</span>
    </div>
  `;
  
  modal.style.display = 'flex';
};

function cerrarModal() {
  modal.style.display = 'none';
}

modalClose.addEventListener('click', cerrarModal);
btnCancelModal.addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const idVal = Number(inputId.value);
  const nuevoEstado = selectStatus.value;

  // Actualizamos el pedido. Lo guardamos en pedidosLocales para que persista
  const pedidoIndexLocal = pedidosLocales.findIndex(p => p.id === idVal);
  
  if (pedidoIndexLocal !== -1) {
    pedidosLocales[pedidoIndexLocal].estado = nuevoEstado;
  } else {
    // Si el pedido venía del JSON y no estaba en locales, lo copiamos modificado a locales
    const pedidoJson = pedidosJson.find(p => p.id === idVal);
    if (pedidoJson) {
      pedidoJson.estado = nuevoEstado;
      pedidosLocales.push(pedidoJson);
    }
  }

  localStorage.setItem('pedidosLocales', JSON.stringify(pedidosLocales));
  cerrarModal();
  init(); // Recargamos la tabla
});

init();