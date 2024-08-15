import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   const currentUser = this.authService.currentUserValue;
  //   if (currentUser) {
  //     // Gebruiker is ingelogd
  //     return true;
  //   }
  //
  //   // Gebruiker is niet ingelogd, redirect naar login pagina met de return url
  //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  //   return false;
  // }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
