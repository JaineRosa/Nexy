import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Banner } from "../../components/banner/banner";
import { Cards } from "../../components/cards-produto/cards";
import { Produto } from '../../interfaces/Produto';
import { FormsModule } from '@angular/forms';
import { BuscaCategorias } from "../busca-categorias/busca-categorias";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Cards, FormsModule, Banner, BuscaCategorias],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
 produtos: Produto[] = [];
}