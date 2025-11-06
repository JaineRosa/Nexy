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
export class Banner  implements OnInit {
  produtosDestaque: Produto[] = [];
imagensBanner: string[] = [
    '/img/banner1.png',
    '/img/banner2.png',
    '/img/banner3.png',
    '/img/banner4.png'
  ];
  imagemAtual: string = this.imagensBanner[0];
  indiceAtual: number = 0;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.listarTodos().subscribe({
      next: (produtos) => {
        this.produtosDestaque = produtos.filter(p => p.estoque > 0).slice(0, 3);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos para o banner:', err);
      }
    });

    setInterval(() => {
      this.indiceAtual = (this.indiceAtual + 1) % this.imagensBanner.length;
      this.imagemAtual = this.imagensBanner[this.indiceAtual];
    }, 5000);
  }
}
