import { Injectable } from '@angular/core';
import {Memory} from "../base/memory";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
declare var moment;
@Injectable()

export class ContactService extends ServiceBase2{

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/agencies/contact-us';
  }
  addComment(content,id){
    return this.postServiceF(`?agency_id=${id}`,content);
  }
}
