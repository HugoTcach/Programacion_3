# Food Store - Sistema de Gestión de Pedidos de Comida

Proyecto final (Fase 1) para la materia Programación 3. Sistema de comercio electrónico enfocado en la gestión de categorías, productos y pedidos, dividido en dos capas independientes: una aplicación de consola en Java para la gestión de base de datos relacional y una Single Page Application (SPA) para la interfaz web.

## 🔗 Enlaces de Entrega

* **Video Demostración:** https://drive.google.com/file/d/1rIA8YPCzLNVNLiIr6cCBkrndOiPqs2uW/view?usp=sharing
* **Documentación Técnica:** https://github.com/HugoTcach/Programacion_3.git

## 🛠 Tecnologías Utilizadas

**Frontend:**
* TypeScript
* Vite
* HTML5 & CSS3
* LocalStorage (Persistencia temporal de estado y sesión)

**Backend:**
* Java 23
* JPA / Hibernate
* H2 Database Engine (Modo archivo local)
* Gradle

## ⚙️ Requisitos Previos

* [Node.js](https://nodejs.org/) (v18 o superior)
* [Java Development Kit (JDK) 23](https://jdk.java.net/23/)
* IDE compatible con proyectos Gradle (IntelliJ IDEA, Eclipse o VS Code).

## 🚀 Instalación y Ejecución

El proyecto consta de dos módulos que operan de forma independiente en esta fase.

### 1. Backend (Consola Java y Base de Datos)
La capa de persistencia utiliza H2 en modo archivo. La base de datos se autoconfigurará y el archivo físico se generará en el directorio `./data/jpa_db` al inicializar la aplicación.

**Pasos de ejecución:**
1. Abrir la carpeta raíz del backend (`FoodStore`) en el IDE.
2. Permitir que el IDE sincronice las dependencias definidas en el archivo `build.gradle`.
3. Ejecutar la clase principal ubicada en `src/main/java/com/tp/jpa/Main.java`.
4. El sistema inicializará el `EntityManagerFactory` a través de Hibernate, actualizará el esquema de datos y desplegará el menú interactivo en la consola del sistema.

### 2. Frontend (Cliente Web)
La interfaz web es una SPA construida con módulos ES nativos.

**Pasos de ejecución:**
1. Abrir una terminal y navegar hasta la carpeta del frontend (`foodstore-frontend`).
2. Instalar las dependencias del empaquetador ejecutando:
   ```bash
   npm install
