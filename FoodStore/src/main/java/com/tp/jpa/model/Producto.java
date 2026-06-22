package com.tp.jpa.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto extends Base {

    private String nombre;
    private Double precio;
    private String descripcion;
    private int stock;
    private String imagen;
    private Boolean disponible;
}