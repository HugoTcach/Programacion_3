package com.tp.jpa.model;

import com.tp.jpa.model.enums.Rol;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario extends Base {

    private String nombre;
    private String apellido;
    
    @Column(unique = true)
    private String mail;
    
    private String celular;
    private String contrasena;
    private Rol rol;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Set<Pedido> pedidos = new HashSet<>();
}