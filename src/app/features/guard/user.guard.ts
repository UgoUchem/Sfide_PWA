import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  const username = localStorage.getItem('username');
  if (username === 'admin') {
    return true;
  } else {
    console.warn("Unauthorized access. Redirecting...");
    const router = inject(Router);
    router.navigate(['/challenges']);
    return false;
  }
};
