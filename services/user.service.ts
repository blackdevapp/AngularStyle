import { Injectable } from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../shared/models/user.model';
import {Company} from "../auth/company/company.component";
import {Memory} from "../base/memory";
import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
@Injectable()
export class UserService extends ServiceBase2{
  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }

  registerCompany(user: Company) {
    return this.postServiceF(`company`, user);
  }
  registerVan(user) {
    return this.postServiceF(`van`, user);
  }

  refreshToken(){
    return this.getService('refreshToken')
  }
  register(user: User,returnUrl){
    user.role='user';
    return this.postServiceF(`user${returnUrl?'?returnUrl='+returnUrl:''}`, user);
  }

  login(credentials) {
    return this.postServiceF(`login?mode=userPass`, credentials);
  }
  loginWithQr(credentials) {
    return this.postServiceF(`login?mode=cipher`, {cipherText:credentials});
  }
  forgetPass(credentials,params?) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json');
    return this._HttpClient.post(`${Memory.getUrl()}${this._objectName}change-password`, credentials,{params:params,headers:headers});
  }

  getUsers(){
    return this.getService(`users`);
  }

  countUsers(){
    return this.getServiceF('users/count');
  }

  addUser(user: User) {
    return this.postServiceF('user', user);
  }
  deleteMultipleUsers(data){
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization',Memory.getToken());
    return this._HttpClient.put(`${Memory.getUrl()}${this._objectName}user/multiple`,data,{headers:headers,responseType: 'text'})
  }

  addEmployee(user: User,agencyId:string) {
    return this.postServiceF('user', user);
  }

  getUser(user: User) {
    return this.getServiceF(`user/${user._id}`);
  }
  getUserById(id) {
    return this.getServiceF(`user/${id}`);
  }



  fbRegister() {
    return this.getServiceF(`auth/facebook`);
  }



  getUserMultiple(user: any) {

    return this.postService(`user/multiple`,user);
  }



  editUser(user: User) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json');
      // .set('Authorization',Memory.getToken());
    return this._HttpClient.put(`${Memory.getUrl()}${this._objectName}user/${user._id}`, user, {headers:headers, responseType: 'text' });
  }

  getAutoComplete(user: String) {
    return this.getServiceF(`user/search/${user}`);
  }

  checkUserExist(email){
    return this.getServiceF(`user/check?email=${email}`);

  }

  getCompanyList(name){
    return this.getServiceF(`external/cc/search?company_name=${name}`);

  }
  setCompanyName(user){

    return this.putService(`user/company/name`,user);
  }
  getAgencyConfig(){
    return this.getService(`agency/config?agency_id=${Memory.agencyId}`);

  }


}
