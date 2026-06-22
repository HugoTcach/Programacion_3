interface Categoria { id: number; nombre: string; descripcion: string; }
interface Producto { id: number; nombre: string; descripcion: string; precio: number; stock: number; imagen: string; categoriaId: number; disponible: boolean; }

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

// Referencias del DOM
const tbody = document.getElementById('product-tbody') as HTMLTableSectionElement;
const selectCat = document.getElementById('prod-cat') as HTMLSelectElement;
const modal = document.getElementById('product-modal') as HTMLDivElement;
const modalClose = document.getElementById('modal-close') as HTMLSpanElement;
const btnCancelModal = document.getElementById('btn-cancel-modal') as HTMLButtonElement;
const btnAddProduct = document.getElementById('btn-add-product') as HTMLButtonElement;
const form = document.getElementById('product-form') as HTMLFormElement;
const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;

const inputId = document.getElementById('prod-id') as HTMLInputElement;
const inputNombre = document.getElementById('prod-nombre') as HTMLInputElement;
const inputDesc = document.getElementById('prod-desc') as HTMLInputElement;
const inputPrecio = document.getElementById('prod-precio') as HTMLInputElement;
const inputStock = document.getElementById('prod-stock') as HTMLInputElement;
const inputDisp = document.getElementById('prod-disp') as HTMLInputElement;

let productos: Producto[] = [];
let categorias: Categoria[] = [];

async function init() {
  await cargarCategorias();
  await cargarProductos();
}

async function cargarCategorias() {
  const localCat = localStorage.getItem('categoriasLocales');
  if (localCat) {
    categorias = JSON.parse(localCat);
  } else {
    try {
      const res = await fetch('/data/categorias.json');
      categorias = await res.json();
      localStorage.setItem('categoriasLocales', JSON.stringify(categorias));
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  }
  
  selectCat.innerHTML = categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

async function cargarProductos() {
  const localProd = localStorage.getItem('productosLocales');
  if (localProd) {
    productos = JSON.parse(localProd);
    renderTable();
  } else {
    try {
      const res = await fetch('/data/productos.json');
      productos = await res.json();
      guardarProductos();
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  }
}

function guardarProductos() {
  localStorage.setItem('productosLocales', JSON.stringify(productos));
  renderTable();
}

function renderTable() {
  tbody.innerHTML = '';
  if(productos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No hay productos registrados.</td></tr>`;
    return;
  }

  productos.forEach((prod, index) => {
    const dispBadge = prod.disponible 
      ? `<span class="badge disp-yes">Sí</span>` 
      : `<span class="badge disp-no">No</span>`;
      
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${prod.id}</td>
      <td><strong>${prod.nombre}</strong></td>
      <td>$${prod.precio.toFixed(2)}</td>
      <td>${prod.stock}</td>
      <td>${dispBadge}</td>
      <td>
        <div class="action-buttons-sm">
          <button class="btn-edit" onclick="editarProducto(${index})" title="Editar">✏️</button>
          <button class="btn-delete" onclick="eliminarProducto(${index})" title="Eliminar">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

(window as any).editarProducto = (index: number) => {
  const prod = productos[index];
  modalTitle.textContent = 'Editar Producto';
  inputId.value = prod.id.toString();
  inputNombre.value = prod.nombre;
  selectCat.value = prod.categoriaId.toString();
  inputDesc.value = prod.descripcion;
  inputPrecio.value = prod.precio.toString();
  inputStock.value = prod.stock.toString();
  inputDisp.checked = prod.disponible;
  
  modal.style.display = 'flex';
};

(window as any).eliminarProducto = (index: number) => {
  if(confirm(`¿Estás seguro de eliminar el producto "${productos[index].nombre}"?`)) {
    productos.splice(index, 1);
    guardarProductos();
  }
};

btnAddProduct.addEventListener('click', () => {
  if (categorias.length === 0) {
    alert('Debes crear al menos una categoría antes de registrar un producto.');
    return;
  }
  modalTitle.textContent = 'Nuevo Producto';
  form.reset();
  inputId.value = '';
  inputDisp.checked = true;
  modal.style.display = 'flex';
});

function cerrarModal() {
  modal.style.display = 'none';
}

modalClose.addEventListener('click', cerrarModal);
btnCancelModal.addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const idVal = inputId.value;
  const nombreVal = inputNombre.value.trim();
  const catVal = parseInt(selectCat.value);
  const descVal = inputDesc.value.trim();
  const precioVal = parseFloat(inputPrecio.value);
  const stockVal = parseInt(inputStock.value);
  const dispVal = inputDisp.checked;

  if(idVal) {
    const index = productos.findIndex(p => p.id === Number(idVal));
    if(index !== -1) {
      productos[index] = {
        ...productos[index],
        nombre: nombreVal,
        categoriaId: catVal,
        descripcion: descVal,
        precio: precioVal,
        stock: stockVal,
        disponible: dispVal
      };
    }
  } else {
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    productos.push({
      id: nuevoId,
      nombre: nombreVal,
      descripcion: descVal,
      precio: precioVal,
      stock: stockVal,
      imagen: '', 
      categoriaId: catVal,
      disponible: dispVal
    });
  }
  
  guardarProductos();
  cerrarModal();
});

init();