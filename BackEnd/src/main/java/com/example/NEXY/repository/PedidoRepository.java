package com.example.NEXY.repository;

import com.example.NEXY.model.Cliente;
import com.example.NEXY.model.Endereco;
import com.example.NEXY.model.Pedido;
import jakarta.persistence.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteId(Long clienteId);
    List<Pedido> findAllByOrderByDataPedidoDesc();
    Optional<Pedido> findByOrderId(String  orderId);

    @Query("SELECT p FROM Pedido p " +
            "LEFT JOIN FETCH p.itens " +
            "LEFT JOIN FETCH p.endereco " +
            "WHERE p.id = :id")
    Optional<Pedido> findByIdCompleto(@Param("id") Long id);

}
