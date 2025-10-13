import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Sobre } from './pages/sobre/sobre';
import { Carrinho } from './pages/carrinho/carrinho';
import { ProdutoForm } from './components/form/produto-form/produto-form';
import { BuscaCategorias } from './pages/busca-categorias/busca-categorias';
import { ProdutoDetalhes } from './components/produto-detalhes/produto-detalhes';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'sobre', component: Sobre },
  { path: 'categorias', component: BuscaCategorias },
  { path: 'carrinho', component: Carrinho },
  { path: 'cadastroProduto', component: ProdutoForm },
  { path: 'produto/:id', component: ProdutoDetalhes },
  { path: '**', redirectTo: 'home' }
];