import { Routes } from '@angular/router';
import { userGuard } from './features/guard/user.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/components/login.component'),
  },
  {
    path: 'challenges',
    loadComponent: ()=>import('./features/challenge/components/challenge-list.component'),
  }, // Public challenges
  {
    path: 'admin',
    loadComponent: () => import('./features/login/components/admin.component'),
    canActivate: [userGuard],
  },
  { path: '**', redirectTo: 'login' }, // Redirect unknown routes
];
