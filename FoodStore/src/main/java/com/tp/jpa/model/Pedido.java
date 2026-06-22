package com.tp.jpa.model;

import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido extends Base implements Calculable {

    private LocalDate fecha;
    private Estado estado;
    private Double total;
    private FormaPago formaPago;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Set<DetallePedido> detalles = new HashSet<>();

    public void addDetallePedido(int cantidad, Producto producto) {
        DetallePedido detalle = new DetallePedido();
        detalle.setCantidad(cantidad);
        detalle.setProducto(producto);
        detalle.setSubtotal(producto.getPrecio() * cantidad);
        this.detalles.add(detalle);
    }

    @Override
    public void calcularTotal() {
        double suma = 0.0;
        if (detalles != null) {
            for (DetallePedido dp : detalles) {
                if (dp.getSubtotal() != null) {
                    suma += dp.getSubtotal();
                }
            }
        }
        this.total = suma;
    }
}