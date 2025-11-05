import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedidoService';
import { Pedido } from '../../interfaces/Pedido';

@Component({
  selector: 'app-pedido-detalhes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pedido-detalhes.html',
  styleUrl: './pedido-detalhes.css'
})
export class PedidoDetalhes implements OnInit {

  pedido: Pedido | null = null;
  carregando = true;
  erro = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.pedidoService.buscarPorId(Number(id)).subscribe({
        next: (pedidoEncontrado) => {
           console.log('Pedido recebido do backend:', pedidoEncontrado);
          // Esta é a sua correção da data (ótimo!)
          const dataArray = pedidoEncontrado.dataPedido as any as number[];

          pedidoEncontrado.dataPedido = new Date(
            dataArray[0],      // Ano
            dataArray[1] - 1,  // Mês (base 0)
            dataArray[2],      // Dia
            dataArray[3],      // Hora
            dataArray[4],      // Minuto
            dataArray[5]       // Segundo
          );

          this.pedido = pedidoEncontrado;
          this.carregando = false;
        },
        error: (err) => {
          console.error("Erro ao buscar detalhes do pedido:", err);
          this.carregando = false;
          this.erro = true;
        }
      });

    }
  }
}