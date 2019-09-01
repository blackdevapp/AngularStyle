import { Injectable } from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
@Injectable()
export class ServerService extends ServiceBase2{
  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }
  getLogs(name){
    return this.getService(`/user/server/logs/${name}`);

  }


}
