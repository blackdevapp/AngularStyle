import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable()
export class AuthGuardEncoder implements CanActivate {

  constructor(public auth: AuthService, private router: Router) {}

  canActivate() {
    console.log('rooooooole',this.auth.getRole()==='encoder')
    return this.auth.getRole()==='encoder';
  }

}
