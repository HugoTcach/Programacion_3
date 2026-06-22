package com.tp.jpa;

import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.DetallePedido;
import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.Producto;
import com.tp.jpa.model.Usuario;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.CategoriaRepository;
import com.tp.jpa.repository.PedidoRepository;
import com.tp.jpa.repository.ProductoRepository;
import com.tp.jpa.repository.UsuarioRepository;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

public class Main {

    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final UsuarioRepository usuarioRepo = new UsuarioRepository();
    private static final PedidoRepository pedidoRepo = new PedidoRepository();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        try {
            int opcion;
            do {
                System.out.println("\n=== MENÚ PRINCIPAL ===");
                System.out.println("1. Gestionar Categorías");
                System.out.println("2. Gestionar Productos");
                System.out.println("3. Gestionar Usuarios");
                System.out.println("4. Gestionar Pedidos");
                System.out.println("5. Reportes");
                System.out.println("0. Salir");
                System.out.print("Seleccione una opción: ");

                opcion = leerEntero();

                switch (opcion) {
                    case 1 -> menuCategorias();
                    case 2 -> menuProductos();
                    case 3 -> menuUsuarios();
                    case 4 -> menuPedidos();
                    case 5 -> menuReportes();
                    case 0 -> System.out.println("Cerrando conexiones y saliendo del sistema...");
                    default -> System.out.println("Opción inválida.");
                }
            } while (opcion != 0);
        } finally {
            JPAUtil.close();
            scanner.close();
        }
    }

    // ==========================================
    // MENÚ DE CATEGORÍAS
    // ==========================================
    private static void menuCategorias() {
        int opcion;
        do {
            System.out.println("\n--- Gestión de Categorías ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione: ");
            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaCategoria();
                case 2 -> modificarCategoria();
                case 3 -> bajaCategoria();
                case 4 -> listarCategorias();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opción inválida.");
            }
        } while (opcion != 0);
    }

    private static void altaCategoria() {
        System.out.print("Nombre de la categoría: ");
        String nombre = scanner.nextLine().trim();
        if (nombre.isEmpty()) {
            System.out.println("Error: El nombre no puede estar vacío.");
            return;
        }
        System.out.print("Descripción: ");
        String descripcion = scanner.nextLine().trim();

        Categoria cat = new Categoria();
        cat.setNombre(nombre);
        cat.setDescripcion(descripcion);
        cat.setCreatedAt(LocalDateTime.now());
        cat.setEliminado(false);

        cat = categoriaRepo.guardar(cat);
        System.out.println("Categoría creada con éxito. ID asignado: " + cat.getId());
    }

    private static void modificarCategoria() {
        listarCategorias();
        System.out.print("\nIngrese el ID de la categoría a modificar: ");
        Long id = leerLong();

        Optional<Categoria> opt = categoriaRepo.buscarPorId(id);
        if (opt.isEmpty() || opt.get().isEliminado()) {
            System.out.println("Error: No se encontró una categoría activa con ese ID.");
            return;
        }

        Categoria cat = opt.get();
        System.out.println("Valores actuales - Nombre: " + cat.getNombre() + " | Descripción: " + cat.getDescripcion());
        System.out.println("(Deje en blanco para conservar el valor actual)");

        System.out.print("Nuevo nombre: ");
        String nuevoNombre = scanner.nextLine().trim();
        if (!nuevoNombre.isEmpty()) cat.setNombre(nuevoNombre);

        System.out.print("Nueva descripción: ");
        String nuevaDesc = scanner.nextLine().trim();
        if (!nuevaDesc.isEmpty()) cat.setDescripcion(nuevaDesc);

        categoriaRepo.guardar(cat);
        System.out.println("Categoría actualizada correctamente.");
    }

    private static void bajaCategoria() {
        System.out.print("Ingrese el ID de la categoría a dar de baja: ");
        Long id = leerLong();
        Optional<Categoria> opt = categoriaRepo.buscarPorId(id);
        if (opt.isPresent() && !opt.get().isEliminado() && categoriaRepo.eliminarLogico(id)) {
            System.out.println("Se ha dado de baja la categoría: " + opt.get().getNombre());
        } else {
            System.out.println("Error: No existe una categoría activa con ese ID.");
        }
    }

    private static void listarCategorias() {
        List<Categoria> categorias = categoriaRepo.listarActivos();
        if (categorias.isEmpty()) {
            System.out.println("No hay categorías activas.");
            return;
        }
        System.out.println("\n--- Categorías Activas ---");
        for (Categoria c : categorias) {
            System.out.printf("ID: %d | Nombre: %s | Descripción: %s%n", c.getId(), c.getNombre(), c.getDescripcion());
        }
    }

    // ==========================================
    // MENÚ DE PRODUCTOS
    // ==========================================
    private static void menuProductos() {
        int opcion;
        do {
            System.out.println("\n--- Gestión de Productos ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione: ");
            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaProducto();
                case 2 -> modificarProducto();
                case 3 -> bajaProducto();
                case 4 -> listarProductos();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opción inválida.");
            }
        } while (opcion != 0);
    }

    private static void altaProducto() {
        List<Categoria> categorias = categoriaRepo.listarActivos();
        if (categorias.isEmpty()) {
            System.out.println("Error: No hay categorías activas. Debe crear una categoría primero.");
            return;
        }

        listarCategorias();
        System.out.print("\nIngrese el ID de la categoría para el producto: ");
        Long idCat = leerLong();
        Optional<Categoria> catOpt = categoriaRepo.buscarPorId(idCat);

        if (catOpt.isEmpty() || catOpt.get().isEliminado()) {
            System.out.println("Error: Categoría inválida. Operación cancelada.");
            return;
        }

        System.out.print("Nombre del producto: ");
        String nombre = scanner.nextLine().trim();
        if (nombre.isEmpty()) {
            System.out.println("Error: El nombre es obligatorio.");
            return;
        }

        System.out.print("Descripción: ");
        String descripcion = scanner.nextLine().trim();

        System.out.print("Precio: ");
        Double precio = leerDouble();
        if (precio == null || precio <= 0) {
            System.out.println("Error: El precio debe ser mayor a 0.");
            return;
        }

        System.out.print("Stock: ");
        int stock = leerEntero();
        if (stock < 0) {
            System.out.println("Error: El stock no puede ser negativo.");
            return;
        }

        System.out.print("URL Imagen (opcional): ");
        String imagen = scanner.nextLine().trim();

        System.out.print("Disponible (S/N) [S]: ");
        String dispInput = scanner.nextLine().trim().toUpperCase();
        boolean disponible = !dispInput.equals("N");

        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setImagen(imagen);
        p.setDisponible(disponible);
        p.setCreatedAt(LocalDateTime.now());
        p.setEliminado(false);

        // Cumplimos con HU-08 llamando explícitamente a productoRepo
        p = productoRepo.guardar(p);

        // Solucionamos el LazyInitialization vinculando en un contexto activo
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            em.getTransaction().begin();
            Categoria cat = em.find(Categoria.class, idCat);
            Producto prodGuardado = em.find(Producto.class, p.getId());
            cat.getProductos().add(prodGuardado);
            em.getTransaction().commit();
            System.out.println("Producto creado con ID: " + p.getId() + " y asociado a la categoría: " + cat.getNombre());
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            System.out.println("Error al asociar la categoría: " + e.getMessage());
        } finally {
            em.close();
        }
    }
    
    private static void modificarProducto() {
        listarProductos();
        System.out.print("\nIngrese el ID del producto a modificar: ");
        Long id = leerLong();

        Optional<Producto> opt = productoRepo.buscarPorId(id);
        if (opt.isEmpty() || opt.get().isEliminado()) {
            System.out.println("Error: No se encontró un producto activo con ese ID.");
            return;
        }

        Producto p = opt.get();
        System.out.printf("Valores actuales - Nombre: %s | Precio: %.2f | Stock: %d%n", p.getNombre(), p.getPrecio(), p.getStock());
        System.out.println("(Deje en blanco para conservar el valor actual)");

        System.out.print("Nuevo nombre: ");
        String nuevoNombre = scanner.nextLine().trim();
        if (!nuevoNombre.isEmpty()) p.setNombre(nuevoNombre);

        System.out.print("Nuevo precio: ");
        String inputPrecio = scanner.nextLine().trim();
        if (!inputPrecio.isEmpty()) {
            try {
                double nuevoPrecio = Double.parseDouble(inputPrecio);
                if (nuevoPrecio > 0) p.setPrecio(nuevoPrecio);
                else System.out.println("Precio inválido. Se conserva el anterior.");
            } catch (NumberFormatException e) {
                System.out.println("Formato numérico inválido.");
            }
        }

        System.out.print("Nuevo stock: ");
        String inputStock = scanner.nextLine().trim();
        if (!inputStock.isEmpty()) {
            try {
                int nuevoStock = Integer.parseInt(inputStock);
                if (nuevoStock >= 0) p.setStock(nuevoStock);
                else System.out.println("Stock inválido. Se conserva el anterior.");
            } catch (NumberFormatException e) {
                System.out.println("Formato numérico inválido.");
            }
        }

        productoRepo.guardar(p);
        System.out.println("Producto actualizado correctamente.");
    }

    private static void bajaProducto() {
        System.out.print("Ingrese el ID del producto a dar de baja: ");
        Long id = leerLong();
        Optional<Producto> opt = productoRepo.buscarPorId(id);
        if (opt.isPresent() && !opt.get().isEliminado() && productoRepo.eliminarLogico(id)) {
            System.out.println("Se ha dado de baja el producto: " + opt.get().getNombre());
        } else {
            System.out.println("Error: No existe un producto activo con ese ID.");
        }
    }

    private static void listarProductos() {
        List<Producto> productos = productoRepo.listarActivos();
        if (productos.isEmpty()) {
            System.out.println("No hay productos activos.");
            return;
        }

        // Mapeo en memoria resolviendo la unidireccionalidad dentro de una sesión activa
        Map<Long, String> productoCategoriaMap = new HashMap<>();
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            List<Categoria> categorias = em.createQuery("SELECT c FROM Categoria c WHERE c.eliminado = false", Categoria.class).getResultList();
            for (Categoria c : categorias) {
                // Al estar el EntityManager abierto, Hibernate permite cargar la lista LAZY
                for (Producto p : c.getProductos()) {
                    productoCategoriaMap.put(p.getId(), c.getNombre());
                }
            }
        } finally {
            em.close();
        }

        System.out.println("\n--- Productos Activos ---");
        for (Producto p : productos) {
            String nombreCat = productoCategoriaMap.getOrDefault(p.getId(), "Sin categoría");
            String estadoDisp = p.getDisponible() != null && p.getDisponible() ? "Disponible" : "No disponible";
            System.out.printf("ID: %d | Nombre: %s | Precio: %.2f | Stock: %d | Estado: %s | Categoría: %s%n",
                    p.getId(), p.getNombre(), p.getPrecio(), p.getStock(), estadoDisp, nombreCat);
        }
    }

    // ==========================================
    // MENÚ DE USUARIOS
    // ==========================================
    private static void menuUsuarios() {
        int opcion;
        do {
            System.out.println("\n--- Gestión de Usuarios ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("5. Buscar por mail");
            System.out.println("0. Volver");
            System.out.print("Seleccione: ");
            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaUsuario();
                case 2 -> modificarUsuario();
                case 3 -> bajaUsuario();
                case 4 -> listarUsuarios();
                case 5 -> buscarUsuarioPorMail();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opción inválida.");
            }
        } while (opcion != 0);
    }

    private static void altaUsuario() {
        System.out.print("Nombre: ");
        String nombre = scanner.nextLine().trim();
        System.out.print("Apellido: ");
        String apellido = scanner.nextLine().trim();
        System.out.print("Mail: ");
        String mail = scanner.nextLine().trim();

        if (usuarioRepo.buscarPorMail(mail).isPresent()) {
            System.out.println("Error: Ya existe un usuario activo con ese mail.");
            return;
        }

        System.out.print("Celular (opcional): ");
        String celular = scanner.nextLine().trim();
        System.out.print("Contraseña: ");
        String contrasena = scanner.nextLine().trim();
        
        System.out.println("Rol (1. ADMIN / 2. USUARIO): ");
        Rol rol = (leerEntero() == 1) ? Rol.ADMIN : Rol.USUARIO;

        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setApellido(apellido);
        u.setMail(mail);
        u.setCelular(celular);
        u.setContrasena(contrasena);
        u.setRol(rol);
        u.setCreatedAt(LocalDateTime.now());
        u.setEliminado(false);

        u = usuarioRepo.guardar(u);
        System.out.println("Usuario creado con éxito. ID: " + u.getId());
    }

    private static void modificarUsuario() {
        listarUsuarios();
        System.out.print("\nIngrese ID del usuario a modificar: ");
        Long id = leerLong();

        Optional<Usuario> opt = usuarioRepo.buscarPorId(id);
        if (opt.isEmpty() || opt.get().isEliminado()) {
            System.out.println("Error: No se encontró usuario activo con ese ID.");
            return;
        }

        Usuario u = opt.get();
        System.out.println("(Deje en blanco para conservar el valor actual)");

        System.out.print("Nuevo nombre (" + u.getNombre() + "): ");
        String nombre = scanner.nextLine().trim();
        if (!nombre.isEmpty()) u.setNombre(nombre);

        System.out.print("Nuevo apellido (" + u.getApellido() + "): ");
        String apellido = scanner.nextLine().trim();
        if (!apellido.isEmpty()) u.setApellido(apellido);

        System.out.print("Nuevo mail (" + u.getMail() + "): ");
        String mail = scanner.nextLine().trim();
        if (!mail.isEmpty() && !mail.equals(u.getMail())) {
            if (usuarioRepo.buscarPorMail(mail).isPresent()) {
                System.out.println("Error: El mail ya está en uso. Se conserva el anterior.");
            } else {
                u.setMail(mail);
            }
        }

        System.out.print("Nuevo celular: ");
        String celular = scanner.nextLine().trim();
        if (!celular.isEmpty()) u.setCelular(celular);

        System.out.print("Nueva contraseña: ");
        String pass = scanner.nextLine().trim();
        if (!pass.isEmpty()) u.setContrasena(pass);

        usuarioRepo.guardar(u);
        System.out.println("Usuario actualizado correctamente.");
    }

    private static void bajaUsuario() {
        System.out.print("Ingrese ID del usuario a dar de baja: ");
        Long id = leerLong();
        Optional<Usuario> opt = usuarioRepo.buscarPorId(id);
        if (opt.isPresent() && !opt.get().isEliminado() && usuarioRepo.eliminarLogico(id)) {
            System.out.println("Se ha dado de baja a: " + opt.get().getNombre() + " " + opt.get().getApellido());
        } else {
            System.out.println("Error: No existe usuario activo con ese ID.");
        }
    }

    private static void listarUsuarios() {
        List<Usuario> usuarios = usuarioRepo.listarActivos();
        if (usuarios.isEmpty()) {
            System.out.println("No hay usuarios activos.");
            return;
        }
        System.out.println("\n--- Usuarios Activos ---");
        for (Usuario u : usuarios) {
            System.out.printf("ID: %d | Nombre: %s %s | Mail: %s | Rol: %s%n", 
                    u.getId(), u.getNombre(), u.getApellido(), u.getMail(), u.getRol());
        }
    }

    private static void buscarUsuarioPorMail() {
        System.out.print("Ingrese el mail a buscar: ");
        String mail = scanner.nextLine().trim();
        Optional<Usuario> opt = usuarioRepo.buscarPorMail(mail);
        
        if (opt.isPresent()) {
            Usuario u = opt.get();
            System.out.println("\n--- Datos del Usuario ---");
            System.out.printf("ID: %d | Nombre: %s %s | Mail: %s | Celular: %s | Rol: %s%n",
                    u.getId(), u.getNombre(), u.getApellido(), u.getMail(), u.getCelular(), u.getRol());
        } else {
            System.out.println("No existe usuario activo con ese mail.");
        }
    }

    // ==========================================
    // MENÚ DE PEDIDOS
    // ==========================================
    private static void menuPedidos() {
        int opcion;
        do {
            System.out.println("\n--- Gestión de Pedidos ---");
            System.out.println("1. Alta de pedido");
            System.out.println("2. Cambiar estado");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("5. Pedidos por usuario");
            System.out.println("6. Pedidos por estado");
            System.out.println("0. Volver");
            System.out.print("Seleccione: ");
            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaPedido();
                case 2 -> cambiarEstadoPedido();
                case 3 -> bajaPedido();
                case 4 -> listarPedidos();
                case 5 -> listarPedidosPorUsuario();
                case 6 -> listarPedidosPorEstado();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opción inválida.");
            }
        } while (opcion != 0);
    }

    private static void altaPedido() {
        List<Usuario> usuarios = usuarioRepo.listarActivos();
        if (usuarios.isEmpty()) {
            System.out.println("Error: No hay usuarios activos en el sistema.");
            return;
        }

        listarUsuarios();
        System.out.print("\nID del Usuario: ");
        Long idUsuario = leerLong();

        System.out.println("Forma de pago (1. TARJETA, 2. TRANSFERENCIA, 3. EFECTIVO): ");
        int fpOpcion = leerEntero();
        FormaPago formaPago = switch (fpOpcion) {
            case 1 -> FormaPago.TARJETA;
            case 2 -> FormaPago.TRANSFERENCIA;
            default -> FormaPago.EFECTIVO;
        };

        Map<Long, Integer> carritoTemporal = new HashMap<>();
        boolean agregarMas = true;

        while (agregarMas) {
            listarProductos();
            System.out.print("\nID del Producto a agregar: ");
            Long idProd = leerLong();
            
            Optional<Producto> optProd = productoRepo.buscarPorId(idProd);
            if (optProd.isEmpty() || optProd.get().isEliminado() || !optProd.get().getDisponible()) {
                System.out.println("Error: Producto inválido o no disponible.");
            } else {
                Producto prod = optProd.get();
                System.out.print("Cantidad: ");
                int cantidad = leerEntero();
                
                if (cantidad <= 0) {
                    System.out.println("Cantidad inválida.");
                } else if (prod.getStock() < cantidad) {
                    System.out.println("Error: Stock insuficiente. Stock disponible: " + prod.getStock());
                } else {
                    carritoTemporal.put(idProd, carritoTemporal.getOrDefault(idProd, 0) + cantidad);
                    System.out.println("Producto agregado al carrito temporal.");
                }
            }

            System.out.print("¿Desea agregar otro producto? (S/N): ");
            agregarMas = scanner.nextLine().trim().equalsIgnoreCase("S");
        }

        if (carritoTemporal.isEmpty()) {
            System.out.println("El pedido debe tener al menos un detalle. Operación cancelada.");
            return;
        }

        procesarTransaccionPedido(idUsuario, formaPago, carritoTemporal);
    }

    private static void procesarTransaccionPedido(Long idUsuario, FormaPago formaPago, Map<Long, Integer> carritoTemporal) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            em.getTransaction().begin();
            
            Usuario usuario = em.find(Usuario.class, idUsuario);
            if (usuario == null || usuario.isEliminado()) {
                throw new RuntimeException("Usuario inválido.");
            }

            Pedido pedido = new Pedido();
            pedido.setFecha(LocalDate.now());
            pedido.setEstado(Estado.PENDIENTE);
            pedido.setFormaPago(formaPago);
            pedido.setCreatedAt(LocalDateTime.now());
            pedido.setEliminado(false);

            for (Map.Entry<Long, Integer> entry : carritoTemporal.entrySet()) {
                Producto prod = em.find(Producto.class, entry.getKey());
                int cantidadAComprar = entry.getValue();

                if (prod.getStock() < cantidadAComprar) {
                    throw new RuntimeException("Stock insuficiente para el producto: " + prod.getNombre());
                }

                prod.setStock(prod.getStock() - cantidadAComprar);
                if (prod.getStock() == 0) {
                    prod.setDisponible(false);
                }
                
                pedido.addDetallePedido(cantidadAComprar, prod);
            }

            pedido.calcularTotal();
            
            em.persist(pedido);
            usuario.getPedidos().add(pedido);

            em.getTransaction().commit();

            System.out.println("\n--- Pedido Confirmado ---");
            System.out.println("ID Generado: " + pedido.getId());
            System.out.println("Fecha: " + pedido.getFecha());
            System.out.println("Usuario: " + usuario.getNombre() + " " + usuario.getApellido());
            System.out.println("Forma de Pago: " + pedido.getFormaPago());
            for (DetallePedido dp : pedido.getDetalles()) {
                System.out.printf("%d x %s - Subtotal: $%.2f%n", dp.getCantidad(), dp.getProducto().getNombre(), dp.getSubtotal());
            }
            System.out.printf("Total del Pedido: $%.2f%n", pedido.getTotal());

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            System.out.println("Transacción revertida por error: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    private static void cambiarEstadoPedido() {
        System.out.print("ID del Pedido: ");
        Long id = leerLong();
        Optional<Pedido> opt = pedidoRepo.buscarPorId(id);
        if (opt.isEmpty() || opt.get().isEliminado()) {
            System.out.println("Error: Pedido no encontrado o dado de baja.");
            return;
        }

        Pedido p = opt.get();
        System.out.println("Estado actual: " + p.getEstado());
        System.out.println("Seleccione nuevo estado: 1. PENDIENTE, 2. CONFIRMADO, 3. TERMINADO, 4. CANCELADO");
        int estOp = leerEntero();
        Estado nuevoEstado = switch (estOp) {
            case 2 -> Estado.CONFIRMADO;
            case 3 -> Estado.TERMINADO;
            case 4 -> Estado.CANCELADO;
            default -> Estado.PENDIENTE;
        };

        p.setEstado(nuevoEstado);
        pedidoRepo.guardar(p);
        System.out.println("Estado actualizado. ID: " + p.getId() + " | Nuevo Estado: " + p.getEstado());
    }

    private static void bajaPedido() {
        System.out.print("Ingrese ID del pedido a dar de baja: ");
        Long id = leerLong();
        Optional<Pedido> opt = pedidoRepo.buscarPorId(id);
        
        if (opt.isPresent() && !opt.get().isEliminado() && pedidoRepo.eliminarLogico(id)) {
            System.out.printf("Pedido %d dado de baja. Total: $%.2f%n", id, opt.get().getTotal());
        } else {
            System.out.println("Error: No existe pedido activo con ese ID.");
        }
    }

    private static void listarPedidos() {
        List<Pedido> pedidos = pedidoRepo.listarActivos();
        if (pedidos.isEmpty()) {
            System.out.println("No hay pedidos activos.");
            return;
        }

        // Mapeo inverso para mostrar nombre de usuario
        Map<Long, String> pedidoUsuarioMap = new HashMap<>();
        for (Usuario u : usuarioRepo.listarActivos()) {
            for (Pedido p : u.getPedidos()) {
                pedidoUsuarioMap.put(p.getId(), u.getNombre() + " " + u.getApellido());
            }
        }

        System.out.println("\n--- Pedidos Activos ---");
        for (Pedido p : pedidos) {
            String nomUsuario = pedidoUsuarioMap.getOrDefault(p.getId(), "Desconocido");
            System.out.printf("ID: %d | Fecha: %s | Estado: %s | Pago: %s | Usuario: %s | Total: $%.2f%n",
                    p.getId(), p.getFecha(), p.getEstado(), p.getFormaPago(), nomUsuario, p.getTotal());
        }
    }

    private static void listarPedidosPorUsuario() {
        listarUsuarios();
        System.out.print("\nID del Usuario: ");
        Long idUsu = leerLong();
        List<Pedido> pedidos = pedidoRepo.buscarPorUsuario(idUsu);
        
        if (pedidos.isEmpty()) {
            System.out.println("Este usuario no tiene pedidos activos.");
            return;
        }
        System.out.println("\n--- Pedidos del Usuario ---");
        for (Pedido p : pedidos) {
            System.out.printf("ID: %d | Fecha: %s | Estado: %s | Total: $%.2f%n", p.getId(), p.getFecha(), p.getEstado(), p.getTotal());
        }
    }

    private static void listarPedidosPorEstado() {
        System.out.println("Estado a filtrar (1. PENDIENTE, 2. CONFIRMADO, 3. TERMINADO, 4. CANCELADO): ");
        int op = leerEntero();
        Estado est = switch (op) {
            case 2 -> Estado.CONFIRMADO;
            case 3 -> Estado.TERMINADO;
            case 4 -> Estado.CANCELADO;
            default -> Estado.PENDIENTE;
        };

        List<Pedido> pedidos = pedidoRepo.buscarPorEstado(est);
        if (pedidos.isEmpty()) {
            System.out.println("No hay pedidos con ese estado.");
            return;
        }

        Map<Long, String> pedidoUsuarioMap = new HashMap<>();
        for (Usuario u : usuarioRepo.listarActivos()) {
            for (Pedido p : u.getPedidos()) {
                pedidoUsuarioMap.put(p.getId(), u.getNombre() + " " + u.getApellido());
            }
        }

        System.out.println("\n--- Pedidos en estado " + est + " ---");
        for (Pedido p : pedidos) {
            String nomUsu = pedidoUsuarioMap.getOrDefault(p.getId(), "Desconocido");
            System.out.printf("ID: %d | Fecha: %s | Usuario: %s | Total: $%.2f%n", p.getId(), p.getFecha(), nomUsu, p.getTotal());
        }
    }

    // ==========================================
    // MENÚ DE REPORTES
    // ==========================================
    private static void menuReportes() {
        System.out.println("\n--- Reportes ---");
        System.out.println("1. Productos por categoría");
        System.out.println("2. Pedidos por usuario");
        System.out.println("3. Pedidos por estado");
        System.out.println("4. Total facturado");
        System.out.println("0. Volver");
        System.out.print("Seleccione: ");
        
        switch (leerEntero()) {
            case 1 -> listarProductosPorCategoria();
            case 2 -> listarPedidosPorUsuario();
            case 3 -> listarPedidosPorEstado();
            case 4 -> calcularTotalFacturado();
            case 0 -> System.out.println("Volviendo...");
            default -> System.out.println("Opción inválida.");
        }
    }

    private static void listarProductosPorCategoria() {
        listarCategorias();
        System.out.print("\nIngrese el ID de la categoría a consultar: ");
        Long idCat = leerLong();
        List<Producto> productos = productoRepo.buscarPorCategoria(idCat);

        if (productos.isEmpty()) {
            System.out.println("Esta categoría no contiene productos activos.");
        } else {
            System.out.println("\n--- Productos de la categoría seleccionada ---");
            for (Producto p : productos) {
                System.out.printf("ID: %d | Nombre: %s | Precio: %.2f | Stock: %d%n", p.getId(), p.getNombre(), p.getPrecio(), p.getStock());
            }
        }
    }

    private static void calcularTotalFacturado() {
        List<Pedido> terminados = pedidoRepo.buscarPorEstado(Estado.TERMINADO);
        double totalFacturado = terminados.stream()
                .filter(p -> p.getTotal() != null)
                .mapToDouble(Pedido::getTotal)
                .sum();
        System.out.println(String.format(Locale.US, "Total facturado: $%.2f", totalFacturado));
    }

    // ==========================================
    // MÉTODOS AUXILIARES
    // ==========================================
    private static int leerEntero() {
        try { return Integer.parseInt(scanner.nextLine().trim()); } 
        catch (NumberFormatException e) { return -1; }
    }

    private static Long leerLong() {
        try { return Long.parseLong(scanner.nextLine().trim()); } 
        catch (NumberFormatException e) { return -1L; }
    }

    private static Double leerDouble() {
        try { return Double.parseDouble(scanner.nextLine().trim()); } 
        catch (NumberFormatException e) { return null; }
    }
}