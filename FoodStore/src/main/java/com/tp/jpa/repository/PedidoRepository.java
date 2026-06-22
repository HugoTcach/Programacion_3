package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }

    public List<Pedido> buscarPorUsuario(Long idUsuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            // Consulta JPQL: retorna todos los pedidos activos de un usuario dado su ID
            // Filtra por eliminado = false para excluir pedidos dados de baja lógica
            String jpql = "SELECT p FROM Usuario u JOIN u.pedidos p WHERE u.id = :uid AND p.eliminado = false";
            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("uid", idUsuario);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Pedido> buscarPorEstado(Estado estado) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            // Consulta JPQL: retorna todos los pedidos activos con un estado especifico
            // Útil para filtrar PENDIENTE, CONFIRMADO, TERMINADO o CANCELADO
            String jpql = "SELECT p FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false";
            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("estado", estado);
            return query.getResultList();
        } finally {
            em.close();
        }
    }
}