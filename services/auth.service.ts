
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { User } from '../shared/models/user.model';


import {Memory} from "../base/memory";

@Injectable()
export class AuthService {
  loggedIn: boolean = false;
  // isAdmin: boolean = false;
  // isUser: boolean = false;
  // isAgent: boolean = false;
  // isEncoder: boolean = false;
  role:string;
  firstLogin: boolean = true;

  currentUser: User = new User();

  constructor(private userService: UserService,
              private router: Router,
              private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('nj.token');
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      this.setCurrentUser(decodedUser);
    }
  }

  login(emailAndPassword) {
    return this.userService.login(emailAndPassword).pipe(map(
      (res:any) => {
        localStorage.setItem('nj.token', res.token);
        localStorage.setItem('nj.user_id', res.user_id);
        const decodedUser = this.decodeUserFromToken(res.token);
        let role=decodedUser.role
        if (decodedUser.associated_agency)
          localStorage.setItem('nj.associated_agency', decodedUser.associated_agency);
        if(res.agency){
          Memory.setActiveCurrency(res.agency.config.currency)
          if(res.agency.permissions){
              Memory.setPermission(res.agency.permissions)
          }
        }
        this.setCurrentUser(decodedUser);
        return role;
      }
    ));
  }
  loginQrCode(cipherText) {
    return this.userService.loginWithQr(cipherText).pipe(map(
      (res:any) => {
        localStorage.setItem('nj.token', res.token);
        localStorage.setItem('nj.user_id', res.user_id);
        const decodedUser = this.decodeUserFromToken(res.token);
        let role=decodedUser.role
        if (decodedUser.associated_agency)
          localStorage.setItem('nj.associated_agency', decodedUser.associated_agency);
        if(res.agency){
          Memory.setActiveCurrency(res.agency.config.currency)
        }
        this.setCurrentUser(decodedUser);
        return role;
      }
    ));

  }

  loginWithToken(token) {
        localStorage.setItem('nj.token', token);
    const decodedUser = this.decodeUserFromToken(token);
    localStorage.setItem('nj.user_id', decodedUser._id);
        localStorage.setItem('nj.associated_agency', decodedUser.associated_agency);

        this.setCurrentUser(decodedUser);
        return this.loggedIn;
  }



  forgetPass(email,params?) {
    return this.userService.forgetPass({email:email},params).pipe(map(
      res => {
        console.log(res);
        return res;

      }
    ));
  }

  logout() {
    localStorage.removeItem('nj.token');
    localStorage.removeItem('nj.user_id');
    localStorage.removeItem('nj.agency_id');
    this.loggedIn = false;
    this.role = '';
    this.currentUser = new User();
    this.router.navigate(['login']);
  }
  logout1() {
    localStorage.removeItem('nj.token');
    localStorage.removeItem('nj.user_id');
    localStorage.removeItem('nj.agency_id');
    this.loggedIn = false;
    this.role = '';
    this.currentUser = new User();
    // this.router.navigate(['login']);
  }

  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).user;
  }
  isValidToken() {
    if(this.loggedIn){
      let token=localStorage.getItem('nj.token');
      if(this.jwtHelper.isTokenExpired(token)){
        this.loggedIn=false;
        return false;
      }else {
        this.loggedIn=true;
        return true;

      }
    }else return false;



    // return this.jwtHelper.decodeToken(token).user;
  }
  setFirstLogin(){
    this.firstLogin = true;
  }
  getFirstLogin(){
    return this.firstLogin
  }
  setCurrentUser(decodedUser) {
    this.loggedIn = true;
    // if (this.currentUser._id) {
      this.currentUser._id = decodedUser._id;
      this.currentUser.username = decodedUser.username;
      this.currentUser.role = decodedUser.role;
      this.role=decodedUser.role;

      delete decodedUser.role;
    // }else{
    //   this.logout();
    // }
  }
  getRole(){
    const decodedUser = this.decodeUserFromToken(localStorage.getItem('nj.token'));
    return decodedUser.role;
  }

}
