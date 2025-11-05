import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Produto } from '../../interfaces/Produto';
import { ProdutoService } from '../../services/produtoService';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrl: './banner.css'
})
export class Banner implements OnInit {
  produtosDestaque: Produto[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.listarTodos().subscribe({
      next: (produtos) => {
        // Aqui você pode aplicar lógica para selecionar os produtos em destaque
        this.produtosDestaque = produtos
          .filter(p => p.estoque > 0)
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos para o banner:', err);
      }
    });
  }
}