import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Banner } from "../../components/banner/banner";
import { Cards } from "../../components/cards-produto/cards";
import { Produto } from '../../interfaces/Produto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Cards, FormsModule, Banner],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
 produtos: Produto[] = [
    {
      id: 1,
      nome: 'Smartphone Galaxy S21',
      descricao: 'Smartphone com câmera tripla e tela AMOLED.',
      estoque: 10,
      preco: 2999.99,
      peso: 0.5,
      altura: 15,
      largura: 7,
      imagens: [
        { url: '/img/s21-1.jpg', id: 1 },
        { url: '/img/s21-2.jpg', id: 2 }
      ],
      categoria: {
        id: 1,
        nome: 'Smartphones'
      }
    },
    {
      id: 2,
      nome: 'Notebook Dell Inspiron',
      descricao: 'Notebook potente para trabalho e estudo.',
      estoque: 5,
      preco: 4599.99,
      peso: 2.2,
      altura: 2,
      largura: 35,
      imagens: [],
      categoria: {
        id: 2,
        nome: 'Notebooks'
      }
    }
  ];
  categorias = ['Smartphones', 'Notebooks', 'Acessórios'];
  precoMin = 0;
  precoMax = 10000;
}