import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { ArticleList } from './features/articles/article-list/article-list';
import { ArticleCreate } from './features/articles/article-create/article-create';
import { ArticleEdit } from './features/articles/article-edit/article-edit';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'articles',
    component: ArticleList,
    canActivate: [authGuard],
  },
  {
    path: 'articles/create',
    component: ArticleCreate,
    canActivate: [authGuard],
  },
  {
    path: 'articles/edit/:id',
    component: ArticleEdit,
    canActivate: [authGuard],
  },
  {
    path: 'articles/detail/:id',
    loadComponent: () =>
      import('./features/articles/article-detail/article-detail').then((m) => m.ArticleDetail),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
