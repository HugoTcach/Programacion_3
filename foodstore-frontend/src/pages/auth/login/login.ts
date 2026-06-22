interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  contrasena: string;
  rol: 'ADMIN' | 'USUARIO';
}

const loginForm = document.getElementById('login-form') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.style.display = 'none';

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError('Ambos campos son requeridos.');
    return;
  }

  try {
    const response = await fetch('/data/usuarios.json');
    if (!response.ok) throw new Error('Error al cargar la base de usuarios');
    
    const usuarios: Usuario[] = await response.json();
    const usuarioValido = usuarios.find(u => u.mail === email && u.contrasena === password);

    if (usuarioValido) {
      localStorage.setItem('usuarioActivo', JSON.stringify({
        id: usuarioValido.id,
        nombre: usuarioValido.nombre,
        apellido: usuarioValido.apellido,
        rol: usuarioValido.rol
      }));

      if (usuarioValido.rol === 'ADMIN') {
        window.location.href = '/src/pages/admin/adminHome/index.html';
      } else {
        window.location.href = '/src/pages/store/home/index.html';
      }
    } else {
      showError('Credenciales inválidas.');
    }
  } catch (error) {
    console.error(error);
    showError('Error interno del sistema al validar.');
  }
});

function showError(msg: string) {
  errorMessage.textContent = msg;
  errorMessage.style.display = 'block';
}