package com.tp.jpa.util;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JPAUtil {
    private static final EntityManagerFactory emf = buildEntityManagerFactory();

    private static EntityManagerFactory buildEntityManagerFactory() {
        try {
            return Persistence.createEntityManagerFactory("miUnidad");
        } catch (Throwable ex) {
            System.err.println("Error al inicializar EntityManagerFactory: " + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    public static void close() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}