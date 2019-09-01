import { Injectable } from '@angular/core';
import {ServiceBase2} from "./serivce-base2.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ServiceBase2{

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/notification'
  }
  getNotificationByFilter(params:string) {
    return this.getService(`/filter/${params}`);
  }
}
