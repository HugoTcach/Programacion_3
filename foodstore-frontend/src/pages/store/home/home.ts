// 1. Validación de sesión estricta 
const usuarioActivo = localStorage.getItem('usuarioActivo');
if (!usuarioActivo) {
  window.location.replace('/src/pages/auth/login/index.html');
} else {
  const user = JSON.parse(usuarioActivo);
  const userNameDisplay = document.getElementById('user-name-display');
  if (userNameDisplay) userNameDisplay.textContent = `${user.nombre} ${user.apellido}`;
}

// 2. Lógica de Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  window.location.replace('/src/pages/auth/login/index.html');
});

// 3. Interfaces
interface Categoria { id: number; nombre: string; }
interface Producto { id: number; nombre: string; descripcion: string; precio: number; stock: number; imagen: string; categoriaId: number; disponible: boolean; }
interface CartItem extends Producto { cantidadSeleccionada: number; }

let productos: Producto[] = [];
let categorias: Categoria[] = [];
let categoriaActiva = 'all';

// Elementos del DOM
const productGrid = document.getElementById('product-grid') as HTMLDivElement;
const categoryList = document.getElementById('category-list') as HTMLUListElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
const productCount = document.getElementById('product-count') as HTMLParagraphElement;
const currentCategoryTitle = document.getElementById('current-category-title') as HTMLHeadingElement;

async function init() {
  actualizarBadgeCarrito();
  try {
    // Hidratación de Categorías (Prioridad: LocalStorage)
    const localCat = localStorage.getItem('categoriasLocales');
    if (localCat) {
      categorias = JSON.parse(localCat);
    } else {
      const catRes = await fetch('/data/categorias.json');
      categorias = await catRes.json();
    }

    // Hidratación de Productos (Prioridad: LocalStorage)
    const localProd = localStorage.getItem('productosLocales');
    if (localProd) {
      productos = JSON.parse(localProd);
    } else {
      const prodRes = await fetch('/data/productos.json');
      productos = await prodRes.json();
    }

    renderCategorias();
    renderProductos(productos);
  } catch (error) {
    console.error('Error cargando los datos:', error);
  }
}

function renderCategorias() {
  categorias.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<button class="cat-btn" data-id="${cat.id}">${cat.nombre}</button>`;
    categoryList.appendChild(li);
  });

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      const target = e.target as HTMLButtonElement;
      target.classList.add('active');
      categoriaActiva = target.dataset.id || 'all';
      currentCategoryTitle.textContent = target.textContent || 'Todos los Productos';
      filtrarProductos();
    });
  });
}

function renderProductos(lista: Producto[]) {
  productGrid.innerHTML = '';
  productCount.textContent = `${lista.length} productos encontrados`;

  lista.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-placeholder">IMAGEN</div>
      <div class="product-info">
        <h4>${prod.nombre}</h4>
        <p class="price">$${prod.precio.toFixed(2)}</p>
        <span class="badge ${prod.disponible ? 'disp-yes' : 'disp-no'}">${prod.disponible ? 'Disponible' : 'No disponible'}</span>
        <p class="desc">${prod.descripcion}</p>
        <button class="btn-primary mt-1" onclick="window.location.href='/src/pages/store/productDetail/index.html?id=${prod.id}'">Ver Detalle</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function filtrarProductos() {
  let filtrados = productos;

  if (categoriaActiva !== 'all') {
    filtrados = filtrados.filter(p => p.categoriaId === Number(categoriaActiva));
  }

  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(searchTerm));
  }

  const sortVal = sortSelect.value;
  if (sortVal === 'name-asc') filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (sortVal === 'name-desc') filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
  if (sortVal === 'price-asc') filtrados.sort((a, b) => a.precio - b.precio);
  if (sortVal === 'price-desc') filtrados.sort((a, b) => b.precio - a.precio);

  renderProductos(filtrados);
}

function actualizarBadgeCarrito() {
  const carritoData = localStorage.getItem('carrito');
  const carrito: CartItem[] = carritoData ? JSON.parse(carritoData) : [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidadSeleccionada, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = totalItems.toString();
}

searchInput.addEventListener('input', filtrarProductos);
sortSelect.addEventListener('change', filtrarProductos);

init();