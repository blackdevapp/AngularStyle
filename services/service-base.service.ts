// import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import {Headers, Http, RequestOptions} from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Memory} from "../base/memory";

// @Injectable()
export class ServiceBase {
  public url: string;
  public _prefix: string;
  public _objectName: string;
  public _HttpClient: HttpClient;
  constructor() {
    this.url = Memory.getUrl();
    this._prefix = '';
  }

  getService(_objectsuffix: string) {
    let headers = new HttpHeaders();

    headers = headers.append('Authorization', 'Bearer '+Memory.getToken());
    return this._HttpClient.get(
      this.url + this._prefix + this._objectName + _objectsuffix, {headers: headers});
  }
  getServiceBuffer(_objectsuffix: string) {
    let headers = new HttpHeaders();

    headers = headers.append('Authorization', 'Bearer '+Memory.getToken());
    return this._HttpClient.get(
      this.url + this._prefix + this._objectName + _objectsuffix, {headers: headers,responseType:'arraybuffer'});
  }

  postService(value: any, _objectsuffix: string) {
    let headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+Memory.getToken()
      }
    );

    return this._HttpClient.post(this.url + this._prefix + this._objectName +
      _objectsuffix, JSON.stringify(value), {headers: headers});
  }


  putService(value: any, _objectsuffix: string) {
    let headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+Memory.getToken()
      }
    );
    return this._HttpClient.put(this.url + this._prefix + this._objectName +
      _objectsuffix
      , JSON.stringify(value), {headers: headers});
  }
  putServiceText(value: any, _objectsuffix: string) {
    let headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+Memory.getToken()
      }
    );
    return this._HttpClient.put(this.url + this._prefix + this._objectName +
      _objectsuffix
      , JSON.stringify(value), {headers: headers,responseType:'text'});
  }

  deleteService(id: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer '+Memory.getToken());
    return this._HttpClient.delete(this.url + this._prefix + this._objectName + '/' + (id)
      , {headers: headers});
  }


  getServiceF(_objectsuffix: string) {
    return this._HttpClient.get(
      this.url + this._prefix + this._objectName + _objectsuffix);
  }

  postServiceF(value: any, _objectsuffix: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this._HttpClient.post(this.url + this._prefix + this._objectName +
      _objectsuffix, JSON.stringify(value), {headers: headers});
  }

  putServiceF(value: any, _objectsuffix: string) {
    const headers = new HttpHeaders(
      {'Content-Type': 'application/json'}
    );
    return this._HttpClient.put(this.url + this._prefix + this._objectName +
      _objectsuffix
      , JSON.stringify(value), {headers: headers});
  }

}

