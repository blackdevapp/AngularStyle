import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Memory} from "../../base/memory";
import {UserService} from "../user.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService,public userService:UserService,private router: Router,private jwtHelper: JwtHelperService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role=this.auth.getRole();
    if (role&&Memory.getToken()&& !this.jwtHelper.isTokenExpired(Memory.getToken())) {
      if (route.data.roles && route.data.roles.indexOf(role) === -1) {
        this.router.navigate(['/logout'], { queryParams: { returnUrl: state.url }});
        return false;
      }
      return true;
    }else if(this.jwtHelper.isTokenExpired(Memory.getToken())){
      this.userService.refreshToken().subscribe((res:any)=>{
        Memory.setToken(res.token)
      })
      return true

    }


    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }


}
