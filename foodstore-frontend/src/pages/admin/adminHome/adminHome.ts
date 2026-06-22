// Validación estricta de sesión y rol de administrador (Route Guard)
const usuarioActivo = localStorage.getItem('usuarioActivo');

if (!usuarioActivo) {
  window.location.replace('/src/pages/auth/login/index.html');
} else {
  const user = JSON.parse(usuarioActivo);
  if (user.rol !== 'ADMIN') {
    alert('Acceso bloqueado: Se requieren permisos de Administrador.');
    window.location.replace('/src/pages/store/home/index.html');
  } else {
    // Desocultar el body porque el usuario es administrador válido
    document.body.style.display = 'block';
    
    const adminNameDisplay = document.getElementById('admin-name');
    if (adminNameDisplay) adminNameDisplay.textContent = `${user.nombre} ${user.apellido}`;
    initDashboard();
  }
}

document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  window.location.replace('/src/pages/auth/login/index.html');
});

const statCat = document.getElementById('stat-cat') as HTMLParagraphElement;
const statProd = document.getElementById('stat-prod') as HTMLParagraphElement;
const statOrd = document.getElementById('stat-ord') as HTMLParagraphElement;
const statDisp = document.getElementById('stat-disp') as HTMLParagraphElement;
const statRevenue = document.getElementById('stat-revenue') as HTMLElement;
const statPending = document.getElementById('stat-pending') as HTMLElement;
const statPrep = document.getElementById('stat-prep') as HTMLElement;
const statCompleted = document.getElementById('stat-completed') as HTMLElement;

async function initDashboard() {
  try {
    const [catRes, prodRes, pedRes] = await Promise.all([
      fetch('/data/categorias.json'),
      fetch('/data/productos.json'),
      fetch('/data/pedidos.json')
    ]);
    
    const categorias = await catRes.json();
    const productos = await prodRes.json();
    
    let pedidosJson = [];
    try { pedidosJson = await pedRes.json(); } catch(e) { /* Json vacío */ }

    const pedidosLocalesStr = localStorage.getItem('pedidosLocales');
    const pedidosLocales = pedidosLocalesStr ? JSON.parse(pedidosLocalesStr) : [];
    const todosLosPedidos = [...pedidosJson, ...pedidosLocales];

    // Procesamiento de datos estadísticos
    const disponibles = productos.filter((p: any) => p.disponible).length;
    const ingresos = todosLosPedidos
      .filter(p => p.estado === 'TERMINADO' || p.estado === 'COMPLETADO')
      .reduce((acc, p) => acc + p.total, 0);
      
    const pendientes = todosLosPedidos.filter(p => p.estado === 'PENDIENTE').length;
    const enPrep = todosLosPedidos.filter(p => p.estado === 'EN PREPARACION').length;
    const completados = todosLosPedidos.filter(p => p.estado === 'TERMINADO' || p.estado === 'COMPLETADO').length;

    if(statCat) statCat.textContent = categorias.length.toString();
    if(statProd) statProd.textContent = productos.length.toString();
    if(statOrd) statOrd.textContent = todosLosPedidos.length.toString();
    if(statDisp) statDisp.textContent = disponibles.toString();
    
    if(statRevenue) statRevenue.textContent = `$${ingresos.toFixed(2)}`;
    if(statPending) statPending.textContent = pendientes.toString();
    if(statPrep) statPrep.textContent = enPrep.toString();
    if(statCompleted) statCompleted.textContent = completados.toString();

  } catch (error) {
    console.error('Error cargando datos del dashboard:', error);
  }
}