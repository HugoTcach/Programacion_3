interface Categoria { id: number; nombre: string; descripcion: string; }

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

const tbody = document.getElementById('category-tbody') as HTMLTableSectionElement;
const modal = document.getElementById('category-modal') as HTMLDivElement;
const modalClose = document.getElementById('modal-close') as HTMLSpanElement;
const btnCancelModal = document.getElementById('btn-cancel-modal') as HTMLButtonElement;
const btnAddCategory = document.getElementById('btn-add-category') as HTMLButtonElement;
const form = document.getElementById('category-form') as HTMLFormElement;
const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;

const inputId = document.getElementById('cat-id') as HTMLInputElement;
const inputNombre = document.getElementById('cat-nombre') as HTMLInputElement;
const inputDesc = document.getElementById('cat-desc') as HTMLInputElement;

let categorias: Categoria[] = [];

async function init() {
  const localData = localStorage.getItem('categoriasLocales');
  if (localData) {
    categorias = JSON.parse(localData);
    renderTable();
  } else {
    try {
      const res = await fetch('/data/categorias.json');
      categorias = await res.json();
      guardarCategorias();
    } catch (error) {
      console.error('Error cargando categorías base:', error);
    }
  }
}

function guardarCategorias() {
  localStorage.setItem('categoriasLocales', JSON.stringify(categorias));
  renderTable();
}

function renderTable() {
  tbody.innerHTML = '';
  if(categorias.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem;">No hay categorías registradas.</td></tr>`;
    return;
  }

  categorias.forEach((cat, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cat.id}</td>
      <td><strong>${cat.nombre}</strong></td>
      <td>${cat.descripcion}</td>
      <td>
        <div class="action-buttons-sm">
          <button class="btn-edit" onclick="editarCategoria(${index})" title="Editar">✏️</button>
          <button class="btn-delete" onclick="eliminarCategoria(${index})" title="Eliminar">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

(window as any).editarCategoria = (index: number) => {
  const cat = categorias[index];
  modalTitle.textContent = 'Editar Categoría';
  inputId.value = cat.id.toString();
  inputNombre.value = cat.nombre;
  inputDesc.value = cat.descripcion;
  modal.style.display = 'flex';
};

(window as any).eliminarCategoria = (index: number) => {
  if(confirm(`¿Estás seguro de eliminar la categoría "${categorias[index].nombre}"?`)) {
    categorias.splice(index, 1);
    guardarCategorias();
  }
};

btnAddCategory.addEventListener('click', () => {
  modalTitle.textContent = 'Nueva Categoría';
  form.reset();
  inputId.value = '';
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
  const descVal = inputDesc.value.trim();

  if(idVal) {
    // Modo Edición
    const index = categorias.findIndex(c => c.id === Number(idVal));
    if(index !== -1) {
      categorias[index] = { id: Number(idVal), nombre: nombreVal, descripcion: descVal };
    }
  } else {
    // Modo Creación
    const nuevoId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
    categorias.push({ id: nuevoId, nombre: nombreVal, descripcion: descVal });
  }
  
  guardarCategorias();
  cerrarModal();
});

init();