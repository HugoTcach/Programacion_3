import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/auth/login/index.html'),
        home: resolve(__dirname, 'src/pages/store/home/index.html'),
        productDetail: resolve(__dirname, 'src/pages/store/productDetail/index.html'),
        cart: resolve(__dirname, 'src/pages/store/cart/index.html'),
        ordersClient: resolve(__dirname, 'src/pages/client/orders/index.html'),
        adminHome: resolve(__dirname, 'src/pages/admin/adminHome/index.html'),
        categories: resolve(__dirname, 'src/pages/admin/categories/index.html'),
        products: resolve(__dirname, 'src/pages/admin/products/index.html'),
        ordersAdmin: resolve(__dirname, 'src/pages/admin/orders/index.html'),
      }
    }
  }
});