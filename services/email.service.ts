import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InquiryModel } from '../shared/models/inquiry.model';
import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
@Injectable()
export class EmailService extends ServiceBase2{

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }
  inquiryEmail(form){
    return this.postServiceF(`email`,form);
  }
  addNews(filter: Object){
    return this.postServiceF(`newsletter/subscribe`,filter)
  }
}
