import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AddStockComponent } from './components/stock/add-stock/add-stock.component';
import { DetailStockComponent } from './components/stock/detail-stock/detail-stock.component';
import { EditStockComponent } from './components/stock/edit-stock/edit-stock.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ListStockComponent } from './components/stock/list-stock/list-stock.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'stock-list', component: ListStockComponent, canActivate: [authGuard] },
  { path: 'add-stock', component: AddStockComponent, canActivate: [authGuard] }, 
  { path: 'stock-detail/:id', component: DetailStockComponent, canActivate: [authGuard] },
  { path: 'edit-stock/:id', component: EditStockComponent, canActivate: [authGuard] },
  // { path: '**', component: NotFoundComponent },
];
